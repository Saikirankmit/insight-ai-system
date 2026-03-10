# InsightAI

An AI-powered conversational BI dashboard generator. Upload a CSV dataset, ask natural language questions, and get instant interactive charts and insights powered by Google Gemini.

## Architecture

**Frontend:** React 18 + Vite + TypeScript, running on port 5000
**Backend:** Express.js server, running on port 3000 (proxied from Vite in dev)

### Key stack
- React + React Router v6 for routing
- Zustand for client state (dataset, chat history, query history)
- Recharts for data visualization
- Framer Motion for animations
- Tailwind CSS + shadcn/ui components
- Google Gemini 2.5 Flash for AI analysis

## Structure

```
src/               - React frontend
  pages/           - Route pages (Landing, Login, Dashboard, DataExplorer, etc.)
  components/      - UI components (ChatPanel, DashboardPanel, ChartCard, etc.)
  lib/             - Zustand store, mock data, utilities
server/            - Express backend
  index.ts         - Server entry point (port 3000)
  routes/
    analyze-query.ts - AI analysis endpoint (proxies to Gemini API)
```

## Running

```bash
npm run dev   # Starts both frontend (5000) and backend (3000) concurrently
```

## Environment Variables / Secrets

- `GEMINI_API_KEY` — Google Gemini API key (stored as Replit secret, used only server-side)

## How it works

1. User uploads a CSV file — parsed client-side with PapaParse, stored in Zustand
2. User asks a question in the ChatPanel
3. Frontend POSTs to `/api/analyze-query` (proxied to Express server)
4. Express server calls Gemini API with the question + dataset schema + sample rows
5. Gemini returns SQL, a message, charts data, and table data
6. Frontend renders the result as interactive charts in the DashboardPanel

## Notes

- No database — all data is in-memory (CSV loaded per session)
- Login page is UI-only (no real auth)
- Migrated from Lovable (Supabase Edge Function replaced with Express route)
