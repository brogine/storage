import { useState } from 'react'
import Tooltip from '../common/Tooltip/Tooltip'
import './CommandTooltipHelp.css'

const CommandTooltipHelp = () => {
  const [tooltipVisible, setTooltipVisible] = useState(false)

  return (
    <div className='command-tooltip-help-container'>
      <label
        aria-describedby="command-tooltip-help"
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        Do you need help with the commands?
      </label>
      {tooltipVisible ?
        <Tooltip id="command-tooltip-help">
          <article>
            <p>Important: keys and values are Case Sensitive. Commands are not.</p>
            <p>Keys and values only accept strings and digits with a maximum of 255 characters each.</p>
            <h4>Commands information:</h4>
            <dl>
              <dt>SET (key) (value)</dt>
              <dd>Store the value for key</dd>
              <dt>GET (key)</dt>
              <dd>Return the current value for key</dd>
              <dt>DELETE (key)</dt>
              <dd>Remove the entry for key</dd>
              <dt>COUNT (value)</dt>
              <dd>Return the number of keys that have the given value</dd>
              <dt>BEGIN</dt>
              <dd>Start a new transaction</dd>
              <dt>COMMIT</dt>
              <dd>Complete the current transaction</dd>
              <dt>ROLLBACK</dt>
              <dd>Revert to state prior to BEGIN call</dd>
            </dl>
          </article>
        </Tooltip>
      : null}
    </div>
  )
}

export default CommandTooltipHelp
