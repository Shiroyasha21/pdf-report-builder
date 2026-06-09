import { PDFDownloadLink } from '@react-pdf/renderer'
import PDFDocument from './PDFDocument'
import { generatePyScript } from '../utils/generatePyScript'

export default function ExportBar({ docData, preset }) {
  function downloadPy() {
    const script = generatePyScript(docData, preset)
    const blob = new Blob([script], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const title = (docData.title || 'report').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
    a.download = `${title}.py`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!docData) return null
  const fileName = `${(docData.title || 'report').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}.pdf`

  return (
    <div className="flex gap-2">
      <PDFDownloadLink document={<PDFDocument docData={docData} preset={preset} />} fileName={fileName} className="flex-1">
        {({ loading }) => (
          <button disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {loading ? 'Preparing...' : 'Download PDF'}
          </button>
        )}
      </PDFDownloadLink>

      <button onClick={downloadPy}
        className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-[#8B8FA8] border border-gray-300 dark:border-[#2D2F3E] hover:bg-gray-50 dark:hover:bg-[#2D2F3E] transition-colors flex items-center gap-1.5">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        .py
      </button>
    </div>
  )
}
