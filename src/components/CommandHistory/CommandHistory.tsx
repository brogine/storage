import { connect } from 'react-redux'
import { RootState } from '../../store'
import VirtualizedList from '../common/VirtualizedList/VirtualizedList'
import './CommandHistory.css'

const ROOT_CLASS = 'command-history'
const CONTAINER_CLASS = `${ROOT_CLASS}__container`
const LIST_CLASS = `${ROOT_CLASS}__list`

interface CommandHistoryProps {
  commandsLog: string[]
}

const CommandHistory = ({ commandsLog }: CommandHistoryProps) => {
  return (
    <section className={CONTAINER_CLASS}>
      <h2>Command History</h2>
      <VirtualizedList items={commandsLog} className={LIST_CLASS} />
    </section>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    commandsLog: state.storage.logs,
  }
}

export default connect(mapStateToProps)(CommandHistory)
