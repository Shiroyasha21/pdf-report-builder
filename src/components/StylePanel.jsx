import { useState, useRef } from 'react'
import { BUILT_IN_PRESETS, getCustomPresets, saveCustomPreset, deleteCustomPreset, exportPreset, importPreset } from '../utils/presets'

const COLOR_FIELDS = [
  { key: 'primary', label: 'Primary' },
  { key: 'primaryMid', label: 'Primary Mid' },
  { key: 'primaryPale', label: 'Primary Pale' },
  { key: 'accent', label: 'Accent' },
  { key: 'textPrimary', label: 'Text' },
  { key: 'textMuted', label: 'Text Muted' },
  { key: 'success', label: 'Success' },
  { key: 'successLight', label: 'Success Light' },
  { key: 'danger', label: 'Danger' },
  { key: 'dangerLight', label: 'Danger Light' },
]

const tab = (active, label, onClick) => (
  <button
    key={label}
    onClick={onClick}
    className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors border-b-2 -mb-px
      ${active
        ? 'border-indigo-500 text-indigo-400'
        : 'border-transparent text-gray-500 dark:text-[#8B8FA8] hover:text-gray-700 dark:hover:text-gray-300'
      }`}
  >{label}</button>
)

export default function StylePanel({ preset, onPresetChange }) {
  const [customPresets, setCustomPresets] = useState(getCustomPresets)
  const [saveName, setSaveName] = useState('')
  const [showSave, setShowSave] = useState(false)
  const [activeTab, setActiveTab] = useState('presets')
  const importRef = useRef()

  const allPresets = [...BUILT_IN_PRESETS, ...customPresets]

  function handleColorChange(key, value) {
    onPresetChange({ ...preset, id: 'custom-active', locked: false, colors: { ...preset.colors, [key]: value } })
  }

  function handleSave() {
    if (!saveName.trim()) return
    const newPreset = { ...preset, id: `custom-${Date.now()}`, name: saveName.trim(), locked: false }
    saveCustomPreset(newPreset)
    setCustomPresets(getCustomPresets())
    setSaveName('')
    setShowSave(false)
    onPresetChange(newPreset)
  }

  function handleDelete(id) {
    deleteCustomPreset(id)
    setCustomPresets(getCustomPresets())
  }

  async function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      const p = await importPreset(file)
      saveCustomPreset(p)
      setCustomPresets(getCustomPresets())
      onPresetChange(p)
    } catch (err) { alert(err.message) }
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex border-b border-gray-200 dark:border-[#2D2F3E]">
        {tab(activeTab === 'presets', 'presets', () => setActiveTab('presets'))}
        {tab(activeTab === 'customize', 'customize', () => setActiveTab('customize'))}
      </div>

      {activeTab === 'presets' && (
        <div className="flex flex-col gap-2">
          {allPresets.map(p => (
            <div
              key={p.id}
              onClick={() => onPresetChange(p)}
              className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all
                ${preset.id === p.id
                  ? 'border-indigo-500/50 bg-indigo-500/10'
                  : 'border-gray-200 dark:border-[#2D2F3E] hover:border-gray-300 dark:hover:border-[#3D3F4E]'
                }`}
            >
              <div className="flex gap-0.5 flex-shrink-0">
                {[p.colors.primary, p.colors.accent, p.colors.success].map((c, i) => (
                  <div key={i} className="w-4 h-4 rounded-sm border border-black/10" style={{ background: c }} />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-[#F1F2F6] flex-1">{p.name}</span>
              {!p.locked && (
                <div className="flex gap-1">
                  <button onClick={e => { e.stopPropagation(); exportPreset(p) }}
                    className="text-xs text-gray-400 hover:text-indigo-400 px-1" title="Export">↓</button>
                  <button onClick={e => { e.stopPropagation(); handleDelete(p.id) }}
                    className="text-xs text-gray-400 hover:text-red-400 px-1" title="Delete">×</button>
                </div>
              )}
            </div>
          ))}
          <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <button
            onClick={() => importRef.current.click()}
            className="py-1.5 text-xs text-gray-500 dark:text-[#8B8FA8] border border-dashed border-gray-300 dark:border-[#2D2F3E] rounded-lg hover:border-indigo-500 hover:text-indigo-400 transition-colors"
          >+ Import Preset</button>
        </div>
      )}

      {activeTab === 'customize' && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-500 dark:text-[#8B8FA8]">Adjusting colors creates a custom preset.</p>
          <div className="grid grid-cols-2 gap-2">
            {COLOR_FIELDS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <input type="color" value={preset.colors[key] || '#000000'}
                  onChange={e => handleColorChange(key, e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent" />
                <span className="text-xs text-gray-600 dark:text-[#8B8FA8]">{label}</span>
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
              <input value={saveName} onChange={e => setSaveName(e.target.value)}
                placeholder="Preset name" autoFocus
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                className="flex-1 border border-gray-300 dark:border-[#2D2F3E] bg-white dark:bg-[#0F1117] text-gray-900 dark:text-[#F1F2F6] rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-500" />
              <button onClick={handleSave} className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-500">Save</button>
              <button onClick={() => setShowSave(false)} className="px-3 py-1 text-xs text-gray-500 dark:text-[#8B8FA8] border border-gray-200 dark:border-[#2D2F3E] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2D2F3E]">✕</button>
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
