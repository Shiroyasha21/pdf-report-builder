export default function TextBlock({ section, colors, onChange }) {
  return (
    <div className="rounded overflow-hidden shadow-sm border border-gray-200">
      <div className="px-3 py-2" style={{ backgroundColor: colors.primaryMid, borderBottom: `2px solid ${colors.accent}` }}>
        <input
          value={section.title}
          onChange={e => onChange({ title: e.target.value })}
          onClick={e => e.stopPropagation()}
          className="w-full bg-transparent text-white font-bold text-xs outline-none uppercase placeholder-white/50"
          placeholder="Section title..."
        />
      </div>
      <div className="bg-white p-3">
        <textarea
          value={section.data?.content || ''}
          onChange={e => onChange({ data: { content: e.target.value } })}
          onClick={e => e.stopPropagation()}
          rows={4}
          placeholder="Type your text here..."
          className="w-full text-xs text-gray-700 outline-none resize-none bg-transparent leading-relaxed placeholder-gray-300"
        />
      </div>
    </div>
  )
}
