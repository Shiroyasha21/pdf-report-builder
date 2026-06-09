import { useState } from 'react'

const GROQ_ENDPOINT = '/api/parse'

export function useGroq() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function parseData(rawText, instructions = '') {
    setLoading(true)
    setError(null)

    const prompt = `You are an expert document parser that converts raw data into structured PDF reports.
The output style should closely replicate a professional operations report with:
- A bold banner header (title + subtitle)
- A gold/accent bar separator
- Labeled section headers
- Job/record cards with a status badge on the right
- Key-value detail rows with alternating row colors
- Summary snapshot tables (metrics/counters)
- Data tables with header rows
- A footer bar

${instructions ? `USER INSTRUCTIONS (follow these exactly, they override your defaults):\n${instructions}\n` : ''}

PARSING RULES:
1. TITLE: Extract the main document title (e.g. "Daily Operations Report — June 8, 2026"). Make it descriptive.
2. SUBTITLE: Short descriptor like "End of Shift Report" or "Operations Summary".
3. DATE: Extract the primary date in readable format (e.g. "Monday, June 8, 2026").
4. SECTIONS — choose the right type:
   - "snapshot": Use ONLY for 3–6 high-level counters/metrics at the top (e.g. "Jobs Today: 2, Completed: 1"). Each item: { label, value, sub }.
   - "keyvalue": For a single record's labeled fields (one job, one contact, etc.). Include a "status" field (e.g. "Completed", "In Progress") and "statusColor" ("green"/"red"/"amber"/"blue"/"gray"). Rows: { label, value, highlight }.
   - "table": For 2+ records with 3+ consistent columns. Specify exact headers. Rows must match header count exactly.
   - "text": For notes, narratives, or freeform content.
5. HIGHLIGHT RULES for keyvalue rows:
   - green → paid, complete, approved, confirmed, good, done, settled, resolved
   - red → overdue, failed, cancelled, missing, rejected, void
   - amber → pending, in progress, waiting, open, review, submitted, not confirmed
   - blue → IDs, reference numbers, links, informational
   - none → default neutral fields
6. TABLES: Make headers concise. Trim cell values. Pad missing cells with "—".
7. OMIT sections with no data, marked "omit", or not applicable.
8. Multiple similar records (e.g. multiple jobs) = separate keyvalue section each.
9. STATUS BADGE: Every keyvalue section MUST have "status" and "statusColor".

Return ONLY valid JSON — no markdown, no explanation, no code block:
{
  "title": "string",
  "subtitle": "string or null",
  "date": "string or null",
  "sections": [
    {
      "id": "unique_snake_case_id",
      "type": "snapshot | keyvalue | table | text",
      "title": "SECTION TITLE",
      "status": "string (keyvalue only, e.g. Completed)",
      "statusColor": "green | red | amber | blue | gray (keyvalue only)",
      "data": {
        // snapshot:  { "items": [{ "label": "string", "value": "string", "sub": "string|null" }] }
        // keyvalue:  { "rows": [{ "label": "string", "value": "string", "highlight": "none|green|red|amber|blue" }] }
        // table:     { "headers": ["col1","col2",...], "rows": [["val1","val2",...]] }
        // text:      { "content": "string" }
      }
    }
  ]
}

RAW DATA TO PARSE:
${rawText}`

    try {
      const res = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Request failed (${res.status})`)
      }

      const data = await res.json()
      const text = data.content

      // Extract JSON — handle potential markdown code fences
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Could not extract structured data from AI response.')

      const parsed = JSON.parse(jsonMatch[0])

      // Ensure all sections have an id
      parsed.sections = (parsed.sections || []).map((s, i) => ({
        ...s,
        id: s.id || `section_${i}`
      }))

      return parsed
    } catch (e) {
      setError(e.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { parseData, loading, error }
}
