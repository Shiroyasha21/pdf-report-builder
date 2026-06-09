# PDF Report Builder

A browser-based tool for turning raw data into polished, professional PDF reports using AI. No backend server, no subscriptions, no cost.

Live: [pdf-report-builder.pages.dev](https://pdf-report-builder.pages.dev)

---

## Why I Built This

At work, I found myself repeatedly copying data out of spreadsheets, CRMs, and notes just to manually format it into reports. It was tedious, inconsistent, and time-consuming. Every report looked different depending on who made it.

I wanted a tool that could take any raw data — pasted text, exported rows, job logs, call notes — and instantly structure it into a clean, consistent PDF. No formatting overhead. No design decisions. Just paste and export.

This project solves that specific problem: turning unstructured data into structured, downloadable PDF reports with minimal effort.

---

## What Problem It Solves

Most PDF tools are either too complex (full design suites) or too limited (basic exporters). There is a gap between "I have raw data" and "I have a professional document."

PDF Report Builder fills that gap by:

- Removing the need to manually format data into a document
- Giving non-technical users a way to produce consistent reports quickly
- Letting AI do the structural interpretation so the user only needs to paste their data
- Providing a visual editor for adjustments when the AI output needs tweaking

---

## Features

### AI-Powered Parsing
Paste any raw data into the "Fill with AI" modal. The AI reads the content, identifies the structure, and automatically builds the document with appropriate sections, titles, and formatting. Supports operations reports, job logs, call records, shift summaries, and more.

### Section Types
- **Snapshot** -- A grid of key metrics or counters. Best for high-level summaries (e.g. Jobs Today: 4, Completed: 3).
- **Key-Value** -- A labeled field list for a single record. Includes a status badge with color coding (green, red, amber, blue).
- **Table** -- A structured data table with headers. Best for multiple records with consistent columns.
- **Text** -- Freeform narrative or notes section.

### Visual Editor
All sections are editable after AI parsing. Click any section to select it, edit values directly on the canvas, reorder sections by dragging, or delete sections you do not need.

### Style Presets
Choose from three built-in themes:
- **Corporate Navy** -- Dark navy header with gold accent. Formal and traditional.
- **Modern Dark** -- Deep navy with indigo accent. Clean and contemporary.
- **Clean Minimal** -- Near-black with green accent. Simple and readable.

Custom presets can be created, exported as JSON, and imported on other devices.

### PDF Preview and Export
Toggle a live PDF preview before downloading. The export produces a properly formatted PDF with the selected theme applied throughout.

### Undo / Redo
Full undo and redo history for all document edits.

### Guest Limits and Owner Mode
Guest users have a daily parse limit to manage AI usage. Owners can unlock unlimited access using a PIN set at the application level.

### Dark and Light Mode
Full dark and light theme support, persisted across sessions.

---

## How to Use

### Quick Start (AI-Assisted)

1. Open the app at [pdf-report-builder.pages.dev](https://pdf-report-builder.pages.dev)
2. Click **"Fill with AI"** in the left panel
3. Paste your raw data (spreadsheet rows, job notes, CRM export, anything)
4. Optionally add instructions (e.g. "Title it Daily Report -- June 10. Group calls into one table.")
5. Click **"Parse and Fill"**
6. The AI structures your data into document sections automatically
7. Edit any section directly on the canvas if needed
8. Click **"PDF"** in the top right to download

### Manual Mode

1. Use the **Add** panel on the left to insert sections one by one
2. Select a section type (Snapshot, Key-Value, Table, or Text)
3. Fill in the content using the editor
4. Use the **Props** panel on the right to adjust the document title, subtitle, date, and style preset
5. Download when ready

### Changing the Style

- Open the **Props** panel
- Select a preset from the dropdown
- The entire document updates immediately
- To create a custom theme, click "New Preset", adjust colors, and save

---

## Tech Stack

- **React** with Vite
- **react-pdf / @react-pdf/renderer** for PDF generation
- **Tailwind CSS** for styling
- **Cloudflare Pages** for hosting and deployment
- **Cloudflare Workers AI** for the AI parsing backend (Llama 3.1 8B)

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/Shiroyasha21/pdf-report-builder.git
cd pdf-report-builder

# Install dependencies
npm install

# Add your Groq API key for local dev (optional -- used only in development)
# Create a .env file:
echo "VITE_GROQ_API_KEY=your_key_here" > .env

# Start the dev server
npm run dev
```

In production, the app routes AI requests through a Cloudflare Pages Function (`/api/parse`) using Cloudflare Workers AI. No external API key is needed in production.

---

## Deployment

The project deploys automatically to Cloudflare Pages on every push to `main`.

Required Cloudflare setup:
- **AI Binding** -- Add a Workers AI binding with variable name `AI` under Pages > Settings > Bindings
- No other environment variables are required for production

---

## License

MIT
