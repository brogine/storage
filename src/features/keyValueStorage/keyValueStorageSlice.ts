/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StorageState } from '../../config/types'

const initialState = {
  records: {},
  transactions: [],
  logs: [],
} as StorageState

export const keyValueStorageSlice = createSlice({
  name: 'keyValueStorage',
  initialState,
  reducers: {
    setRecord: (state, action: PayloadAction<[string, string]>) => {
      const [key, value] = action.payload

      // If we're in a transaction, set there.
      const transactionsLength = state.transactions.length
      if (transactionsLength > 0) {
        state.transactions[transactionsLength - 1].records[key] = value
        return
      }

      state.records[key] = value
    },
    deleteRecord: (state, action: PayloadAction<string>) => {
      // If we're in a transaction, delete there.
      const transactionsLength = state.transactions.length
      if (transactionsLength > 0) {
        const lastTransaction = state.transactions[transactionsLength - 1]
        if (Object.keys(lastTransaction.records).length === 1) {
          state.transactions.pop()
        } else {
          delete state.transactions[transactionsLength - 1].records[action.payload]
        }
        return
      }

      // Otherwise, we're just working over the state
      delete state.records[action.payload]
    },
    getRecord: (state, action: PayloadAction<string>) => {
      const transactionsLength = state.transactions.length
      const { records } =
        transactionsLength > 0 ? state.transactions[transactionsLength - 1] : state
      state.logs.push(records[action.payload] || 'key not set')
    },
    countRecords: (state, action: PayloadAction<string>) => {
      const transactionsLength = state.transactions.length
      const { records } =
        transactionsLength > 0 ? state.transactions[transactionsLength - 1] : state
      const elementsByValueCount = Object.values(records).reduce(
        (acc, element) => (acc += element === action.payload ? 1 : 0),
        0,
      )
      state.logs.push(elementsByValueCount.toString())
    },
    beginTransaction: (state) => {
      // We're going to use last transaction image or the state as source of truth
      const transactionsLength = state.transactions.length
      const recordsImage = transactionsLength
        ? state.transactions[transactionsLength - 1].records
        : state.records
      state.transactions.push({ records: recordsImage })
    },
    commitLatestTransaction: (state) => {
      const transactionToMerge = state.transactions.pop()

      // No transactions, return
      if (transactionToMerge === undefined) {
        state.logs.push('no transaction')
        return
      }

      // last transaction was popped, merge with state
      const transactionsLength = state.transactions.length
      if (transactionsLength === 0) {
        state.records = transactionToMerge.records
      } else {
        // merge with previous transaction
        state.transactions[transactionsLength - 1] = transactionToMerge
      }
    },
    rollbackLatestTransaction: (state) => {
      if (state.transactions.length === 0) {
        state.logs.push('no transaction')
        return
      }

      state.transactions.pop()
    },
    logCommand: (state, action: PayloadAction<string>) => {
      state.logs.push(action.payload)
    },
  },
})

export const {
  setRecord,
  deleteRecord,
  getRecord,
  countRecords,
  beginTransaction,
  commitLatestTransaction,
  rollbackLatestTransaction,
  logCommand,
} = keyValueStorageSlice.actions

export default keyValueStorageSlice.reducer
