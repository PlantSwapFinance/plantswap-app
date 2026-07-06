import { DEFAULT_DEADLINE_FROM_NOW, INITIAL_ALLOWED_SLIPPAGE } from '../../config/constants'
import { initialState, userReducer, UserState } from './store'

describe('user reducer', () => {
  describe('updateVersion', () => {
    it('has no timestamp originally', () => {
      expect(initialState.lastUpdateVersionTimestamp).toBeUndefined()
    })
    it('sets the lastUpdateVersionTimestamp', () => {
      const time = new Date().getTime()
      const next = userReducer(initialState, { type: 'global/updateVersion' })
      expect(next.lastUpdateVersionTimestamp).toBeGreaterThanOrEqual(time)
    })
    it('sets allowed slippage and deadline', () => {
      const start: UserState = {
        ...initialState,
        userDeadline: undefined as any,
        userSlippageTolerance: undefined as any,
      }
      const next = userReducer(start, { type: 'global/updateVersion' })
      expect(next.userDeadline).toEqual(DEFAULT_DEADLINE_FROM_NOW)
      expect(next.userSlippageTolerance).toEqual(INITIAL_ALLOWED_SLIPPAGE)
    })
  })
})