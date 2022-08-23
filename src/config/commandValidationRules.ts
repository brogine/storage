import { AvailableCommands } from './types'

const commandValidationRules = {
  [AvailableCommands.GET]: {
    rule: {
      expression: /^(GET)\s(\w+)$/,
      errorMessage: '[GET <key>] command is not valid.',
    },
  },
  [AvailableCommands.SET]: {
    rule: {
      expression: /^(SET)\s(\w+)\s(\w+)$/,
      errorMessage: '[SET <key> <value>] command is not valid.',
    },
  },
  [AvailableCommands.COUNT]: {
    rule: {
      expression: /^(COUNT)\s(\w+)$/,
      errorMessage: '[COUNT <key>] command is not valid.',
    },
  },
  [AvailableCommands.DELETE]: {
    rule: {
      expression: /^(DELETE)\s(\w+)$/,
      errorMessage: '[DELETE <key>] command is not valid.',
    },
  },
  [AvailableCommands.BEGIN]: {
    rule: {
      expression: /^(BEGIN)$/,
      errorMessage: '[BEGIN] command is not valid.',
    },
  },
  [AvailableCommands.COMMIT]: {
    rule: {
      expression: /^(COMMIT)$/,
      errorMessage: '[COMMIT] command is not valid.',
    },
  },
  [AvailableCommands.ROLLBACK]: {
    rule: {
      expression: /^(ROLLBACK)$/,
      errorMessage: '[ROLLBACK] command is not valid.',
    },
  },
  GLOBAL: {
    rule: {
      expression: /^([1-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
      errorMessage: 'Key and value can\'t be longer than 256 characters each.',
    },
  },
}

export default commandValidationRules
