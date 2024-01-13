import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPointerPosition(event: any) {
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
