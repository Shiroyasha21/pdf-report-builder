import { useState } from 'react'
import { useGroq } from '../hooks/useGroq'

export default function AIModal({ onClose, onResult, canParse, remaining }) {
  const [rawText, setRawText] = useState('')
  const [instructions, setInstructions] = useState('')
  const { parseData, loading, error } = useGroq()

  async function handleParse() {
    if (!rawText.trim() || !canParse) return
    const result = await parseData(rawText, instructions)
    if (result) {
      onResult(result)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1A1B23] border border-gray-200 dark:border-[#2D2F3E] rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-2xl mx-0 sm:mx-4 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 dark:border-[#2D2F3E] flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-[#F1F2F6]">Fill with AI</h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-[#8B8FA8] mt-0.5">
              Paste any raw data — AI will structure it into your document
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2D2F3E] transition-colors text-lg">×</button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 p-5 overflow-y-auto flex-1">
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-[#F1F2F6] mb-1.5 block">Raw Data</label>
            <textarea
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              rows={10}
              placeholder="Paste anything — CRM exports, spreadsheet rows, job reports, call logs, notes, Google Sheets data..."
              className="w-full border border-gray-200 dark:border-[#2D2F3E] rounded-lg px-3 py-2.5 text-sm
                text-gray-800 dark:text-[#F1F2F6] bg-white dark:bg-[#0F1117]
                placeholder-gray-400 dark:placeholder-[#5A5F7A]
                resize-none outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                transition-colors font-mono leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-[#8B8FA8] mb-1.5 block">
              Instructions <span className="font-normal text-gray-400 dark:text-[#5A5F7A]">(optional)</span>
            </label>
            <textarea
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              rows={2}
              placeholder='e.g. "Title it Daily Report — June 10. Group all calls into one table. Skip empty sections."'
              className="w-full border border-gray-200 dark:border-[#2D2F3E] rounded-lg px-3 py-2.5 text-sm
                text-gray-800 dark:text-[#F1F2F6] bg-white dark:bg-[#0F1117]
                placeholder-gray-400 dark:placeholder-[#5A5F7A]
                resize-none outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">{error}</div>
          )}

          {!canParse && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-500">
              <strong>Daily limit reached.</strong> Come back tomorrow or enter your owner PIN.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-gray-100 dark:border-[#2D2F3E] flex-shrink-0">
          <button onClick={onClose}
            className="flex-1 py-2.5 text-sm text-gray-600 dark:text-[#8B8FA8] border border-gray-300 dark:border-[#2D2F3E] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2D2F3E] transition-colors">
            Cancel
          </button>
          <button
            onClick={handleParse}
            disabled={!rawText.trim() || loading || !canParse}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2
              ${!rawText.trim() || loading || !canParse
                ? 'bg-gray-100 dark:bg-[#2D2F3E] text-gray-400 dark:text-[#5A5F7A] cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
              }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Parsing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Parse & Fill {canParse && remaining !== Infinity && `(${remaining} left)`}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
