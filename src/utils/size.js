export function sizeToString(size) {
  const obj = sizeToObject(size)
  return obj ? `${obj.width}x${obj.height}` : null
}

export function sizeToObject(size) {
  if (!size) return null

  if (typeof size === 'string') {
    const match = size.match(/^([0-9]+)x([0-9]+)$/)
    if (match === null) return false
    const width = parseInt(match[1], 10)
    const height = parseInt(match[2], 10)
    return width >= 50 && height >= 50 ? { width, height } : null
  }

  return size.width >= 50 && size.height >= 50 ? size : null
}
