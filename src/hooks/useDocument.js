import { useState } from 'react'

const STORAGE_KEY = 'pdf_builder_document'

function defaultDoc() {
  return { title: '', subtitle: '', date: '', meta: 'Submitted by: Operations Coordinator', sections: [] }
}

function makeSection(type) {
  const id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
  const defaults = {
    snapshot: {
      title: 'SNAPSHOT',
      data: { items: [
        { label: 'Total', value: '0', sub: null },
        { label: 'Completed', value: '0', sub: null },
        { label: 'Pending', value: '0', sub: null },
      ]}
    },
    keyvalue: {
      title: 'New Record',
      status: 'Active', statusColor: 'blue',
      data: { rows: [{ label: 'Label', value: 'Value', highlight: 'none' }] }
    },
    table: {
      title: 'NEW TABLE',
      data: { headers: ['Column 1', 'Column 2', 'Column 3'], rows: [['', '', ''], ['', '', '']] }
    },
    text: { title: 'NOTES', data: { content: '' } }
  }
  return { id, type, pageBreakBefore: false, ...(defaults[type] || defaults.text) }
}

export function useDocument() {
  const [doc, setDoc] = useState(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : defaultDoc() }
    catch { return defaultDoc() }
  })
  const [selectedId, setSelectedId] = useState(null)
  const [history, setHistory] = useState([])
  const [future, setFuture] = useState([])

  function save(next) {
    setHistory(h => [...h.slice(-30), doc])
    setFuture([])
    setDoc(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
  }

  function undo() {
    if (!history.length) return
    const prev = history[history.length - 1]
    setFuture(f => [doc, ...f])
    setHistory(h => h.slice(0, -1))
    setDoc(prev)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prev)) } catch {}
  }

  function redo() {
    if (!future.length) return
    const next = future[0]
    setHistory(h => [...h, doc])
    setFuture(f => f.slice(1))
    setDoc(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
  }

  function setDocMeta(fields) { save({ ...doc, ...fields }) }

  function updateSection(id, changes) {
    save({ ...doc, sections: doc.sections.map(s => s.id === id ? { ...s, ...changes } : s) })
  }

  function updateSectionData(id, dataChanges) {
    save({
      ...doc,
      sections: doc.sections.map(s =>
        s.id === id ? { ...s, data: { ...s.data, ...dataChanges } } : s
      )
    })
  }

  function addSection(type, afterId = null) {
    const ns = makeSection(type)
    let sections
    if (afterId) {
      const idx = doc.sections.findIndex(s => s.id === afterId)
      sections = [...doc.sections.slice(0, idx + 1), ns, ...doc.sections.slice(idx + 1)]
    } else {
      sections = [...doc.sections, ns]
    }
    save({ ...doc, sections })
    setSelectedId(ns.id)
    return ns.id
  }

  function removeSection(id) {
    save({ ...doc, sections: doc.sections.filter(s => s.id !== id) })
    if (selectedId === id) setSelectedId(null)
  }

  function moveSection(id, dir) {
    const idx = doc.sections.findIndex(s => s.id === id)
    const t = idx + dir
    if (t < 0 || t >= doc.sections.length) return
    const sections = [...doc.sections]
    ;[sections[idx], sections[t]] = [sections[t], sections[idx]]
    save({ ...doc, sections })
  }

  function loadFromAI(aiResult) {
    const sections = (aiResult.sections || []).map((s, i) => ({
      pageBreakBefore: false,
      ...s,
      id: s.id || `s_ai_${i}_${Date.now()}`
    }))
    save({ ...defaultDoc(), ...aiResult, sections })
    setSelectedId(null)
  }

  function clearDoc() {
    save(defaultDoc())
    setSelectedId(null)
  }

  return {
    doc, selectedId, setSelectedId,
    setDocMeta, updateSection, updateSectionData,
    addSection, removeSection, moveSection,
    loadFromAI, clearDoc, undo, redo,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
  }
}
