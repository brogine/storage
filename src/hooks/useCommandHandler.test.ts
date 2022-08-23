import { act } from '@testing-library/react'
import commandValidationRules from '../config/commandValidationRules'
import useCommandHandler from './useCommandHandler'
import { renderHookWithProvider } from '../utils/testUtils'

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}))

describe('useCommandHandler', () => {
  describe('validateInput', () => {
    test('with valid command but missing params', () => {
      const { result } = renderHookWithProvider(useCommandHandler)
      const [validateInput] = result.current

      act(() => {
        validateInput('GET')
      })

      const [, , , isValid, errorMessage] = result.current

      expect(isValid).toBe(false)
      expect(errorMessage).toBe(commandValidationRules['GET'].rule.errorMessage)
    })

    test('with a valid command on lowercase', () => {
      const { result } = renderHookWithProvider(useCommandHandler)
      const [validateInput] = result.current

      act(() => {
        validateInput('begin')
      })

      const [, , rawValue, isValid, errorMessage] = result.current
      expect(isValid).toBe(true)
      expect(errorMessage).toBe('')
      expect(rawValue).toEqual('BEGIN')
    })

    test('with a valid command and valid param', () => {
      const { result } = renderHookWithProvider(useCommandHandler)
      const [validateInput] = result.current

      act(() => {
        validateInput('GET somekey')
      })

      const [, , rawValue, isValid, errorMessage] = result.current

      expect(isValid).toBe(true)
      expect(errorMessage).toBe('')
      expect(rawValue).toEqual('GET somekey')
    })

    test('with an unexisting command', () => {
      const { result } = renderHookWithProvider(useCommandHandler)
      const [validateInput] = result.current

      act(() => {
        validateInput('BNB')
      })

      const [, , , isValid, errorMessage] = result.current
      expect(isValid).toBe(false)
      expect(errorMessage).toBe('The command you introduced is not valid.')
    })

    test('with value longer than 255 characters', () => {
      const { result } = renderHookWithProvider(useCommandHandler)
      const [validateInput] = result.current

      act(() => {
        validateInput(`GET ${[...Array(256)].map(() => 'a').join('')}`)
      })

      const [, , , isValid, errorMessage] = result.current
      expect(isValid).toBe(false)
      expect(errorMessage).toBe('Key and value can\'t be longer than 256 characters each.')
    })
  })

  describe('dispatchCommand', () => {
    test('when is not a valid command', () => {
      const { result } = renderHookWithProvider(useCommandHandler)
      const [validateInput, dispatchCommand] = result.current

      act(() => {
        validateInput('GET')
        dispatchCommand()
      })

      const [, , , isValid, errorMessage] = result.current

      expect(isValid).toBe(false)
      expect(errorMessage).toBe(commandValidationRules['GET'].rule.errorMessage)
    })

    describe('when is a valid command', () => {
      test('dispatches the proper actions', async () => {
        const { result } = renderHookWithProvider(useCommandHandler)
        let [validateInput] = result.current

        act(() => {
          validateInput('DELETE someKey')
        })

        const [, dispatchCommand, rawValue, isValid, errorMessage] = result.current

        expect(rawValue).toBe('DELETE someKey')
        expect(isValid).toBe(true)
        expect(errorMessage).toBe('')

        act(() => {
          dispatchCommand()
        })

        expect(mockDispatch).toHaveBeenCalledTimes(2)
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: 'DELETE someKey',
          type: 'keyValueStorage/logCommand',
        })
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: 'someKey',
          type: 'keyValueStorage/deleteRecord',
        })
      })
    })
  })
})
