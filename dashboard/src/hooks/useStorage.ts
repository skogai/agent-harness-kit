import { useEffect, useState } from 'react'

export const useStorage = <T = unknown | undefined>(initialValue: T, storageKey: string) => {
  const [value, setValue] = useState<T | undefined>(initialValue)

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea === localStorage && event.key === storageKey) {
        try {
          const newValue = event.newValue ? (JSON.parse(event.newValue) as T) : undefined
          setValue(newValue)
        } catch {
          // ignore parse errors
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [storageKey])

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(storageKey)
      if (storedValue !== null) {
        // eslint-disable-next-line react-hooks/set-state-in-effect, @eslint-react/set-state-in-effect
        setValue(JSON.parse(storedValue) as T)
      }
    } catch {
      // ignore parse errors
    }
  }, [storageKey])

  const set = (value: T) => {
    setValue(value)
    if (value === undefined) {
      localStorage.removeItem(storageKey)
    } else {
      localStorage.setItem(storageKey, JSON.stringify(value))
    }
  }

  return [value, set] as const
}
