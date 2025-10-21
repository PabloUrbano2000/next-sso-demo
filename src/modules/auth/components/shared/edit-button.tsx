interface Props {
  onClick: () => void
}
export const EditButton = ({ onClick }: Props): React.ReactNode => {
  return (
    <button type='button' className='widget-btn' onClick={onClick}>
      Editar
    </button>
  )
}
