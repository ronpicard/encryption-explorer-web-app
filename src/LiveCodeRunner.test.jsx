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

  it('shows the full Caesar plaintext in the formula, matching the encrypted result', async () => {
    const user = userEvent.setup()
    render(<LiveCodeRunner topicId="caesar" />)

    const text = screen.getByLabelText(/Letters \(A–Z\)/)
    await user.clear(text)
    await user.type(text, 'HI THERE')

    const out = screen.getByRole('status')
    expect(out).toHaveTextContent(/caesarEncrypt\("HI THERE", 3\)/)
    expect(out).toHaveTextContent(/→ "KL WKHUH"/)
  })

  it('renders nothing for an unknown topic id', () => {
    const { container } = render(<LiveCodeRunner topicId="nope" />)
    expect(container).toBeEmptyDOMElement()
  })
})
