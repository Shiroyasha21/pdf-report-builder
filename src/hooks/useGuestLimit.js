import { useState, useEffect } from 'react'

const LIMIT = 5
const KEY = 'pdf_builder_usage'
const OWNER_KEY = 'pdf_builder_owner'

function getTodayStr() {
  return new Date().toISOString().split('T')[0]
}

export function useGuestLimit() {
  const [isOwner, setIsOwner] = useState(() => {
    return localStorage.getItem(OWNER_KEY) === 'true'
  })

  const [usage, setUsage] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY))
      if (saved?.date === getTodayStr()) return saved.count
    } catch {}
    return 0
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ date: getTodayStr(), count: usage }))
  }, [usage])

  const canParse = isOwner || usage < LIMIT
  const remaining = isOwner ? Infinity : Math.max(0, LIMIT - usage)

  function increment() {
    if (!isOwner) setUsage(u => u + 1)
  }

  function unlockOwner(pin) {
    const correctPin = import.meta.env.VITE_OWNER_PIN || '1234'
    if (pin === correctPin) {
      setIsOwner(true)
      localStorage.setItem(OWNER_KEY, 'true')
      return true
    }
    return false
  }

  function lockOwner() {
    setIsOwner(false)
    localStorage.removeItem(OWNER_KEY)
  }

  return { canParse, remaining, increment, isOwner, unlockOwner, lockOwner, limit: LIMIT }
}
