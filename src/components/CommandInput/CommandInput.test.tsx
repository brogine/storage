import { renderWithProviders } from '../../utils/testUtils';
import { fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import CommandInput from './CommandInput';

const inputSelector = /^Write a command$/
const helpLabelSelector = /^Do you need help with the commands\?$/
const submitSelector = /^Submit$/
const invalidCommandErrorMsgSelector = /^The command you introduced is not valid.$/

describe('CommandInput', () => {
  test('renders application with all the structure', () => {
    renderWithProviders(<CommandInput />);

    expect(screen.getByPlaceholderText(inputSelector)).toBeVisible()
    expect(screen.getByText(helpLabelSelector)).toBeVisible()
    expect(screen.getByText(submitSelector)).toBeDisabled()
  })

  test('when provided with a valid command', async () => {
    renderWithProviders(<CommandInput />);

    const input = screen.getByPlaceholderText(inputSelector)
    fireEvent.change(input, {target: { value: 'COMMIT' }})

    await waitFor(() => expect(screen.getByText(submitSelector)).toBeEnabled())
  })

  test('when provided with an invalid command', async () => {
    renderWithProviders(<CommandInput />);

    const input = screen.getByPlaceholderText(inputSelector)
    fireEvent.change(input, {target: { value: 'FALSE' }})

    await waitFor(() => expect(screen.getByText(invalidCommandErrorMsgSelector)).toBeVisible())
    expect(screen.getByText(submitSelector)).toBeDisabled()
  })

  test('when first provided with an invalid command but then fixed it', async () => {
    renderWithProviders(<CommandInput />);

    const input = screen.getByPlaceholderText(inputSelector)
    fireEvent.change(input, {target: { value: 'FALSE' }})

    await waitFor(() => expect(screen.getByText(invalidCommandErrorMsgSelector)).toBeVisible())
    expect(screen.getByText(submitSelector)).toBeDisabled()

    fireEvent.change(input, {target: { value: 'BEGIN' }})

    await waitForElementToBeRemoved(() => screen.queryByText(invalidCommandErrorMsgSelector))
    expect(screen.getByText(submitSelector)).toBeEnabled()
  })

  test('hovering helper label opens up the tooltip', async () => {
    renderWithProviders(<CommandInput />);

    const helperLabel = screen.getByText(helpLabelSelector)
    fireEvent.mouseOver(helperLabel)

    await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible())
  })
})
