import KVBlock from './sections/KVBlock'
import TableBlock from './sections/TableBlock'
import SnapshotBlock from './sections/SnapshotBlock'
import TextBlock from './sections/TextBlock'

function SectionBlock({ section, colors, isSelected, isFirst, isLast, onSelect, onUpdate, onMove, onDelete, onTogglePageBreak, onAddAfter }) {
  const blockProps = {
    section,
    colors,
    isSelected,
    onChange: (changes) => onUpdate(section.id, changes),
  }

  return (
    <div className="relative">
      {/* Page break indicator */}
      {section.pageBreakBefore && (
        <div className="flex items-center gap-2 mb-3 select-none">
          <div className="flex-1 border-t-2 border-dashed border-indigo-400/60" />
          <span className="text-[10px] font-medium text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full">
            Page Break
          </span>
          <div className="flex-1 border-t-2 border-dashed border-indigo-400/60" />
        </div>
      )}

      {/* Section wrapper */}
      <div
        onClick={() => onSelect(section.id)}
        className={`relative group/section rounded-lg transition-all cursor-pointer
          ${isSelected
            ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-[#0F1117]'
            : 'hover:ring-1 hover:ring-gray-300 dark:hover:ring-[#3D3F4E] hover:ring-offset-1 hover:ring-offset-white dark:hover:ring-offset-[#0F1117]'
          }`}
      >
        {/* Floating controls */}
        <div className={`absolute -right-10 top-0 flex flex-col gap-1 transition-opacity z-10
          ${isSelected ? 'opacity-100' : 'opacity-0 group-hover/section:opacity-100'}`}>
          <button
            title="Move up"
            onClick={e => { e.stopPropagation(); onMove(section.id, -1) }}
            disabled={isFirst}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-[#1A1B23] border border-gray-200 dark:border-[#2D2F3E] text-gray-500 dark:text-[#8B8FA8] hover:text-gray-800 dark:hover:text-white hover:border-gray-400 disabled:opacity-25 text-sm shadow-sm transition-all"
          >↑</button>
          <button
            title="Move down"
            onClick={e => { e.stopPropagation(); onMove(section.id, 1) }}
            disabled={isLast}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-[#1A1B23] border border-gray-200 dark:border-[#2D2F3E] text-gray-500 dark:text-[#8B8FA8] hover:text-gray-800 dark:hover:text-white hover:border-gray-400 disabled:opacity-25 text-sm shadow-sm transition-all"
          >↓</button>
          <button
            title={section.pageBreakBefore ? 'Remove page break' : 'Add page break before'}
            onClick={e => { e.stopPropagation(); onTogglePageBreak(section.id) }}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xs shadow-sm transition-all
              ${section.pageBreakBefore
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white dark:bg-[#1A1B23] border-gray-200 dark:border-[#2D2F3E] text-gray-500 dark:text-[#8B8FA8] hover:border-indigo-400 hover:text-indigo-500'
              }`}
          >⊞</button>
          <button
            title="Delete section"
            onClick={e => { e.stopPropagation(); onDelete(section.id) }}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-[#1A1B23] border border-gray-200 dark:border-[#2D2F3E] text-gray-400 hover:text-red-400 hover:border-red-300 text-sm shadow-sm transition-all"
          >×</button>
        </div>

        {/* Block content */}
        {section.type === 'keyvalue'  && <KVBlock {...blockProps} />}
        {section.type === 'table'     && <TableBlock {...blockProps} />}
        {section.type === 'snapshot'  && <SnapshotBlock {...blockProps} />}
        {section.type === 'text'      && <TextBlock {...blockProps} />}
      </div>

      {/* Add section between */}
      <div className="flex justify-center py-2 opacity-0 hover:opacity-100 transition-opacity group/add">
        <button
          onClick={e => { e.stopPropagation(); onAddAfter(section.id) }}
          className="flex items-center gap-1 text-xs text-gray-400 dark:text-[#5A5F7A] hover:text-indigo-500 bg-white dark:bg-[#1A1B23] border border-dashed border-gray-300 dark:border-[#2D2F3E] hover:border-indigo-400 rounded-full px-3 py-1 transition-all shadow-sm"
        >
          <span className="text-base leading-none">+</span> Insert section here
        </button>
      </div>
    </div>
  )
}

export default function EditorCanvas({ doc, selectedId, preset, onSelectSection, onUpdateSection, onMoveSection, onDeleteSection, onTogglePageBreak, onAddSection, onAddAfter }) {
  const colors = preset.colors

  function handleUpdateSection(id, changes) {
    // changes can contain top-level fields (title, status, statusColor, pageBreakBefore)
    // or nested data changes
    onUpdateSection(id, changes)
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-[#0A0B0F]" onClick={() => onSelectSection(null)}>
      <div className="max-w-[780px] mx-auto py-8 px-4 sm:px-8">

        {/* Page simulation */}
        <div className="bg-white shadow-xl rounded-sm min-h-[1000px]" style={{ padding: '39px' }}>

          {/* Document header — editable */}
          <div className="mb-4 rounded overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-4" style={{ backgroundColor: colors.primary }}>
              <input
                value={doc.title || ''}
                onChange={e => { e.stopPropagation(); onUpdateSection('__meta__', { title: e.target.value }) }}
                onClick={e => e.stopPropagation()}
                className="flex-1 bg-transparent text-white font-bold text-xl outline-none placeholder-white/40"
                placeholder="Document Title..."
              />
              <input
                value={doc.subtitle || ''}
                onChange={e => { e.stopPropagation(); onUpdateSection('__meta__', { subtitle: e.target.value }) }}
                onClick={e => e.stopPropagation()}
                className="text-right bg-transparent text-sm outline-none placeholder-yellow-200/40"
                style={{ color: colors.accent }}
                placeholder="Subtitle..."
              />
            </div>
            {/* Accent bar */}
            <div style={{ backgroundColor: colors.accent, height: 3 }} />
            {/* Meta row */}
            <div className="flex items-center gap-4 px-3 py-1.5" style={{ backgroundColor: colors.primaryPale }}>
              <input
                value={doc.date || ''}
                onChange={e => { e.stopPropagation(); onUpdateSection('__meta__', { date: e.target.value }) }}
                onClick={e => e.stopPropagation()}
                className="flex-1 bg-transparent text-xs outline-none text-gray-500"
                placeholder="Date..."
              />
              <input
                value={doc.meta || ''}
                onChange={e => { e.stopPropagation(); onUpdateSection('__meta__', { meta: e.target.value }) }}
                onClick={e => e.stopPropagation()}
                className="text-right bg-transparent text-xs outline-none text-gray-500"
                placeholder="Submitted by..."
              />
            </div>
          </div>

          {/* Empty state */}
          {doc.sections.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-400">Your document is empty</p>
              <p className="text-xs text-gray-300 mt-1">Use <strong>Fill with AI</strong> or add sections manually from the left panel</p>
            </div>
          )}

          {/* Sections */}
          <div className="flex flex-col gap-2">
            {doc.sections.map((section, i) => (
              <SectionBlock
                key={section.id}
                section={section}
                colors={colors}
                isSelected={selectedId === section.id}
                isFirst={i === 0}
                isLast={i === doc.sections.length - 1}
                onSelect={onSelectSection}
                onUpdate={handleUpdateSection}
                onMove={onMoveSection}
                onDelete={onDeleteSection}
                onTogglePageBreak={onTogglePageBreak}
                onAddAfter={onAddAfter}
              />
            ))}
          </div>

          {/* Footer preview */}
          {doc.sections.length > 0 && (
            <div className="mt-6">
              <div style={{ backgroundColor: colors.accent, height: 3 }} />
              <div className="flex justify-between pt-1.5">
                <span className="text-[9px] text-gray-400">{doc.title || 'Report'}</span>
                <span className="text-[9px] text-gray-400">PDF Report Builder</span>
                <span className="text-[9px] text-gray-400">{doc.date || ''}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
