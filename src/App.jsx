import { useState, useEffect } from 'react'
import Header from './components/Header'
import DataInput from './components/DataInput'
import StylePanel from './components/StylePanel'
import SectionEditor from './components/SectionEditor'
import PDFPreview from './components/PDFPreview'
import ExportBar from './components/ExportBar'
import { useGuestLimit } from './hooks/useGuestLimit'
import { useGroq } from './hooks/useGroq'
import { BUILT_IN_PRESETS } from './utils/presets'

const TABS = ['Input', 'Style', 'Preview']

export default function App() {
  const [rawText, setRawText] = useState('')
  const [instructions, setInstructions] = useState('')
  const [docData, setDocData] = useState(null)
  const [preset, setPreset] = useState(BUILT_IN_PRESETS[0])
  const [activeTab, setActiveTab] = useState('Input')
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('pdf_builder_theme')
    return saved ? saved === 'dark' : true // default dark
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('pdf_builder_theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const { canParse, remaining, increment, isOwner, unlockOwner, lockOwner, limit } = useGuestLimit()
  const { parseData, loading, error } = useGroq()

  async function handleParse() {
    if (!canParse || !rawText.trim()) return
    const result = await parseData(rawText, instructions)
    if (result) {
      setDocData(result)
      increment()
      setActiveTab('Preview')
    }
  }

  function handleSectionsChange(sections) {
    setDocData(prev => ({ ...prev, sections }))
  }

  const leftPanel = (
    <div className="flex flex-col gap-4">
      <div className="bg-white dark:bg-[#1A1B23] rounded-xl border border-gray-200 dark:border-[#2D2F3E] p-4">
        <DataInput
          value={rawText}
          onChange={setRawText}
          instructions={instructions}
          onInstructionsChange={setInstructions}
          onParse={handleParse}
          loading={loading}
          canParse={canParse}
          remaining={remaining}
        />
        {error && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
            {error}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#1A1B23] rounded-xl border border-gray-200 dark:border-[#2D2F3E] p-4">
        <StylePanel preset={preset} onPresetChange={setPreset} isDark={isDark} />
      </div>

      {docData && (
        <div className="bg-white dark:bg-[#1A1B23] rounded-xl border border-gray-200 dark:border-[#2D2F3E] p-4">
          <SectionEditor sections={docData.sections} onSectionsChange={handleSectionsChange} isDark={isDark} />
        </div>
      )}

      {docData && (
        <div className="bg-white dark:bg-[#1A1B23] rounded-xl border border-gray-200 dark:border-[#2D2F3E] p-4">
          <ExportBar docData={docData} preset={preset} isDark={isDark} />
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0F1117] flex flex-col transition-colors duration-200">
      <Header
        remaining={remaining}
        isOwner={isOwner}
        limit={limit}
        onUnlock={unlockOwner}
        onLock={lockOwner}
        isDark={isDark}
        onToggleDark={() => setIsDark(d => !d)}
      />

      {/* Mobile tabs */}
      <div className="lg:hidden sticky top-14 z-30 bg-white dark:bg-[#1A1B23] border-b border-gray-200 dark:border-[#2D2F3E]">
        <div className="flex">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors border-b-2
                ${activeTab === tab
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-[#8B8FA8] hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 py-5">
        {/* Desktop */}
        <div className="hidden lg:grid lg:grid-cols-[400px_1fr] gap-5 h-[calc(100vh-88px)]">
          <div className="overflow-y-auto pr-1 pb-4">
            {leftPanel}
          </div>
          <div className="bg-white dark:bg-[#1A1B23] rounded-xl border border-gray-200 dark:border-[#2D2F3E] overflow-hidden">
            <PDFPreview docData={docData} preset={preset} isDark={isDark} />
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden">
          {activeTab === 'Input' && leftPanel}
          {activeTab === 'Style' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white dark:bg-[#1A1B23] rounded-xl border border-gray-200 dark:border-[#2D2F3E] p-4">
                <StylePanel preset={preset} onPresetChange={setPreset} isDark={isDark} />
              </div>
              {docData && (
                <div className="bg-white dark:bg-[#1A1B23] rounded-xl border border-gray-200 dark:border-[#2D2F3E] p-4">
                  <SectionEditor sections={docData.sections} onSectionsChange={handleSectionsChange} isDark={isDark} />
                </div>
              )}
            </div>
          )}
          {activeTab === 'Preview' && (
            <div className="bg-white dark:bg-[#1A1B23] rounded-xl border border-gray-200 dark:border-[#2D2F3E] overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
              <PDFPreview docData={docData} preset={preset} isDark={isDark} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
