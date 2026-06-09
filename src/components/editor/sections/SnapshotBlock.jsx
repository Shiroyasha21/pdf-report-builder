export default function SnapshotBlock({ section, colors, onChange, isSelected }) {
  const items = section.data?.items || []

  function updateItem(i, field, val) {
    onChange({ data: { items: items.map((it, idx) => idx === i ? { ...it, [field]: val } : it) } })
  }

  function addItem() {
    if (items.length >= 6) return
    onChange({ data: { items: [...items, { label: 'Label', value: '0', sub: null }] } })
  }

  function removeItem(i) {
    if (items.length <= 1) return
    onChange({ data: { items: items.filter((_, idx) => idx !== i) } })
  }

  return (
    <div className="rounded overflow-hidden shadow-sm border border-gray-200">
      {/* Section header */}
      <div className="px-3 py-2" style={{ backgroundColor: colors.primaryMid, borderBottom: `2px solid ${colors.accent}` }}>
        <input
          value={section.title}
          onChange={e => onChange({ title: e.target.value })}
          onClick={e => e.stopPropagation()}
          className="w-full bg-transparent text-white font-bold text-xs outline-none uppercase placeholder-white/50"
          placeholder="Snapshot title..."
        />
      </div>

      {/* Metric grid */}
      <div className="flex divide-x divide-gray-200 bg-white">
        {items.map((item, i) => (
          <div key={i} className="flex-1 relative group/item flex flex-col items-center py-3 px-2 min-w-0">
            {/* Label */}
            <input
              value={item.label}
              onChange={e => updateItem(i, 'label', e.target.value)}
              onClick={e => e.stopPropagation()}
              style={{ backgroundColor: colors.primary, color: '#fff' }}
              className="w-full text-center text-[10px] font-bold rounded px-1 py-0.5 outline-none mb-2 placeholder-white/50"
              placeholder="Label"
            />
            {/* Value */}
            <input
              value={item.value}
              onChange={e => updateItem(i, 'value', e.target.value)}
              onClick={e => e.stopPropagation()}
              className="w-full text-center text-2xl font-bold outline-none bg-transparent"
              style={{ color: colors.primary }}
              placeholder="0"
            />
            {/* Sub */}
            <input
              value={item.sub || ''}
              onChange={e => updateItem(i, 'sub', e.target.value || null)}
              onClick={e => e.stopPropagation()}
              className="w-full text-center text-[10px] text-gray-400 outline-none bg-transparent mt-0.5"
              placeholder="subtitle"
            />
            {/* Delete */}
            {isSelected && items.length > 1 && (
              <button
                onClick={e => { e.stopPropagation(); removeItem(i) }}
                className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-gray-300 hover:text-red-400 text-xs opacity-0 group-hover/item:opacity-100 transition-opacity"
              >×</button>
            )}
          </div>
        ))}
      </div>

      {/* Add item */}
      {isSelected && items.length < 6 && (
        <button
          onClick={e => { e.stopPropagation(); addItem() }}
          className="w-full py-1.5 text-xs text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors border-t border-gray-100 flex items-center justify-center gap-1"
        >
          <span>+</span> Add Item
        </button>
      )}
    </div>
  )
}
