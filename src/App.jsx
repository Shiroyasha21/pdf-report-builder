import { useState, useEffect } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import Header from './components/Header'
import AIModal from './components/AIModal'
import EditorCanvas from './components/editor/EditorCanvas'
import AddSectionPanel from './components/editor/AddSectionPanel'
import PropertiesPanel from './components/editor/PropertiesPanel'
import PDFDocument from './components/PDFDocument'
import PDFPreview from './components/PDFPreview'
import PinModal from './components/PinModal'
import { useDocument } from './hooks/useDocument'
import { useGuestLimit } from './hooks/useGuestLimit'
import { BUILT_IN_PRESETS } from './utils/presets'

const MOBILE_TABS = ['Edit', 'Add', 'Props', 'Preview']

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const s = localStorage.getItem('pdf_builder_theme')
    return s ? s === 'dark' : true
  })
  const [showAI, setShowAI] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [mobileTab, setMobileTab] = useState('Edit')
  const [preset, setPreset] = useState(BUILT_IN_PRESETS[0])

  const {
    doc, selectedId, setSelectedId,
    setDocMeta, updateSection, addSection, removeSection, moveSection,
    loadFromAI, undo, redo, canUndo, canRedo
  } = useDocument()

  const { canParse, remaining, increment, isOwner, unlockOwner, lockOwner, limit } = useGuestLimit()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('pdf_builder_theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const selectedSection = doc.sections.find(s => s.id === selectedId) || null

  // Unified update handler — handles both __meta__ and section updates
  function handleUpdate(id, changes) {
    if (id === '__meta__') {
      setDocMeta(changes)
    } else {
      // Separate top-level section fields from data changes
      const { data, ...topLevel } = changes
      if (Object.keys(topLevel).length) updateSection(id, topLevel)
      if (data) updateSection(id, { data: { ...(doc.sections.find(s => s.id === id)?.data || {}), ...data } })
    }
  }

  function handleTogglePageBreak(id) {
    const section = doc.sections.find(s => s.id === id)
    if (section) updateSection(id, { pageBreakBefore: !section.pageBreakBefore })
  }

  function handleAIResult(result) {
    loadFromAI(result)
    increment()
  }

  const fileName = `${(doc.title || 'report').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
  const hasContent = doc.sections.length > 0 || doc.title

  // ── PANELS ────────────────────────────────────────────────────

  const leftPanel = (
    <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-[#2D2F3E] bg-white dark:bg-[#1A1B23] overflow-y-auto p-4">
      <AddSectionPanel
        onAdd={addSection}
        onAIClick={() => setShowAI(true)}
        insertAfterId={selectedId}
      />
    </div>
  )

  const rightPanel = (
    <div className="w-64 flex-shrink-0 border-l border-gray-200 dark:border-[#2D2F3E] bg-white dark:bg-[#1A1B23] overflow-hidden flex flex-col">
      <PropertiesPanel
        selectedSection={selectedSection}
        onUpdateSection={updateSection}
        preset={preset}
        onPresetChange={setPreset}
        doc={doc}
        onDocMeta={setDocMeta}
      />
    </div>
  )

  return (
    <div className="h-screen flex flex-col bg-[#F8F9FB] dark:bg-[#0F1117] overflow-hidden">

      {/* ── HEADER ── */}
      <header className="flex-shrink-0 bg-white dark:bg-[#1A1B23] border-b border-gray-200 dark:border-[#2D2F3E] h-12 flex items-center px-4 gap-3 z-40">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 dark:text-[#F1F2F6] text-sm hidden sm:inline">Report Builder</span>
        </div>

        {/* Doc title display */}
        <div className="flex-1 min-w-0 hidden md:block">
          <span className="text-sm text-gray-400 dark:text-[#5A5F7A] truncate">
            {doc.title || 'Untitled Document'}
          </span>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button onClick={undo} disabled={!canUndo} title="Undo"
            className="w-7 h-7 flex items-center justify-center rounded text-gray-400 dark:text-[#8B8FA8] hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2D2F3E] disabled:opacity-25 transition-colors text-sm">
            ↺
          </button>
          <button onClick={redo} disabled={!canRedo} title="Redo"
            className="w-7 h-7 flex items-center justify-center rounded text-gray-400 dark:text-[#8B8FA8] hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2D2F3E] disabled:opacity-25 transition-colors text-sm">
            ↻
          </button>
        </div>

        {/* Usage dots */}
        {!isOwner && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 dark:text-[#8B8FA8]">
            <div className="flex gap-0.5">
              {Array.from({ length: limit }).map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i < (limit - remaining) ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-[#2D2F3E]'}`} />
              ))}
            </div>
            <span className="hidden lg:inline">{remaining}/{limit}</span>
          </div>
        )}
        {isOwner && <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full hidden sm:inline">Owner</span>}

        {/* Preview toggle */}
        <button onClick={() => setShowPreview(v => !v)}
          className={`hidden sm:flex items-center gap-1.5 px-3 h-7 rounded-lg text-xs font-medium transition-colors
            ${showPreview ? 'bg-indigo-600 text-white' : 'border border-gray-300 dark:border-[#2D2F3E] text-gray-600 dark:text-[#8B8FA8] hover:bg-gray-50 dark:hover:bg-[#2D2F3E]'}`}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </button>

        {/* Download PDF */}
        {hasContent && (
          <PDFDownloadLink document={<PDFDocument docData={doc} preset={preset} />} fileName={fileName}>
            {({ loading }) => (
              <button disabled={loading}
                className="flex items-center gap-1.5 px-3 h-7 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors disabled:opacity-60 shadow-md shadow-indigo-500/20 flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {loading ? '...' : 'PDF'}
              </button>
            )}
          </PDFDownloadLink>
        )}

        {/* Dark toggle */}
        <button onClick={() => setIsDark(d => !d)}
          className="w-7 h-7 flex items-center justify-center rounded text-gray-400 dark:text-[#8B8FA8] hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2D2F3E] transition-colors">
          {isDark
            ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          }
        </button>

        {/* PIN */}
        <button onClick={() => isOwner ? lockOwner() : setShowPin(true)}
          className="w-7 h-7 flex items-center justify-center rounded text-gray-400 dark:text-[#8B8FA8] hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2D2F3E] transition-colors text-sm">
          {isOwner ? '🔓' : '🔒'}
        </button>
      </header>

      {/* ── MOBILE TAB BAR ── */}
      <div className="lg:hidden flex-shrink-0 flex border-b border-gray-200 dark:border-[#2D2F3E] bg-white dark:bg-[#1A1B23]">
        {MOBILE_TABS.map(t => (
          <button key={t} onClick={() => setMobileTab(t)}
            className={`flex-1 py-2 text-xs font-medium transition-colors border-b-2
              ${mobileTab === t ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-500 dark:text-[#8B8FA8]'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {leftPanel}

        {/* Center — editor or preview */}
        {showPreview ? (
          <div className="flex-1 overflow-hidden bg-white dark:bg-[#1A1B23]">
            <PDFPreview docData={doc.sections.length ? doc : null} preset={preset} />
          </div>
        ) : (
          <EditorCanvas
            doc={doc}
            selectedId={selectedId}
            preset={preset}
            onSelectSection={setSelectedId}
            onUpdateSection={handleUpdate}
            onMoveSection={moveSection}
            onDeleteSection={removeSection}
            onTogglePageBreak={handleTogglePageBreak}
            onAddSection={addSection}
            onAddAfter={(afterId) => { const id = addSection('text', afterId); setSelectedId(id) }}
          />
        )}

        {rightPanel}
      </div>

      {/* ── MOBILE LAYOUT ── */}
      <div className="lg:hidden flex-1 overflow-hidden">
        {mobileTab === 'Edit' && (
          <EditorCanvas
            doc={doc}
            selectedId={selectedId}
            preset={preset}
            onSelectSection={setSelectedId}
            onUpdateSection={handleUpdate}
            onMoveSection={moveSection}
            onDeleteSection={removeSection}
            onTogglePageBreak={handleTogglePageBreak}
            onAddSection={addSection}
            onAddAfter={(afterId) => { addSection('text', afterId); setMobileTab('Add') }}
          />
        )}
        {mobileTab === 'Add' && (
          <div className="p-4 overflow-y-auto h-full bg-white dark:bg-[#1A1B23]">
            <AddSectionPanel onAdd={addSection} onAIClick={() => setShowAI(true)} insertAfterId={selectedId} />
          </div>
        )}
        {mobileTab === 'Props' && (
          <div className="overflow-hidden h-full bg-white dark:bg-[#1A1B23]">
            <PropertiesPanel
              selectedSection={selectedSection}
              onUpdateSection={updateSection}
              preset={preset}
              onPresetChange={setPreset}
              doc={doc}
              onDocMeta={setDocMeta}
            />
          </div>
        )}
        {mobileTab === 'Preview' && (
          <div className="h-full bg-white dark:bg-[#1A1B23]">
            <PDFPreview docData={doc.sections.length ? doc : null} preset={preset} />
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      {showAI && (
        <AIModal
          onClose={() => setShowAI(false)}
          onResult={handleAIResult}
          canParse={canParse}
          remaining={remaining}
        />
      )}
      {showPin && (
        <PinModal
          onClose={() => setShowPin(false)}
          onUnlock={pin => { const ok = unlockOwner(pin); if (ok) setShowPin(false); return ok }}
        />
      )}
    </div>
  )
}
