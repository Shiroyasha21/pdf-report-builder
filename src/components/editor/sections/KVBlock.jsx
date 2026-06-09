const HIGHLIGHT_STYLES = {
  none:  { row: '', val: 'text-gray-700', badge: '' },
  green: { row: 'border-l-2 border-l-green-500 bg-green-50', val: 'text-green-800 font-semibold', badge: '' },
  red:   { row: 'border-l-2 border-l-red-500 bg-red-50',   val: 'text-red-800 font-semibold', badge: '' },
  amber: { row: 'border-l-2 border-l-amber-500 bg-amber-50', val: 'text-amber-800 font-semibold', badge: '' },
  blue:  { row: 'border-l-2 border-l-blue-500 bg-blue-50',  val: 'text-blue-800 font-semibold', badge: '' },
}

const STATUS_BADGE = {
  green: 'bg-green-100 text-green-800',
  red:   'bg-red-100 text-red-800',
  amber: 'bg-amber-100 text-amber-800',
  blue:  'bg-blue-100 text-blue-800',
  gray:  'bg-gray-100 text-gray-700',
}

export default function KVBlock({ section, colors, onChange, isSelected }) {
  const rows = section.data?.rows || []
  const badgeClass = STATUS_BADGE[section.statusColor] || STATUS_BADGE.gray

  function updateRow(i, field, val) {
    const updated = rows.map((r, ri) => ri === i ? { ...r, [field]: val } : r)
    onChange({ data: { rows: updated } })
  }

  function addRow() {
    onChange({ data: { rows: [...rows, { label: 'Label', value: 'Value', highlight: 'none' }] } })
  }

  function deleteRow(i) {
    onChange({ data: { rows: rows.filter((_, ri) => ri !== i) } })
  }

  function cycleHighlight(i) {
    const order = ['none', 'green', 'red', 'amber', 'blue']
    const cur = rows[i].highlight || 'none'
    const next = order[(order.indexOf(cur) + 1) % order.length]
    updateRow(i, 'highlight', next)
  }

  return (
    <div className="rounded overflow-hidden shadow-sm border border-gray-200">
      {/* Card header */}
      <div className="flex items-stretch">
        <div className="flex-1 px-3 py-2" style={{ backgroundColor: colors.primary }}>
          <input
            value={section.title}
            onChange={e => onChange({ title: e.target.value })}
            onClick={e => e.stopPropagation()}
            className="w-full bg-transparent text-white font-bold text-sm outline-none placeholder-white/50"
            placeholder="Record title..."
          />
        </div>
        <div className={`px-3 py-2 flex items-center min-w-[90px] justify-center ${badgeClass}`}>
          <input
            value={section.status || ''}
            onChange={e => onChange({ status: e.target.value })}
            onClick={e => e.stopPropagation()}
            className="w-full bg-transparent text-center text-xs font-bold outline-none"
            placeholder="Status"
          />
        </div>
      </div>

      {/* KV rows */}
      {rows.map((row, i) => {
        const hl = HIGHLIGHT_STYLES[row.highlight] || HIGHLIGHT_STYLES.none
        return (
          <div key={i} className={`flex items-stretch group/row ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'} ${hl.row}`}>
            <div className="w-[28%] px-3 py-1.5 flex items-center">
              <input
                value={row.label}
                onChange={e => updateRow(i, 'label', e.target.value)}
                onClick={e => e.stopPropagation()}
                className="w-full bg-transparent text-xs font-bold outline-none"
                style={{ color: colors.primaryMid }}
                placeholder="Label"
              />
            </div>
            <div className="flex-1 px-2 py-1.5 flex items-center gap-1">
              <input
                value={row.value}
                onChange={e => updateRow(i, 'value', e.target.value)}
                onClick={e => e.stopPropagation()}
                className={`flex-1 bg-transparent text-xs outline-none ${hl.val}`}
                placeholder="Value"
              />
              {isSelected && (
                <div className="flex items-center gap-0.5 opacity-0 group-hover/row:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); cycleHighlight(i) }}
                    title="Cycle highlight color"
                    className={`w-4 h-4 rounded text-[9px] font-bold border transition-colors flex items-center justify-center
                      ${row.highlight && row.highlight !== 'none'
                        ? 'border-indigo-400 text-indigo-500 bg-indigo-50'
                        : 'border-gray-300 text-gray-400'}`}
                  >●</button>
                  <button
                    onClick={e => { e.stopPropagation(); deleteRow(i) }}
                    className="w-4 h-4 flex items-center justify-center text-gray-300 hover:text-red-400 text-xs"
                  >×</button>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Add row */}
      {isSelected && (
        <button
          onClick={e => { e.stopPropagation(); addRow() }}
          className="w-full py-1.5 text-xs text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors border-t border-gray-100 flex items-center justify-center gap-1"
        >
          <span>+</span> Add Row
        </button>
      )}
    </div>
  )
}
