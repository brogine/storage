import './Tooltip.css'

interface TooltipProps {
  id?: string
  children: JSX.Element
}

export default function Tooltip({ id, children }: TooltipProps) {
  return (
    <div className='tooltip' role='tooltip' id={id}>
      <div className='text-content'>{children}</div>
      <i></i>
    </div>
  )
}
