import { useState } from 'react'
import { useDispatch } from 'react-redux'
import commandValidationRules from '../config/commandValidationRules'
import { AvailableCommands } from '../config/types'
import {
  setRecord,
  deleteRecord,
  getRecord,
  countRecords,
  beginTransaction,
  commitLatestTransaction,
  rollbackLatestTransaction,
  logCommand,
} from '../features/keyValueStorage/keyValueStorageSlice'

const DEFAULT_STATE = {
  parsedCommand: {
    keyword: '',
    key: '',
    value: '',
    rawValue: '',
  },
  isValid: false,
  errorMessage: '',
}

const COMMAND_HISTORY_PREFIX = '>'

export default function useCommandHandler() {
  const dispatch = useDispatch()
  const [commandState, setComandState] = useState(DEFAULT_STATE)
  const { isValid, errorMessage, parsedCommand } = commandState

  const resetCommandState = () => {
    setComandState(DEFAULT_STATE)
  }

  const validateInput = (input: string) => {
    if (input === '') {
      resetCommandState()
      return
    }

    const [keyword, key, value] = input.split(' ', 3)
    const uppercaseKeyword = keyword?.toUpperCase()

    if (
      uppercaseKeyword === undefined ||
      !Object.values(AvailableCommands).includes(uppercaseKeyword as AvailableCommands)
    ) {
      setComandState({
        ...commandState,
        isValid: false,
        errorMessage: 'The command you introduced is not valid.',
      })
      return
    }

    const globalRule = commandValidationRules.GLOBAL.rule
    if (
      (key && !globalRule.expression.test(key.length.toString())) ||
      (value && !globalRule.expression.test(value.length.toString()))
    ) {
      setComandState({
        parsedCommand: { ...commandState.parsedCommand, rawValue: input },
        isValid: false,
        errorMessage: globalRule.errorMessage,
      })
      return
    }

    // Supporting commands to be on case insensitive
    const parsedInput = input.replace(keyword, uppercaseKeyword)
    const ruleToApply = commandValidationRules[uppercaseKeyword as AvailableCommands].rule
    if (!ruleToApply.expression.test(parsedInput)) {
      setComandState({
        parsedCommand: { ...commandState.parsedCommand, rawValue: parsedInput },
        isValid: false,
        errorMessage: ruleToApply.errorMessage,
      })
      return
    }

    setComandState({
      parsedCommand: { keyword: uppercaseKeyword, key, value, rawValue: parsedInput },
      isValid: true,
      errorMessage: '',
    })
  }

  const dispatchCommand = () => {
    if (!isValid) return

    dispatch(logCommand(`${COMMAND_HISTORY_PREFIX} ${parsedCommand.rawValue}`))
    switch (parsedCommand.keyword) {
      case AvailableCommands.SET:
        dispatch(setRecord([parsedCommand.key, parsedCommand.value]))
        break
      case AvailableCommands.DELETE:
        dispatch(deleteRecord(parsedCommand.key))
        break
      case AvailableCommands.BEGIN:
        dispatch(beginTransaction())
        break
      case AvailableCommands.COMMIT:
        dispatch(commitLatestTransaction())
        break
      case AvailableCommands.ROLLBACK:
        dispatch(rollbackLatestTransaction())
        break
      case AvailableCommands.GET:
        dispatch(getRecord(parsedCommand.key))
        break
      case AvailableCommands.COUNT:
        dispatch(countRecords(parsedCommand.key))
        break
      default:
        setComandState({
          ...commandState,
          isValid: false,
          errorMessage: `Command not implemented: ${parsedCommand.keyword}`,
        })
        break
    }

    resetCommandState()
  }

  return [validateInput, dispatchCommand, parsedCommand.rawValue, isValid, errorMessage] as const
}
