import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'

// Captured by the jest.mock factories below so individual tests can inspect
// what the hook did without resorting to require().
const mockToastError = jest.fn()

// Mock the hook's collaborators so we can exercise it in isolation without
// standing up a real web3 provider, toast portal, or i18n context.
jest.mock('hooks/useActiveWeb3React', () => ({
  __esModule: true,
  default: () => ({ account: '0xabc' }),
}))
jest.mock('hooks/useToast', () => ({
  __esModule: true,
  default: () => ({ toastError: mockToastError, toastSuccess: jest.fn() }),
}))
jest.mock('contexts/Localization', () => ({
  __esModule: true,
  useTranslation: () => ({ t: (s: string) => s }),
}))

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useApproveConfirmTransaction = require('./useApproveConfirmTransaction').default

// Minimal TransactionResponse shape the hook actually touches: a `wait()` method
// returning the receipt we want it to see.
const makeTx = (status: number) => ({
  wait: () => Promise.resolve({ status }),
})

type HookResult = ReturnType<typeof useApproveConfirmTransaction>
type HookProps = Parameters<typeof useApproveConfirmTransaction>[0]

// Renders the hook inside a real component, exposes its return value via a
// closure-scoped ref so the test can read it after each render.
let latest: HookResult | null = null
const Harness: React.FC<{ props: HookProps }> = ({ props }) => {
  const result = useApproveConfirmTransaction(props)
  useEffect(() => {
    latest = result
  })
  return null
}

// Asserts the ref has been populated by a prior render and narrows its type.
const getLatest = (): HookResult => {
  if (latest === null) {
    throw new Error('hook has not rendered yet')
  }
  return latest
}

const render = (props: HookProps) => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  act(() => {
    ReactDOM.render(<Harness props={props} />, container)
  })
  return {
    unmount: () => {
      act(() => {
        ReactDOM.unmountComponentAtNode(container)
      })
      container.remove()
    },
  }
}

describe('useApproveConfirmTransaction', () => {
  beforeEach(() => {
    mockToastError.mockClear()
  })

  afterEach(() => {
    latest = null
  })

  it('exposes loading flags derived from the reducer state', () => {
    render({
      onApprove: () => makeTx(1) as never,
      onConfirm: () => makeTx(1) as never,
      onSuccess: () => undefined,
    })
    const result = getLatest()
    expect(result.isApproving).toBe(false)
    expect(result.isApproved).toBe(false)
    expect(result.isConfirming).toBe(false)
    expect(result.isConfirmed).toBe(false)
  })

  it('flips isApproving to true synchronously on click, before the tx resolves', async () => {
    // tx.wait() blocks until we resolve it manually — gives us a chance to
    // observe the mid-flight state.
    let resolveWait!: (receipt: { status: number }) => void
    const tx = {
      wait: () =>
        new Promise<{ status: number }>((resolve) => {
          resolveWait = resolve
        }),
    }

    render({
      onApprove: () => tx as never,
      onConfirm: () => makeTx(1) as never,
      onSuccess: () => undefined,
    })

    await act(async () => {
      // Don't await: handleApprove awaits onApprove() (which returns synchronously),
      // then awaits tx.wait(). Kick it off and let microtasks flush.
      getLatest().handleApprove()
      // Yield to the microtask queue so the inner `await onApprove()` resolves
      // and the dispatch('approve_sending') happens.
      await Promise.resolve()
    })

    const mid = getLatest()
    expect(mid.isApproving).toBe(true)
    expect(mid.isApproved).toBe(false)

    // Now resolve the receipt and let the rest of handleApprove finish.
    await act(async () => {
      resolveWait({ status: 1 })
      // Let the awaited receipt + onApproveSuccess settle.
      await Promise.resolve()
      await Promise.resolve()
    })

    const end = getLatest()
    expect(end.isApproving).toBe(false)
    expect(end.isApproved).toBe(true)
  })

  it('passes state with approvalState=success to onApproveSuccess (not the stale pre-dispatch state)', async () => {
    const onApproveSuccess = jest.fn()

    render({
      onApprove: () => makeTx(1) as never,
      onConfirm: () => makeTx(1) as never,
      onSuccess: () => undefined,
      onApproveSuccess,
    })

    await act(async () => {
      await getLatest().handleApprove()
    })

    expect(onApproveSuccess).toHaveBeenCalledTimes(1)
    const passed = onApproveSuccess.mock.calls[0][0]
    // The whole point of the fix: callers must see approvalState === 'success',
    // not the 'loading' value that was in `state` at the time the closure was built.
    expect(passed).toEqual({ approvalState: 'success', confirmState: 'idle' })
  })

  it('passes state with confirmState=success to onSuccess', async () => {
    const onSuccess = jest.fn()

    render({
      onApprove: () => makeTx(1) as never,
      onConfirm: () => makeTx(1) as never,
      onSuccess,
    })

    await act(async () => {
      await getLatest().handleConfirm()
    })

    expect(onSuccess).toHaveBeenCalledTimes(1)
    const passed = onSuccess.mock.calls[0][0]
    expect(passed).toEqual({ approvalState: 'idle', confirmState: 'success' })
  })

  it('flips isApproved to false and surfaces the error toast when approve reverts', async () => {
    render({
      onApprove: () => ({ wait: () => Promise.reject(new Error('user rejected')) }) as never,
      onConfirm: () => makeTx(1) as never,
      onSuccess: () => undefined,
    })

    await act(async () => {
      await getLatest().handleApprove()
    })

    const result = getLatest()
    expect(result.isApproved).toBe(false)
    expect(result.isApproving).toBe(false)
    expect(mockToastError).toHaveBeenCalledTimes(1)
  })
})