import reducer, {
  setRecord,
  deleteRecord,
  getRecord,
  countRecords,
  beginTransaction,
  commitLatestTransaction,
  rollbackLatestTransaction,
} from './keyValueStorageSlice'

describe('keyValueStorageSlice', () => {
  const emptyState = { records: {}, transactions: [], logs: [] }

  describe('setRecord', () => {
    test('should handle an element being added to empty records list', () => {
      expect(reducer(emptyState, setRecord(['key', 'value']))).toEqual({
        records: { key: 'value' },
        transactions: [],
        logs: [],
      })
    })
    test('should handle an element being added to non empty records list', () => {
      const previousState = { ...emptyState, records: { key: 'value' } }

      expect(reducer(previousState, setRecord(['key2', 'value']))).toEqual({
        records: { key: 'value', key2: 'value' },
        transactions: [],
        logs: [],
      })
    })
    test('should replace an element being added to non empty records list with same key', () => {
      const previousState = { ...emptyState, records: { key: 'value' } }

      expect(reducer(previousState, setRecord(['key', 'newvalue']))).toEqual({
        records: { key: 'newvalue' },
        transactions: [],
        logs: [],
      })
    })

    describe('when there is an activetransaction', () => {
      test('replaces last transaction value only', () => {
        const previousState = {
          records: { key: 'value' },
          transactions: [{ records: { key: 'value' } }, { records: { key: 'value' } }],
          logs: [],
        }

        expect(reducer(previousState, setRecord(['key', 'newvalue']))).toEqual({
          records: { key: 'value' },
          transactions: [{ records: { key: 'value' } }, { records: { key: 'newvalue' } }],
          logs: [],
        })
      })
    })
  })

  describe('deleteRecord', () => {
    test('should not error out when non-existing element is being removed from records list', () => {
      expect(reducer(emptyState, deleteRecord('key'))).toEqual({
        records: {},
        transactions: [],
        logs: [],
      })
    })
    test('should handle an existing element being removed from records list', () => {
      const previousState = { ...emptyState, records: { key: 'value', key2: 'value' } }

      expect(reducer(previousState, deleteRecord('key'))).toEqual({
        records: { key2: 'value' },
        transactions: [],
        logs: [],
      })
    })

    describe('when there is an active transaction', () => {
      test('with one key, deletes the entire entry', () => {
        const previousState = {
          records: { key: 'value' },
          transactions: [{ records: { key: 'another' } }, { records: { key: 'value' } }],
          logs: [],
        }

        expect(reducer(previousState, deleteRecord('key'))).toEqual({
          records: { key: 'value' },
          transactions: [{ records: { key: 'another' } }],
          logs: [],
        })
      })
      test('with more than one key, deletes the key', () => {
        const previousState = {
          records: { key: 'value' },
          transactions: [{ records: { key: 'another', key2: 'value' } }],
          logs: [],
        }

        expect(reducer(previousState, deleteRecord('key2'))).toEqual({
          records: { key: 'value' },
          transactions: [{ records: { key: 'another' } }],
          logs: [],
        })
      })
    })
  })

  describe('getRecord', () => {
    test('should return undefined when key is not present', () => {
      expect(reducer(emptyState, getRecord('nonexistent'))).toEqual({
        records: {},
        transactions: [],
        logs: ['key not set'],
      })
    })
    test('should return proper value when key is present', () => {
      const storageState = {
        records: { key: 'value', key2: 'another' },
        transactions: [],
        logs: [],
      }
      expect(reducer(storageState, getRecord('key2'))).toEqual({
        records: { key: 'value', key2: 'another' },
        transactions: [],
        logs: ['another'],
      })
    })
    test('should prioritize transactions values over state', () => {
      const storageState = {
        records: { key: 'value' },
        transactions: [{ records: { key: 'updated' } }],
        logs: [],
      }
      expect(reducer(storageState, getRecord('key'))).toEqual({
        records: { key: 'value' },
        transactions: [{ records: { key: 'updated' } }],
        logs: ['updated'],
      })
    })
  })

  describe('countRecords', () => {
    test('should return zero when key is not present', () => {
      expect(reducer(emptyState, countRecords('nonexistent'))).toEqual({
        records: {},
        transactions: [],
        logs: ['0'],
      })
    })
    test('should return proper count when value is present', () => {
      const storageState = {
        records: { key: 'value', key2: 'another', key3: 'another' },
        transactions: [],
        logs: [],
      }
      expect(reducer(storageState, countRecords('another'))).toEqual({
        records: { key: 'value', key2: 'another', key3: 'another' },
        transactions: [],
        logs: ['2'],
      })
    })
    test('should prioritize transactions values over state', () => {
      const storageState = {
        records: { key: 'value' },
        transactions: [{ records: { key: 'updated' } }],
        logs: [],
      }
      expect(reducer(storageState, countRecords('value'))).toEqual({
        records: { key: 'value' },
        transactions: [{ records: { key: 'updated' } }],
        logs: ['0'],
      })
    })
  })

  describe('beginTransaction', () => {
    test('should add a new transaction to transactions list', () => {
      expect(reducer(emptyState, beginTransaction())).toEqual({
        records: {},
        transactions: [{ records: {} }],
        logs: [],
      })
    })
    test('should clone records status from state when there are no other open transactions', () => {
      const previousState = { ...emptyState, records: { key: 'value', key2: 'value' } }

      expect(reducer(previousState, beginTransaction())).toEqual({
        records: { key: 'value', key2: 'value' },
        transactions: [{ records: { key: 'value', key2: 'value' } }],
        logs: [],
      })
    })
    test('should clone records status from previous open transaction when available', () => {
      const previousState = {
        records: { key: 'value', key2: 'value' },
        transactions: [{ records: { key: 'value' } }],
        logs: [],
      }

      expect(reducer(previousState, beginTransaction())).toEqual({
        records: { key: 'value', key2: 'value' },
        transactions: [{ records: { key: 'value' } }, { records: { key: 'value' } }],
        logs: [],
      })
    })
  })

  describe('commitLatestTransaction', () => {
    test('should perform no actions when there are no open transactions', () => {
      const previousState = { records: { key: 'value', key2: 'value' }, transactions: [], logs: [] }

      expect(reducer(previousState, commitLatestTransaction())).toEqual({
        records: { key: 'value', key2: 'value' },
        transactions: [],
        logs: ['no transaction'],
      })
    })
    test('should merge into records when its the last transaction', () => {
      const previousState = {
        records: { key: 'value', key2: 'value' },
        transactions: [{ records: { key: 'value' } }],
        logs: [],
      }

      expect(reducer(previousState, commitLatestTransaction())).toEqual({
        records: { key: 'value' },
        transactions: [],
        logs: [],
      })
    })
    test('should merge into next transaction when its not the last transaction', () => {
      const previousState = {
        records: {},
        transactions: [{ records: { key: 'value' } }, { records: { key: 'newvalue' } }],
        logs: [],
      }

      expect(reducer(previousState, commitLatestTransaction())).toEqual({
        records: {},
        transactions: [{ records: { key: 'newvalue' } }],
        logs: [],
      })
    })
  })

  describe('rollbackLatestTransaction', () => {
    test('should perform no actions when there are no open transactions', () => {
      const previousState = { records: { key: 'value', key2: 'value' }, transactions: [], logs: [] }

      expect(reducer(previousState, rollbackLatestTransaction())).toEqual({
        records: { key: 'value', key2: 'value' },
        transactions: [],
        logs: ['no transaction'],
      })
    })

    test('should discard last transaction changes', () => {
      const previousState = {
        records: {},
        transactions: [{ records: { key: 'value' } }, { records: { key: 'changed' } }],
        logs: [],
      }

      expect(reducer(previousState, rollbackLatestTransaction())).toEqual({
        records: {},
        transactions: [{ records: { key: 'value' } }],
        logs: [],
      })
    })
  })
})
