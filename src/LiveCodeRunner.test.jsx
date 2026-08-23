import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LiveCodeRunner } from './LiveCodeRunner'

describe('LiveCodeRunner', () => {
  it('shows Caesar sample output and updates when shift changes', async () => {
    const user = userEvent.setup()
    render(<LiveCodeRunner topicId="caesar" />)

    expect(screen.getByRole('status')).toHaveTextContent(/KHOOR/)

    const shift = screen.getByLabelText(/Shift \(0–25\)/)
    await user.clear(shift)
    await user.type(shift, '1')

    expect(screen.getByRole('status')).toHaveTextContent(/IFMMP/)
  })

  it('renders nothing for an unknown topic id', () => {
    const { container } = render(<LiveCodeRunner topicId="nope" />)
    expect(container).toBeEmptyDOMElement()
  })
})
