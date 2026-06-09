import { useState } from 'react'

async function callGroq(prompt) {
  const devKey = import.meta.env.VITE_GROQ_API_KEY

  if (devKey) {
    // Local dev — direct call
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${devKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 4096,
      })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || `Groq error (${res.status})`)
    return data.choices[0].message.content
  } else {
    // Production — via Cloudflare Worker proxy
    const res = await fetch('/api/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
    return data.content
  }
}

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
   - "snapshot": Use ONLY for 3–6 high-level counters/metrics (e.g. "Jobs Today: 2, Completed: 1"). Each item: { label, value, sub }.
   - "keyvalue": For a single record's labeled fields (one job, one contact). Include "status" and "statusColor". Rows: { label, value, highlight }.
   - "table": For 2+ records with 3+ consistent columns. Exact headers. Rows must match header count.
   - "text": For notes, narratives, or freeform content.
5. HIGHLIGHT RULES for keyvalue rows:
   - green → paid, complete, approved, confirmed, good, done, settled
   - red → overdue, failed, cancelled, missing, rejected
   - amber → pending, in progress, waiting, open, submitted, not confirmed
   - blue → IDs, reference numbers, informational
   - none → default
6. OMIT sections with no data or marked "omit".
7. Multiple similar records = separate keyvalue section each.
8. Every keyvalue section MUST have "status" and "statusColor" (green/red/amber/blue/gray).

Return ONLY valid JSON — no markdown fences, no explanation:
{
  "title": "string",
  "subtitle": "string or null",
  "date": "string or null",
  "meta": "string or null",
  "sections": [
    {
      "id": "unique_snake_case_id",
      "type": "snapshot | keyvalue | table | text",
      "title": "SECTION TITLE",
      "status": "string (keyvalue only)",
      "statusColor": "green | red | amber | blue | gray (keyvalue only)",
      "pageBreakBefore": false,
      "data": {}
    }
  ]
}

Data formats:
- snapshot: { "items": [{ "label": "string", "value": "string", "sub": "string|null" }] }
- keyvalue: { "rows": [{ "label": "string", "value": "string", "highlight": "none|green|red|amber|blue" }] }
- table:    { "headers": ["col1","col2",...], "rows": [["val1","val2",...]] }
- text:     { "content": "string" }

RAW DATA:
${rawText}`

    try {
      const text = await callGroq(prompt)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Could not extract structured data from AI response.')
      const parsed = JSON.parse(jsonMatch[0])
      parsed.sections = (parsed.sections || []).map((s, i) => ({
        pageBreakBefore: false,
        ...s,
        id: s.id || `s_${i}_${Date.now()}`
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
