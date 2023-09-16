import Default from './Default'
import ImageRight from './ImageRight'
import Card from './Card'

function ImageLeft(props) {
  return <ImageRight className="flex-row-reverse" {...props} />
}

export const layout = {
  default: Default,
  'image-right': ImageRight,
  'image-left': ImageLeft,
  card: Card,
}
