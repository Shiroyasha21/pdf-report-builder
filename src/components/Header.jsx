import { useState } from 'react'
import PinModal from './PinModal'

export default function Header({ remaining, isOwner, limit, onUnlock, onLock, isDark, onToggleDark }) {
  const [showPin, setShowPin] = useState(false)

  return (
    <>
      <header className="bg-white dark:bg-[#1A1B23] border-b border-gray-200 dark:border-[#2D2F3E] sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 dark:text-[#F1F2F6] text-sm">Report Builder</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Usage dots */}
            {!isOwner && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 dark:text-[#8B8FA8]">
                <div className="flex gap-0.5">
                  {Array.from({ length: limit }).map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-colors
                      ${i < (limit - remaining) ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-[#2D2F3E]'}`} />
                  ))}
                </div>
                <span>{remaining} of {limit} left today</span>
              </div>
            )}

            {isOwner && (
              <span className="hidden sm:inline text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full">
                Owner
              </span>
            )}

            {/* Dark mode toggle */}
            <button
              onClick={onToggleDark}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-[#8B8FA8] hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2D2F3E] transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* PIN button */}
            <button
              onClick={() => isOwner ? onLock() : setShowPin(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-[#8B8FA8] hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2D2F3E] transition-colors text-sm"
              title={isOwner ? 'Lock owner mode' : 'Owner access'}
            >
              {isOwner ? '🔓' : '🔒'}
            </button>
          </div>
        </div>

        {/* Mobile usage bar */}
        {!isOwner && (
          <div className="sm:hidden px-4 pb-2 flex items-center gap-2 text-xs text-gray-500 dark:text-[#8B8FA8]">
            <div className="flex gap-0.5">
              {Array.from({ length: limit }).map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < (limit - remaining) ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-[#2D2F3E]'}`} />
              ))}
            </div>
            <span>{remaining} of {limit} parses left today</span>
          </div>
        )}
      </header>

      {showPin && (
        <PinModal
          onClose={() => setShowPin(false)}
          onUnlock={(pin) => {
            const ok = onUnlock(pin)
            if (ok) setShowPin(false)
            return ok
          }}
        />
      )}
    </>
  )
}
