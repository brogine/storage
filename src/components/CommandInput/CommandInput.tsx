import { ChangeEvent, useCallback } from 'react'
import { DebounceInput } from 'react-debounce-input'
import useCommandHandler from '../../hooks/useCommandHandler'
import CommandTooltipHelp from './CommandTooltipHelp'
import './CommandInput.css'

const ROOT_CLASS = 'command-input'
const CONTAINER_CLASS = `${ROOT_CLASS}__container`
const DATA_CONTAINER_CLASS = `${ROOT_CLASS}__data`
const HELPERS_CONTAINER_CLASS = `${ROOT_CLASS}__helpers`
const INPUT_TEXT_CLASS = `${ROOT_CLASS}__text`
const SUBMIT_CLASS = `${ROOT_CLASS}__submit`

export default function CommandInput() {
  const [validateInput, dispatchCommand, rawValue, isValid, errorMessage] = useCommandHandler()
  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => validateInput(event.target.value),
    [validateInput],
  )
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return

    dispatchCommand()
  }

  return (
    <div className={CONTAINER_CLASS}>
      <div className={DATA_CONTAINER_CLASS}>
        <DebounceInput
          className={INPUT_TEXT_CLASS}
          placeholder='Write a command'
          minLength={3}
          debounceTimeout={300}
          onChange={handleInputChange}
          onKeyUp={handleKeyPress}
          value={rawValue}
        />
        <button className={SUBMIT_CLASS} disabled={!isValid} onClick={dispatchCommand}>
          Submit
        </button>
      </div>
      <div className={HELPERS_CONTAINER_CLASS}>
        {errorMessage ? <div className='is-invalid'>{errorMessage}</div> : null}
        <CommandTooltipHelp />
      </div>
    </div>
  )
}
