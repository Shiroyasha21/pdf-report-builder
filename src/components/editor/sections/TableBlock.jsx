export default function TableBlock({ section, colors, onChange, isSelected }) {
  const headers = section.data?.headers || []
  const rows = section.data?.rows || []

  function updateHeader(ci, val) {
    const h = headers.map((hh, i) => i === ci ? val : hh)
    onChange({ data: { headers: h, rows } })
  }

  function updateCell(ri, ci, val) {
    const r = rows.map((row, i) => i === ri ? row.map((c, j) => j === ci ? val : c) : row)
    onChange({ data: { headers, rows: r } })
  }

  function addRow() {
    onChange({ data: { headers, rows: [...rows, headers.map(() => '')] } })
  }

  function deleteRow(ri) {
    onChange({ data: { headers, rows: rows.filter((_, i) => i !== ri) } })
  }

  function addColumn() {
    onChange({ data: {
      headers: [...headers, `Column ${headers.length + 1}`],
      rows: rows.map(r => [...r, ''])
    }})
  }

  function deleteColumn(ci) {
    if (headers.length <= 1) return
    onChange({ data: {
      headers: headers.filter((_, i) => i !== ci),
      rows: rows.map(r => r.filter((_, i) => i !== ci))
    }})
  }

  const colW = headers.length > 0 ? `${100 / headers.length}%` : '100%'

  return (
    <div className="rounded overflow-hidden shadow-sm border border-gray-200">
      {/* Section title bar */}
      <div className="px-3 py-2" style={{ backgroundColor: colors.primaryMid, borderBottom: `2px solid ${colors.accent}` }}>
        <input
          value={section.title}
          onChange={e => onChange({ title: e.target.value })}
          onClick={e => e.stopPropagation()}
          className="w-full bg-transparent text-white font-bold text-xs outline-none uppercase placeholder-white/50"
          placeholder="Table title..."
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          {/* Headers */}
          <thead>
            <tr style={{ backgroundColor: colors.primary }}>
              {headers.map((h, ci) => (
                <th key={ci} className="relative group/col border-r border-white/10 last:border-r-0 p-0">
                  <div className="flex items-center">
                    <input
                      value={h}
                      onChange={e => updateHeader(ci, e.target.value)}
                      onClick={e => e.stopPropagation()}
                      style={{ width: colW }}
                      className="bg-transparent text-white font-bold text-center text-xs outline-none py-2 px-2 w-full"
                      placeholder="Header"
                    />
                    {isSelected && (
                      <button
                        onClick={e => { e.stopPropagation(); deleteColumn(ci) }}
                        className="absolute right-0.5 top-0.5 w-4 h-4 flex items-center justify-center text-white/40 hover:text-white text-xs opacity-0 group-hover/col:opacity-100 transition-opacity"
                      >×</button>
                    )}
                  </div>
                </th>
              ))}
              {isSelected && (
                <th className="p-0 w-8">
                  <button
                    onClick={e => { e.stopPropagation(); addColumn() }}
                    className="w-full h-full py-2 px-1 text-white/50 hover:text-white hover:bg-white/10 text-xs transition-colors"
                  >+</button>
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={`group/row ${ri % 2 === 0 ? 'bg-slate-50' : 'bg-white'} hover:bg-indigo-50/30 transition-colors`}>
                {headers.map((_, ci) => (
                  <td key={ci} className="border border-gray-200 p-0">
                    <input
                      value={row[ci] ?? ''}
                      onChange={e => updateCell(ri, ci, e.target.value)}
                      onClick={e => e.stopPropagation()}
                      className="w-full bg-transparent text-xs text-gray-700 outline-none py-1.5 px-2"
                      placeholder="—"
                    />
                  </td>
                ))}
                {isSelected && (
                  <td className="border border-gray-200 w-8 text-center">
                    <button
                      onClick={e => { e.stopPropagation(); deleteRow(ri) }}
                      className="w-full h-full py-1.5 text-gray-300 hover:text-red-400 text-xs opacity-0 group-hover/row:opacity-100 transition-opacity"
                    >×</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
