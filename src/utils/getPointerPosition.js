export function getPointerPosition(event) {
  if (event.targetTouches) {
    if (event.targetTouches.length === 1) {
      return {
        x: event.targetTouches[0].clientX,
        y: event.targetTouches[0].clientY,
      }
    }
    return null
  }
  return { x: event.clientX, y: event.clientY }
}
