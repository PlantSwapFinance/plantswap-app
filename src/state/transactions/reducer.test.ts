import { ChainId } from '@pancakeswap/sdk'
import { initialState, TransactionState, transactionsReducer } from './store'

describe('transaction reducer', () => {
  describe('addTransaction', () => {
    it('adds the transaction', () => {
      const beforeTime = new Date().getTime()
      const next = transactionsReducer(initialState, {
        type: 'transactions/addTransaction',
        payload: {
          chainId: ChainId.MAINNET,
          summary: 'hello world',
          hash: '0x0',
          approval: { tokenAddress: 'abc', spender: 'def' },
          from: 'abc',
        },
      })
      expect(next[ChainId.MAINNET]).toBeTruthy()
      expect(next[ChainId.MAINNET]?.['0x0']).toBeTruthy()
      const tx = next[ChainId.MAINNET]?.['0x0']
      expect(tx).toBeTruthy()
      expect(tx?.hash).toEqual('0x0')
      expect(tx?.summary).toEqual('hello world')
      expect(tx?.approval).toEqual({ tokenAddress: 'abc', spender: 'def' })
      expect(tx?.from).toEqual('abc')
      expect(tx?.addedTime).toBeGreaterThanOrEqual(beforeTime)
    })
  })

  describe('finalizeTransaction', () => {
    it('no op if not valid transaction', () => {
      const next = transactionsReducer(initialState, {
        type: 'transactions/finalizeTransaction',
        payload: {
          chainId: ChainId.TESTNET,
          hash: '0x0',
          receipt: {
            status: 1,
            transactionIndex: 1,
            transactionHash: '0x0',
            to: '0x0',
            from: '0x0',
            contractAddress: '0x0',
            blockHash: '0x0',
            blockNumber: 1,
          },
        },
      })
      expect(next).toEqual({})
    })
    it('sets receipt', () => {
      const after1 = transactionsReducer(initialState, {
        type: 'transactions/addTransaction',
        payload: {
          hash: '0x0',
          chainId: ChainId.TESTNET,
          approval: { spender: '0x0', tokenAddress: '0x0' },
          summary: 'hello world',
          from: '0x0',
        },
      })
      const beforeTime = new Date().getTime()
      const next = transactionsReducer(after1, {
        type: 'transactions/finalizeTransaction',
        payload: {
          chainId: ChainId.TESTNET,
          hash: '0x0',
          receipt: {
            status: 1,
            transactionIndex: 1,
            transactionHash: '0x0',
            to: '0x0',
            from: '0x0',
            contractAddress: '0x0',
            blockHash: '0x0',
            blockNumber: 1,
          },
        },
      })
      const tx = next[ChainId.TESTNET]?.['0x0']
      expect(tx?.summary).toEqual('hello world')
      expect(tx?.confirmedTime).toBeGreaterThanOrEqual(beforeTime)
      expect(tx?.receipt).toEqual({
        status: 1,
        transactionIndex: 1,
        transactionHash: '0x0',
        to: '0x0',
        from: '0x0',
        contractAddress: '0x0',
        blockHash: '0x0',
        blockNumber: 1,
      })
    })
  })

  describe('checkedTransaction', () => {
    it('no op if not valid transaction', () => {
      const next = transactionsReducer(initialState, {
        type: 'transactions/checkedTransaction',
        payload: { chainId: ChainId.TESTNET, hash: '0x0', blockNumber: 1 },
      })
      expect(next).toEqual({})
    })
    it('sets lastCheckedBlockNumber', () => {
      const after1 = transactionsReducer(initialState, {
        type: 'transactions/addTransaction',
        payload: {
          hash: '0x0',
          chainId: ChainId.TESTNET,
          approval: { spender: '0x0', tokenAddress: '0x0' },
          summary: 'hello world',
          from: '0x0',
        },
      })
      const next = transactionsReducer(after1, {
        type: 'transactions/checkedTransaction',
        payload: { chainId: ChainId.TESTNET, hash: '0x0', blockNumber: 1 },
      })
      const tx = next[ChainId.TESTNET]?.['0x0']
      expect(tx?.lastCheckedBlockNumber).toEqual(1)
    })
    it('never decreases', () => {
      const after1 = transactionsReducer(initialState, {
        type: 'transactions/addTransaction',
        payload: {
          hash: '0x0',
          chainId: ChainId.TESTNET,
          approval: { spender: '0x0', tokenAddress: '0x0' },
          summary: 'hello world',
          from: '0x0',
        },
      })
      const after2 = transactionsReducer(after1, {
        type: 'transactions/checkedTransaction',
        payload: { chainId: ChainId.TESTNET, hash: '0x0', blockNumber: 3 },
      })
      const after3 = transactionsReducer(after2, {
        type: 'transactions/checkedTransaction',
        payload: { chainId: ChainId.TESTNET, hash: '0x0', blockNumber: 1 },
      })
      const tx = after3[ChainId.TESTNET]?.['0x0']
      expect(tx?.lastCheckedBlockNumber).toEqual(3)
    })
  })

  describe('clearAllTransactions', () => {
    it('removes all transactions for the chain', () => {
      const after1: TransactionState = transactionsReducer(initialState, {
        type: 'transactions/addTransaction',
        payload: {
          chainId: ChainId.MAINNET,
          summary: 'hello world',
          hash: '0x0',
          approval: { tokenAddress: 'abc', spender: 'def' },
          from: 'abc',
        },
      })
      const after2: TransactionState = transactionsReducer(after1, {
        type: 'transactions/addTransaction',
        payload: {
          chainId: ChainId.TESTNET,
          summary: 'hello world',
          hash: '0x1',
          approval: { tokenAddress: 'abc', spender: 'def' },
          from: 'abc',
        },
      })
      expect(Object.keys(after2)).toHaveLength(2)
      expect(Object.keys(after2)).toEqual([String(ChainId.MAINNET), String(ChainId.TESTNET)])
      expect(Object.keys(after2[ChainId.MAINNET] ?? {})).toEqual(['0x0'])
      expect(Object.keys(after2[ChainId.TESTNET] ?? {})).toEqual(['0x1'])
      const afterClear = transactionsReducer(after2, {
        type: 'transactions/clearAllTransactions',
        payload: { chainId: ChainId.MAINNET },
      })
      expect(Object.keys(afterClear)).toHaveLength(2)
      expect(Object.keys(afterClear)).toEqual([String(ChainId.MAINNET), String(ChainId.TESTNET)])
      expect(Object.keys(afterClear[ChainId.MAINNET] ?? {})).toEqual([])
      expect(Object.keys(afterClear[ChainId.TESTNET] ?? {})).toEqual(['0x1'])
    })
  })
})