export enum AvailableCommands {
  SET = 'SET',
  GET = 'GET',
  DELETE = 'DELETE',
  COUNT = 'COUNT',
  BEGIN = 'BEGIN',
  COMMIT = 'COMMIT',
  ROLLBACK = 'ROLLBACK',
}

export interface StorageState {
  records: { [key: string]: string }
  transactions: {
    records: { [key: string]: string }
  }[]
  logs: string[]
}
