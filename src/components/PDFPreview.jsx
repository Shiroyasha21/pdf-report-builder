import { PDFViewer } from '@react-pdf/renderer'
import PDFDocument from './PDFDocument'

export default function PDFPreview({ docData, preset }) {
  if (!docData) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#2D2F3E] flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-300 dark:text-[#5A5F7A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-[#8B8FA8]">No preview yet</p>
        <p className="text-xs text-gray-400 dark:text-[#5A5F7A] mt-1">Paste your data and click Parse to see the PDF here</p>
      </div>
    )
  }

  return (
    <PDFViewer className="w-full h-full" showToolbar={false}>
      <PDFDocument docData={docData} preset={preset} />
    </PDFViewer>
  )
}
