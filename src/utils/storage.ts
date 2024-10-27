import { useEffect, useState } from 'react'
import { getCurrent } from '@tauri-apps/api/window'

export function getItem(key: string) {
  const windowName = getCurrent().label
  const storage = windowName === 'main' ? localStorage : sessionStorage
  const config = JSON.parse(storage.getItem(`${windowName}-config`) ?? '{}')
  return config[key]
}

export function setItem(key: string, value: any) {
  const windowName = getCurrent().label
  const storage = windowName === 'main' ? localStorage : sessionStorage
  const config = JSON.parse(storage.getItem(`${windowName}-config`) ?? '{}')
  config[key] = value
  storage.setItem(`${windowName}-config`, JSON.stringify(config))
}

export function clear() {
  const windowName = getCurrent().label
  const storage = windowName === 'main' ? localStorage : sessionStorage
  storage.clear()
}

export const useStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  function getStoredValue() {
    const value = getItem(key)
    if (value) {
      return value
    }
    return initialValue
  }
  const [storedValue, setStoredValue] = useState<T>(getStoredValue)

  useEffect(() => {
    const item = getItem(key)
    if (item) {
      setStoredValue(item)
    }
  }, [key])

  const setValue = (value: T) => {
    // Save state
    setStoredValue(value)
    // Save to Storage
    setItem(key, value)
  }
  return [storedValue, setValue]
}
