import Default from './Default'
import { ImageRight, ImageLeft } from './ImageRight'
import Center from './Center'
import Cover from './Cover'

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
