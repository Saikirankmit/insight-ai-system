# InsightAI - Project Memory

## Design System
- Font: Outfit (primary), JetBrains Mono (code)
- Color system: HSL CSS vars in index.css, dark-first design
- Primary: 199 89% 48% (cyan-blue), Accent: 262 83% 58% (purple)
- Glass morphism panels with backdrop-blur
- Gradient buttons (btn-gradient), glass buttons (btn-glass)
- Floating orbs for ambient lighting effects
- stat-card class with hover top-border gradient

## Architecture
- Routes: / (landing), /login (visual only), /app/* (dashboard suite)
- Login: No auth yet, clicking sign in navigates to /app
- Store: Zustand with chat messages, dashboard state, dataset, query history
- DashboardPage: Two-panel layout (ChatPanel 35% | DashboardPanel 65%) using resizable panels
- ChatPanel: Conversational AI interface with message history, pipeline progress inline
- DashboardPanel: Dynamic charts/tables updated from chat responses
- Conversation history sent to edge function for follow-up query support

## AI Integration
- Gemini API key stored as GEMINI_API_KEY secret
- Edge function: supabase/functions/analyze-query/index.ts
- Uses Gemini structured output (responseSchema) for SQL + charts + message
- Accepts conversationHistory for multi-turn context
- verify_jwt = false in config.toml

## User Preferences
- User wants: best UI, animations, interactive, no generic feel
- User will add auth later
