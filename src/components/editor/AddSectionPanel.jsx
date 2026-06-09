const SECTION_TYPES = [
  {
    type: 'snapshot',
    label: 'Snapshot',
    desc: 'Summary counters & metrics',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20',
  },
  {
    type: 'keyvalue',
    label: 'KV Card',
    desc: 'Job/record with status badge',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
  },
  {
    type: 'table',
    label: 'Table',
    desc: 'Multi-column data rows',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 3v18M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
      </svg>
    ),
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
  },
  {
    type: 'text',
    label: 'Text',
    desc: 'Notes or freeform content',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h12M4 18h8" />
      </svg>
    ),
    color: 'text-gray-500 bg-gray-50 dark:bg-gray-500/10 border-gray-200 dark:border-gray-500/20',
  },
]

export default function AddSectionPanel({ onAdd, onAIClick, insertAfterId }) {
  return (
    <div className="flex flex-col gap-3">
      {/* AI Fill — prominent */}
      <button
        onClick={onAIClick}
        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-500/30 active:scale-[0.98]"
      >
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="text-left flex-1 min-w-0">
          <div className="text-sm font-semibold">Fill with AI</div>
          <div className="text-xs text-indigo-200">Paste data, AI structures it</div>
        </div>
        <svg className="w-4 h-4 text-indigo-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-200 dark:bg-[#2D2F3E]" />
        <span className="text-[10px] text-gray-400 dark:text-[#5A5F7A] font-medium uppercase tracking-wide">or add manually</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-[#2D2F3E]" />
      </div>

      {/* Section type buttons */}
      <div className="flex flex-col gap-2">
        {SECTION_TYPES.map(({ type, label, desc, icon, color }) => (
          <button
            key={type}
            onClick={() => onAdd(type, insertAfterId)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all hover:shadow-sm active:scale-[0.98] ${color}`}
          >
            <div className="flex-shrink-0">{icon}</div>
            <div className="min-w-0">
              <div className="text-xs font-semibold">{label}</div>
              <div className="text-[10px] opacity-70 truncate">{desc}</div>
            </div>
          </button>
        ))}
      </div>

      {insertAfterId && (
        <p className="text-[10px] text-center text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg px-2 py-1.5">
          Inserting after selected section
        </p>
      )}
    </div>
  )
}
