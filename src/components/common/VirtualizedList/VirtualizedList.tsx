import { FixedSizeList as List } from 'react-window'

interface VirtualizedListProps {
  items: string[]
  className?: string
  itemSize?: number
  height?: number
}

export default function VirtualizedList({ items, className, itemSize = 20, height= 700 }: VirtualizedListProps) {
  return (
    <List
      className={className}
      innerElementType="ul"
      itemData={items}
      itemCount={items.length}
      itemSize={itemSize}
      height={height}
      width={'60%'}
    >
      {({ index, style, data }) => (
        <li style={style}>
          <span title={data[index]}>{data[index]}</span>
        </li>
      )}
    </List>
  )
}
