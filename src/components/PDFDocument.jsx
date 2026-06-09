import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

function makeStyles(c) {
  return StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 39.6, // 0.55in
      paddingTop: 36,
      paddingBottom: 36,
      fontSize: 8,
    },

    // ── HEADER BANNER ─────────────────────────────────────────────
    headerWrap: { flexDirection: 'row', backgroundColor: c.primary, alignItems: 'center',
      paddingLeft: 14, paddingRight: 14, paddingTop: 16, paddingBottom: 16 },
    headerTitle: { flex: 0.6, fontFamily: 'Helvetica-Bold', fontSize: 20, color: '#FFFFFF', lineHeight: 1.2 },
    headerSub:   { flex: 0.4, fontFamily: 'Helvetica', fontSize: 10, color: c.accent, textAlign: 'right' },

    // ── ACCENT BAR ────────────────────────────────────────────────
    accentBar: { backgroundColor: c.accent, height: 3 },

    // ── META ROW ──────────────────────────────────────────────────
    metaWrap: { flexDirection: 'row', backgroundColor: c.primaryPale,
      paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 6 },
    metaLeft:  { flex: 0.5, fontFamily: 'Helvetica', fontSize: 8, color: c.textMuted },
    metaRight: { flex: 0.5, fontFamily: 'Helvetica', fontSize: 8, color: c.textMuted, textAlign: 'right' },

    sp14: { height: 14 },
    sp10: { height: 10 },
    sp8:  { height: 8 },
    sp6:  { height: 6 },
    sp4:  { height: 4 },

    // ── SECTION HEADER ────────────────────────────────────────────
    secHdrWrap: { backgroundColor: c.primaryMid, paddingLeft: 8, paddingTop: 6, paddingBottom: 6,
      borderBottomWidth: 1.5, borderBottomColor: c.accent },
    secHdrText: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: '#FFFFFF' },

    // ── SNAPSHOT TABLE ────────────────────────────────────────────
    snapOuterBorder: { borderWidth: 0.5, borderColor: c.border },
    snapRow: { flexDirection: 'row' },
    snapHdrCell: { flex: 1, backgroundColor: c.primary, paddingTop: 6, paddingBottom: 6,
      borderRightWidth: 0.3, borderRightColor: c.border, alignItems: 'center' },
    snapHdrText: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: '#FFFFFF', textAlign: 'center' },
    snapValCell: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 6, paddingBottom: 6,
      borderRightWidth: 0.3, borderRightColor: c.border, alignItems: 'center' },
    snapVal:     { fontFamily: 'Helvetica-Bold', fontSize: 14, color: c.primary, textAlign: 'center' },
    snapSub:     { fontFamily: 'Helvetica', fontSize: 7, color: c.textMuted, textAlign: 'center' },

    // ── JOB CARD HEADER ──────────────────────────────────────────
    cardHdrWrap: { flexDirection: 'row', alignItems: 'center' },
    cardHdrLeft: { flex: 1, backgroundColor: c.primary, paddingLeft: 10, paddingTop: 7, paddingBottom: 7 },
    cardHdrTitle:{ fontFamily: 'Helvetica-Bold', fontSize: 10, color: '#FFFFFF' },
    // status badge colors are dynamic

    // ── KV ROWS ──────────────────────────────────────────────────
    kvRow:     { flexDirection: 'row', paddingTop: 4, paddingBottom: 4 },
    kvRowEven: { backgroundColor: c.primaryPale },
    kvRowOdd:  { backgroundColor: '#FFFFFF' },
    kvLabel:   { width: '28%', paddingLeft: 10, paddingRight: 4,
      fontFamily: 'Helvetica-Bold', fontSize: 8, color: c.primaryMid },
    kvVal:     { width: '72%', paddingLeft: 6, paddingRight: 6,
      fontFamily: 'Helvetica', fontSize: 8, color: c.textPrimary },
    // highlighted value cells
    kvValGreen: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: '#1A5C35' },
    kvValRed:   { fontFamily: 'Helvetica-Bold', fontSize: 8, color: '#7A1A1A' },
    kvValAmber: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: c.warning },
    kvValBlue:  { fontFamily: 'Helvetica-Bold', fontSize: 8, color: c.primaryMid },
    kvHlGreen: { backgroundColor: c.successLight, borderLeftWidth: 2, borderLeftColor: c.success },
    kvHlRed:   { backgroundColor: c.dangerLight,  borderLeftWidth: 2, borderLeftColor: c.danger },
    kvHlAmber: { backgroundColor: c.warningLight, borderLeftWidth: 2, borderLeftColor: c.warning },
    kvHlBlue:  { backgroundColor: c.primaryPale,  borderLeftWidth: 2, borderLeftColor: c.primaryMid },
    kvHlWrap:  { width: '72%', paddingLeft: 4, paddingTop: 0, paddingBottom: 0 },

    // ── DATA TABLE ────────────────────────────────────────────────
    tblBorder:  { borderWidth: 0.5, borderColor: c.border },
    tblHdrRow:  { flexDirection: 'row', backgroundColor: c.primary,
      borderBottomWidth: 1.5, borderBottomColor: c.accent },
    tblHdrCell: { paddingTop: 5, paddingBottom: 5, paddingLeft: 8, paddingRight: 8,
      fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: '#FFFFFF', textAlign: 'center' },
    tblRow:     { flexDirection: 'row', borderBottomWidth: 0.3, borderBottomColor: c.border },
    tblRowEven: { backgroundColor: c.primaryPale },
    tblRowOdd:  { backgroundColor: '#FFFFFF' },
    tblCell:    { paddingTop: 5, paddingBottom: 5, paddingLeft: 8, paddingRight: 8,
      fontFamily: 'Helvetica', fontSize: 7.5, color: c.textPrimary },
    tblCellBold:{ paddingTop: 5, paddingBottom: 5, paddingLeft: 8, paddingRight: 8,
      fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: c.textPrimary },

    // ── TEXT ──────────────────────────────────────────────────────
    textContent:{ fontFamily: 'Helvetica', fontSize: 8, color: c.textPrimary, lineHeight: 1.5 },

    // ── FOOTER ────────────────────────────────────────────────────
    footerWrap:   { flexDirection: 'row', paddingTop: 4 },
    footerLeft:   { flex: 1, fontFamily: 'Helvetica-Bold', fontSize: 7, color: c.textMuted },
    footerCenter: { flex: 1, fontFamily: 'Helvetica', fontSize: 7, color: c.textMuted, textAlign: 'center' },
    footerRight:  { flex: 1, fontFamily: 'Helvetica', fontSize: 7, color: c.textMuted, textAlign: 'right' },
  })
}

// Status badge colors
function badgeColors(statusColor) {
  const map = {
    green: { bg: '#E8F5EE', text: '#1A7A4A' },
    red:   { bg: '#FDEDEC', text: '#C0392B' },
    amber: { bg: '#FEF9E7', text: '#D4800A' },
    blue:  { bg: '#D6E8F7', text: '#1A3F6F' },
    gray:  { bg: '#F4F7FB', text: '#718096' },
  }
  return map[statusColor] || map.gray
}

// ── SECTION RENDERERS ──────────────────────────────────────────

function SnapshotSection({ section, s }) {
  const items = section.data?.items || []
  if (!items.length) return null
  return (
    <View style={s.snapOuterBorder}>
      <View style={s.snapRow}>
        {items.map((item, i) => (
          <View key={i} style={[s.snapHdrCell, i === items.length - 1 && { borderRightWidth: 0 }]}>
            <Text style={s.snapHdrText}>{item.label}</Text>
          </View>
        ))}
      </View>
      <View style={s.snapRow}>
        {items.map((item, i) => (
          <View key={i} style={[s.snapValCell, i === items.length - 1 && { borderRightWidth: 0 }]}>
            <Text style={s.snapVal}>{item.value}</Text>
            {item.sub ? <Text style={s.snapSub}>{item.sub}</Text> : null}
          </View>
        ))}
      </View>
    </View>
  )
}

function KVSection({ section, s }) {
  const rows = section.data?.rows || []
  const badge = badgeColors(section.statusColor)

  return (
    <View>
      {/* Job card header */}
      <View style={s.cardHdrWrap}>
        <View style={s.cardHdrLeft}>
          <Text style={s.cardHdrTitle}>{section.title}</Text>
        </View>
        {section.status && (
          <View style={{
            paddingLeft: 10, paddingRight: 10, paddingTop: 7, paddingBottom: 7,
            backgroundColor: badge.bg, alignItems: 'center', justifyContent: 'center',
            minWidth: 80,
          }}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8, color: badge.text, textAlign: 'center' }}>
              {section.status}
            </Text>
          </View>
        )}
      </View>

      {/* KV rows */}
      {rows.map((row, i) => {
        const hl = row.highlight
        const isEven = i % 2 === 0
        const rowBg = hl ? {} : (isEven ? s.kvRowEven : s.kvRowOdd)
        const hlStyle = hl === 'green' ? s.kvHlGreen : hl === 'red' ? s.kvHlRed : hl === 'amber' ? s.kvHlAmber : hl === 'blue' ? s.kvHlBlue : null
        const valStyle = hl === 'green' ? s.kvValGreen : hl === 'red' ? s.kvValRed : hl === 'amber' ? s.kvValAmber : hl === 'blue' ? s.kvValBlue : s.kvVal

        return (
          <View key={i} style={[s.kvRow, rowBg]}>
            <Text style={s.kvLabel}>{row.label}</Text>
            {hlStyle ? (
              <View style={[s.kvHlWrap, hlStyle]}>
                <Text style={valStyle}>{row.value}</Text>
              </View>
            ) : (
              <Text style={s.kvVal}>{row.value}</Text>
            )}
          </View>
        )
      })}
    </View>
  )
}

function TableSection({ section, s }) {
  const headers = section.data?.headers || []
  const rows = section.data?.rows || []
  if (!headers.length) return null
  const flex = 1 / headers.length

  return (
    <View style={s.tblBorder}>
      <View style={s.tblHdrRow}>
        {headers.map((h, i) => (
          <Text key={i} style={[s.tblHdrCell, { flex }]}>{h}</Text>
        ))}
      </View>
      {rows.map((row, ri) => (
        <View key={ri} style={[s.tblRow, ri % 2 === 0 ? s.tblRowEven : s.tblRowOdd]}>
          {headers.map((_, ci) => (
            <Text key={ci} style={[ci === 0 ? s.tblCellBold : s.tblCell, { flex }]}>
              {row[ci] ?? '—'}
            </Text>
          ))}
        </View>
      ))}
    </View>
  )
}

function TextSection({ section, s }) {
  return <Text style={s.textContent}>{section.data?.content || ''}</Text>
}

// ── MAIN DOCUMENT ──────────────────────────────────────────────

export default function PDFDocument({ docData, preset }) {
  if (!docData) return null
  const s = makeStyles(preset.colors)
  const date = docData.date || new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  })

  return (
    <Document>
      <Page size="LETTER" style={s.page}>

        {/* Banner header */}
        <View style={s.headerWrap}>
          <Text style={s.headerTitle}>{docData.title || 'Report'}</Text>
          {docData.subtitle ? <Text style={s.headerSub}>{docData.subtitle}</Text> : null}
        </View>

        {/* Gold/accent bar */}
        <View style={s.accentBar} />

        {/* Meta row */}
        <View style={s.metaWrap}>
          <Text style={s.metaLeft}>{date}</Text>
          <Text style={s.metaRight}>Submitted by: Operations Coordinator</Text>
        </View>

        <View style={s.sp14} />

        {/* Sections */}
        {docData.sections.map((section, i) => (
          <View key={section.id || i}>
            {/* Section header — keyvalue gets its own card header instead */}
            {section.type !== 'keyvalue' && (
              <>
                <View style={s.secHdrWrap}>
                  <Text style={s.secHdrText}>{String(section.title).toUpperCase()}</Text>
                </View>
                <View style={s.sp6} />
              </>
            )}

            {section.type === 'snapshot' && <SnapshotSection section={section} s={s} />}
            {section.type === 'keyvalue' && <KVSection section={section} s={s} />}
            {section.type === 'table'    && <TableSection section={section} s={s} />}
            {section.type === 'text'     && <TextSection  section={section} s={s} />}

            <View style={s.sp14} />
          </View>
        ))}

        {/* Footer */}
        <View style={s.accentBar} />
        <View style={s.sp4} />
        <View style={s.footerWrap}>
          <Text style={s.footerLeft}>{docData.title || 'Report'}</Text>
          <Text style={s.footerCenter}>PDF Report Builder</Text>
          <Text style={s.footerRight}>{date}</Text>
        </View>

      </Page>
    </Document>
  )
}
