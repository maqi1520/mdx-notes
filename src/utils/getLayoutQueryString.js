import { sizeToString } from './size'

export function getLayoutQueryString({ layout, responsiveSize, file, id }) {
  const params = {
    id,
    layout: ['horizontal', 'preview'].includes(layout) ? layout : undefined,
    size: sizeToString(responsiveSize),
    file: ['css', 'config'].includes(file) ? file : undefined,
  }
  return Object.keys(params)
    .filter((key) => params[key])
    .reduce((acc, key, i) => {
      return `${acc}&${key}=${params[key]}`
    }, '')
}
