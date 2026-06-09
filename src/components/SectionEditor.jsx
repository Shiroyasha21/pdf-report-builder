export default function SectionEditor({ sections, onSectionsChange }) {
  function move(index, dir) {
    const updated = [...sections]
    const target = index + dir
    if (target < 0 || target >= updated.length) return
    ;[updated[index], updated[target]] = [updated[target], updated[index]]
    onSectionsChange(updated)
  }

  function remove(index) {
    onSectionsChange(sections.filter((_, i) => i !== index))
  }

  function rename(index, title) {
    const updated = [...sections]
    updated[index] = { ...updated[index], title }
    onSectionsChange(updated)
  }

  function addSection() {
    onSectionsChange([...sections, {
      id: `section-${Date.now()}`,
      type: 'text',
      title: 'New Section',
      data: { content: '' }
    }])
  }

  const typeBadge = {
    snapshot: 'bg-purple-500/15 text-purple-400',
    keyvalue: 'bg-blue-500/15 text-blue-400',
    table:    'bg-emerald-500/15 text-emerald-400',
    text:     'bg-gray-500/15 text-gray-400',
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-[#F1F2F6]">Sections</span>
        <span className="text-xs text-gray-400 dark:text-[#8B8FA8]">{sections.length} section{sections.length !== 1 ? 's' : ''}</span>
      </div>

      {sections.length === 0 && (
        <div className="text-center py-6 text-sm text-gray-400 dark:text-[#5A5F7A] border border-dashed border-gray-200 dark:border-[#2D2F3E] rounded-lg">
          No sections yet. Parse your data first.
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {sections.map((section, i) => (
          <div key={section.id} className="flex items-center gap-2 bg-gray-50 dark:bg-[#0F1117] border border-gray-200 dark:border-[#2D2F3E] rounded-lg px-2.5 py-2">
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${typeBadge[section.type] || typeBadge.text}`}>
              {section.type}
            </span>
            <input
              value={section.title}
              onChange={e => rename(i, e.target.value)}
              className="flex-1 text-xs text-gray-700 dark:text-[#F1F2F6] outline-none bg-transparent min-w-0"
            />
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button onClick={() => move(i, -1)} disabled={i === 0}
                className="w-5 h-5 flex items-center justify-center text-gray-400 dark:text-[#8B8FA8] hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-25 text-xs">↑</button>
              <button onClick={() => move(i, 1)} disabled={i === sections.length - 1}
                className="w-5 h-5 flex items-center justify-center text-gray-400 dark:text-[#8B8FA8] hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-25 text-xs">↓</button>
              <button onClick={() => remove(i)}
                className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-400 text-xs">×</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addSection}
        className="py-1.5 text-xs text-gray-500 dark:text-[#8B8FA8] border border-dashed border-gray-300 dark:border-[#2D2F3E] rounded-lg hover:border-indigo-500 hover:text-indigo-400 transition-colors">
        + Add Section
      </button>
    </div>
  )
}
