import { BUILT_IN_PRESETS, getCustomPresets, saveCustomPreset, deleteCustomPreset, exportPreset, importPreset } from '../../utils/presets'
import { useState, useRef } from 'react'

const STATUS_COLORS = ['green', 'red', 'amber', 'blue', 'gray']
const STATUS_DOT = { green: 'bg-green-500', red: 'bg-red-500', amber: 'bg-amber-500', blue: 'bg-blue-500', gray: 'bg-gray-400' }

const COLOR_FIELDS = [
  { key: 'primary',     label: 'Primary' },
  { key: 'primaryMid',  label: 'Header bg' },
  { key: 'primaryPale', label: 'Row alt' },
  { key: 'accent',      label: 'Accent bar' },
  { key: 'textPrimary', label: 'Text' },
  { key: 'textMuted',   label: 'Muted text' },
  { key: 'success',     label: 'Success' },
  { key: 'danger',      label: 'Danger' },
  { key: 'warning',     label: 'Warning' },
]

function Label({ children }) {
  return <span className="text-[10px] font-medium text-gray-500 dark:text-[#8B8FA8] uppercase tracking-wide">{children}</span>
}

function SectionProps({ section, onUpdate }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label>Section Type</Label>
        <select
          value={section.type}
          onChange={e => onUpdate(section.id, { type: e.target.value })}
          className="mt-1 w-full text-xs border border-gray-200 dark:border-[#2D2F3E] rounded-lg px-2 py-1.5 bg-white dark:bg-[#0F1117] text-gray-700 dark:text-[#F1F2F6] outline-none focus:border-indigo-500"
        >
          <option value="keyvalue">KV Card</option>
          <option value="table">Table</option>
          <option value="snapshot">Snapshot</option>
          <option value="text">Text</option>
        </select>
      </div>

      {/* Page break */}
      <div className="flex items-center justify-between">
        <div>
          <Label>Page Break Before</Label>
          <p className="text-[10px] text-gray-400 dark:text-[#5A5F7A] mt-0.5">Start this section on a new page</p>
        </div>
        <button
          onClick={() => onUpdate(section.id, { pageBreakBefore: !section.pageBreakBefore })}
          className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 ${section.pageBreakBefore ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-[#2D2F3E]'}`}
        >
          <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${section.pageBreakBefore ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* KV-specific */}
      {section.type === 'keyvalue' && (
        <div>
          <Label>Status Badge</Label>
          <div className="mt-1 flex flex-col gap-2">
            <input
              value={section.status || ''}
              onChange={e => onUpdate(section.id, { status: e.target.value })}
              placeholder="e.g. Completed, In Progress"
              className="w-full text-xs border border-gray-200 dark:border-[#2D2F3E] rounded-lg px-2 py-1.5 bg-white dark:bg-[#0F1117] text-gray-700 dark:text-[#F1F2F6] outline-none focus:border-indigo-500"
            />
            <div className="flex gap-1.5">
              {STATUS_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => onUpdate(section.id, { statusColor: c })}
                  title={c}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${STATUS_DOT[c]} ${section.statusColor === c ? 'border-gray-800 dark:border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PresetPanel({ preset, onPresetChange }) {
  const [customPresets, setCustomPresets] = useState(getCustomPresets)
  const [saveName, setSaveName] = useState('')
  const [showSave, setShowSave] = useState(false)
  const [showColors, setShowColors] = useState(false)
  const importRef = useRef()
  const allPresets = [...BUILT_IN_PRESETS, ...customPresets]

  function handleColorChange(key, val) {
    onPresetChange({ ...preset, id: 'custom-active', locked: false, colors: { ...preset.colors, [key]: val } })
  }

  function handleSave() {
    if (!saveName.trim()) return
    const p = { ...preset, id: `custom-${Date.now()}`, name: saveName.trim(), locked: false }
    saveCustomPreset(p); setCustomPresets(getCustomPresets()); setSaveName(''); setShowSave(false); onPresetChange(p)
  }

  async function handleImport(e) {
    const file = e.target.files[0]; if (!file) return
    try {
      const p = await importPreset(file); saveCustomPreset(p); setCustomPresets(getCustomPresets()); onPresetChange(p)
    } catch (err) { alert(err.message) }
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Preset list */}
      <div className="flex flex-col gap-1.5">
        {allPresets.map(p => (
          <div key={p.id} onClick={() => onPresetChange(p)}
            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all
              ${preset.id === p.id ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-gray-200 dark:border-[#2D2F3E] hover:border-gray-300 dark:hover:border-[#3D3F4E]'}`}>
            <div className="flex gap-0.5 flex-shrink-0">
              {[p.colors.primary, p.colors.accent, p.colors.success].map((c, i) => (
                <div key={i} className="w-3.5 h-3.5 rounded-sm border border-black/10" style={{ background: c }} />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-[#F1F2F6] flex-1 min-w-0 truncate">{p.name}</span>
            {!p.locked && (
              <div className="flex gap-0.5">
                <button onClick={e => { e.stopPropagation(); exportPreset(p) }} className="text-[10px] text-gray-400 hover:text-indigo-400 px-1" title="Export">↓</button>
                <button onClick={e => { e.stopPropagation(); deleteCustomPreset(p.id); setCustomPresets(getCustomPresets()) }}
                  className="text-[10px] text-gray-400 hover:text-red-400 px-1" title="Delete">×</button>
              </div>
            )}
          </div>
        ))}
        <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        <button onClick={() => importRef.current.click()}
          className="py-1.5 text-xs text-gray-500 dark:text-[#8B8FA8] border border-dashed border-gray-300 dark:border-[#2D2F3E] rounded-lg hover:border-indigo-500 hover:text-indigo-400 transition-colors">
          + Import Preset
        </button>
      </div>

      {/* Expand colors */}
      <button onClick={() => setShowColors(v => !v)}
        className="flex items-center justify-between text-xs text-gray-500 dark:text-[#8B8FA8] hover:text-gray-700 dark:hover:text-gray-300 transition-colors py-1">
        <span className="font-medium">Customize Colors</span>
        <span className="text-gray-400">{showColors ? '▲' : '▼'}</span>
      </button>

      {showColors && (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {COLOR_FIELDS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <input type="color" value={preset.colors[key] || '#000000'}
                  onChange={e => handleColorChange(key, e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent flex-shrink-0" />
                <span className="text-[11px] text-gray-600 dark:text-[#8B8FA8] truncate">{label}</span>
              </div>
            ))}
          </div>

          {!showSave ? (
            <button onClick={() => setShowSave(true)}
              className="py-1.5 text-xs text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/10 transition-colors">
              Save as Preset
            </button>
          ) : (
            <div className="flex gap-2">
              <input value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="Preset name" autoFocus
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                className="flex-1 border border-gray-300 dark:border-[#2D2F3E] bg-white dark:bg-[#0F1117] text-gray-900 dark:text-[#F1F2F6] rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-500" />
              <button onClick={handleSave} className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-500">Save</button>
              <button onClick={() => setShowSave(false)} className="px-2 py-1 text-xs text-gray-500 border border-gray-200 dark:border-[#2D2F3E] rounded-lg">✕</button>
            </div>
          )}

          <button onClick={() => exportPreset(preset)}
            className="py-1.5 text-xs text-gray-500 dark:text-[#8B8FA8] border border-gray-200 dark:border-[#2D2F3E] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2D2F3E] transition-colors">
            Export Current Preset
          </button>
        </div>
      )}
    </div>
  )
}

export default function PropertiesPanel({ selectedSection, onUpdateSection, preset, onPresetChange, doc, onDocMeta }) {
  const [tab, setTab] = useState('properties')

  const tabs = ['properties', 'style']

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 dark:border-[#2D2F3E] flex-shrink-0">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-medium capitalize transition-colors border-b-2 -mb-px
              ${tab === t ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-500 dark:text-[#8B8FA8] hover:text-gray-700 dark:hover:text-gray-300'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'properties' && (
          <div className="flex flex-col gap-5">
            {/* Doc meta */}
            <div className="flex flex-col gap-2">
              <Label>Document</Label>
              <input value={doc.title || ''} onChange={e => onDocMeta({ title: e.target.value })} placeholder="Title"
                className="w-full text-xs border border-gray-200 dark:border-[#2D2F3E] rounded-lg px-2 py-1.5 bg-white dark:bg-[#0F1117] text-gray-700 dark:text-[#F1F2F6] outline-none focus:border-indigo-500" />
              <input value={doc.subtitle || ''} onChange={e => onDocMeta({ subtitle: e.target.value })} placeholder="Subtitle"
                className="w-full text-xs border border-gray-200 dark:border-[#2D2F3E] rounded-lg px-2 py-1.5 bg-white dark:bg-[#0F1117] text-gray-700 dark:text-[#F1F2F6] outline-none focus:border-indigo-500" />
              <input value={doc.date || ''} onChange={e => onDocMeta({ date: e.target.value })} placeholder="Date"
                className="w-full text-xs border border-gray-200 dark:border-[#2D2F3E] rounded-lg px-2 py-1.5 bg-white dark:bg-[#0F1117] text-gray-700 dark:text-[#F1F2F6] outline-none focus:border-indigo-500" />
              <input value={doc.meta || ''} onChange={e => onDocMeta({ meta: e.target.value })} placeholder="Submitted by..."
                className="w-full text-xs border border-gray-200 dark:border-[#2D2F3E] rounded-lg px-2 py-1.5 bg-white dark:bg-[#0F1117] text-gray-700 dark:text-[#F1F2F6] outline-none focus:border-indigo-500" />
            </div>

            {/* Selected section */}
            {selectedSection ? (
              <div className="flex flex-col gap-2">
                <Label>Selected Section</Label>
                <SectionProps section={selectedSection} onUpdate={onUpdateSection} />
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-gray-400 dark:text-[#5A5F7A] border border-dashed border-gray-200 dark:border-[#2D2F3E] rounded-lg">
                Click a section to see its properties
              </div>
            )}
          </div>
        )}

        {tab === 'style' && (
          <div className="flex flex-col gap-3">
            <Label>Preset & Colors</Label>
            <PresetPanel preset={preset} onPresetChange={onPresetChange} />
          </div>
        )}
      </div>
    </div>
  )
}
