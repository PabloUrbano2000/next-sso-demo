import { JSX } from 'react'

type ButtonElement = JSX.Element | React.ReactElement<unknown, string> | string

interface Props {
  children: ButtonElement
  type?: 'submit' | 'button'
  disabled?: boolean
  style?: 'light' | 'dark'
  onClick?: () => void
}

export const Button = ({
  children,
  type = 'button',
  disabled = false,
  style = 'light',
  onClick
}: Props): React.ReactNode => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button ${style}`}
    >
      {children}
    </button>
  )
}
