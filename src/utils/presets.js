export const BUILT_IN_PRESETS = [
  {
    id: 'corporate',
    name: 'Corporate Navy',
    locked: true,
    colors: {
      primary: '#0D2B4E',
      primaryMid: '#1A3F6F',
      primaryPale: '#F4F7FB',
      accent: '#C9A84C',
      textPrimary: '#4A5568',
      textMuted: '#718096',
      border: '#CBD5E0',
      success: '#1A7A4A',
      successLight: '#E8F5EE',
      danger: '#C0392B',
      dangerLight: '#FDEDEC',
      warning: '#D4800A',
      warningLight: '#FEF9E7',
    },
    fonts: {
      heading: 'Helvetica-Bold',
      body: 'Helvetica',
      size: { title: 20, sectionHeader: 8, label: 8, value: 8, tableHeader: 7.5, tableValue: 7.5 }
    }
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    locked: true,
    colors: {
      primary: '#1A1A2E',
      primaryMid: '#16213E',
      primaryPale: '#F0F4FF',
      accent: '#6366F1',
      textPrimary: '#374151',
      textMuted: '#6B7280',
      border: '#E5E7EB',
      success: '#059669',
      successLight: '#D1FAE5',
      danger: '#DC2626',
      dangerLight: '#FEE2E2',
      warning: '#D97706',
      warningLight: '#FEF3C7',
    },
    fonts: {
      heading: 'Helvetica-Bold',
      body: 'Helvetica',
      size: { title: 20, sectionHeader: 8, label: 8, value: 8, tableHeader: 7.5, tableValue: 7.5 }
    }
  },
  {
    id: 'clean-minimal',
    name: 'Clean Minimal',
    locked: true,
    colors: {
      primary: '#18181B',
      primaryMid: '#27272A',
      primaryPale: '#FAFAFA',
      accent: '#10B981',
      textPrimary: '#374151',
      textMuted: '#9CA3AF',
      border: '#E4E4E7',
      success: '#10B981',
      successLight: '#D1FAE5',
      danger: '#EF4444',
      dangerLight: '#FEE2E2',
      warning: '#F59E0B',
      warningLight: '#FEF3C7',
    },
    fonts: {
      heading: 'Helvetica-Bold',
      body: 'Helvetica',
      size: { title: 20, sectionHeader: 8, label: 8, value: 8, tableHeader: 7.5, tableValue: 7.5 }
    }
  }
]

const CUSTOM_KEY = 'pdf_builder_presets'

export function getCustomPresets() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_KEY)) || []
  } catch {
    return []
  }
}

export function saveCustomPreset(preset) {
  const existing = getCustomPresets()
  const idx = existing.findIndex(p => p.id === preset.id)
  if (idx >= 0) existing[idx] = preset
  else existing.push(preset)
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(existing))
}

export function deleteCustomPreset(id) {
  const existing = getCustomPresets().filter(p => p.id !== id)
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(existing))
}

export function exportPreset(preset) {
  const blob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${preset.name.replace(/\s+/g, '-').toLowerCase()}-preset.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importPreset(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const preset = JSON.parse(e.target.result)
        if (!preset.name || !preset.colors) throw new Error('Invalid preset file')
        preset.id = `custom-${Date.now()}`
        preset.locked = false
        resolve(preset)
      } catch {
        reject(new Error('Invalid preset file'))
      }
    }
    reader.readAsText(file)
  })
}
