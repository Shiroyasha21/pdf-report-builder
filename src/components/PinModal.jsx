import { useState } from 'react'

export default function PinModal({ onClose, onUnlock }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const ok = onUnlock(pin)
    if (!ok) {
      setError(true)
      setPin('')
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1A1B23] border border-gray-200 dark:border-[#2D2F3E] rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-[#F1F2F6] mb-1">Owner Access</h2>
        <p className="text-sm text-gray-500 dark:text-[#8B8FA8] mb-4">Enter your PIN to unlock unlimited parses.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            placeholder="Enter PIN"
            autoFocus
            className={`w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors
              bg-white dark:bg-[#0F1117] text-gray-900 dark:text-[#F1F2F6]
              ${error
                ? 'border border-red-400 bg-red-50 dark:bg-red-500/10'
                : 'border border-gray-300 dark:border-[#2D2F3E] focus:border-indigo-500 dark:focus:border-indigo-500'
              }`}
          />
          {error && <p className="text-xs text-red-500">Incorrect PIN. Try again.</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm text-gray-600 dark:text-[#8B8FA8] border border-gray-300 dark:border-[#2D2F3E] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2D2F3E] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
