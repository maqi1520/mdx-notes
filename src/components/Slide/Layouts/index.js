import Default from './Default'
import ImageRight from './ImageRight'
import Center from './Center'
import Cover from './Cover'

function ImageLeft(props) {
  return <ImageRight className="flex-row-reverse" {...props} />
}

function End(props) {
  return <Default className="grid content-end" {...props} />
}

export const layout = {
  default: Default,
  'image-right': ImageRight,
  'image-left': ImageLeft,
  center: Center,
  cover: Cover,
  end: End,
}
