export default function DataInput({ value, onChange, instructions, onInstructionsChange, onParse, loading, canParse, remaining }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Data input */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-[#F1F2F6]">Raw Data</label>
        <span className="text-xs text-gray-400 dark:text-[#8B8FA8]">{value.length.toLocaleString()} chars</span>
      </div>

      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Paste any data here — spreadsheet rows, CRM exports, job reports, call logs, notes...

The AI will understand the structure and organize it into a clean PDF layout."
        rows={10}
        className="w-full border border-gray-200 dark:border-[#2D2F3E] rounded-lg px-3 py-2.5 text-sm
          text-gray-800 dark:text-[#F1F2F6] bg-white dark:bg-[#0F1117]
          placeholder-gray-400 dark:placeholder-[#8B8FA8]
          resize-none outline-none focus:border-indigo-500 dark:focus:border-indigo-500
          focus:ring-2 focus:ring-indigo-500/20 transition-colors font-mono leading-relaxed"
      />

      {/* Instructions input */}
      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-[#8B8FA8] mb-1.5 block">
          Instructions <span className="font-normal text-gray-400 dark:text-[#5A5F7A]">(optional)</span>
        </label>
        <textarea
          value={instructions}
          onChange={e => onInstructionsChange(e.target.value)}
          placeholder='e.g. "Group all calls into one table. Title it Daily Report — June 10. Skip empty sections. Use formal tone for notes."'
          rows={3}
          className="w-full border border-gray-200 dark:border-[#2D2F3E] rounded-lg px-3 py-2.5 text-sm
            text-gray-800 dark:text-[#F1F2F6] bg-white dark:bg-[#0F1117]
            placeholder-gray-400 dark:placeholder-[#5A5F7A]
            resize-none outline-none focus:border-indigo-500 dark:focus:border-indigo-500
            focus:ring-2 focus:ring-indigo-500/20 transition-colors leading-relaxed"
        />
      </div>

      {/* Limit warning */}
      {!canParse && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2.5 text-sm text-amber-500">
          <strong>Daily limit reached.</strong> You've used all 5 free parses for today.
          Come back tomorrow, or enter your owner PIN to continue.
        </div>
      )}

      <button
        onClick={onParse}
        disabled={!value.trim() || loading || !canParse}
        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
          ${!value.trim() || loading || !canParse
            ? 'bg-gray-100 dark:bg-[#2D2F3E] text-gray-400 dark:text-[#5A5F7A] cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98] shadow-lg shadow-indigo-500/20'
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
            Parse & Preview
            {canParse && remaining !== Infinity && (
              <span className="opacity-70 text-xs">({remaining} left)</span>
            )}
          </>
        )}
      </button>
    </div>
  )
}
