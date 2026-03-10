# InsightAI V3 - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- GEMINI_API_KEY environment variable (for AI features)

---

## 📥 Installation

```bash
cd insight-ai-system
npm install
```

---

## 🎯 Running the Application

### Development Mode
```bash
npm run dev
```
This starts both:
- **Client**: http://localhost:5000 (Vite dev server)
- **Server**: http://localhost:3000 (Express API)

### Production Build
```bash
npm run build
npm start
```

---

## 💡 Using InsightAI V3 Features

### 1. Dataset Upload
1. Navigate to **Datasets** tab
2. Upload a CSV file
3. **Automatic**: Dataset intelligence panel appears showing:
   - Row/column counts
   - Detected metrics and dimensions
   - Suggested starter questions

### 2. Ask Questions
1. In chat panel, click a suggested question OR type your own
2. **Automatic**: Insights and suggestions generated
3. Dashboard updates with charts

### 3. Follow-up Queries
1. Click any suggestion button (displayed below chat)
2. OR type a follow-up question
3. Dashboard intelligently updates in place
4. New insights and suggestions appear

### 4. Generate Reports
1. After dashboard is displayed
2. Click **"Generate Business Report"** button
3. Markdown file downloads automatically
4. Share with stakeholders or team

---

## 🔧 API Endpoints

### POST `/api/analyze-dataset`
Analyzes uploaded dataset structure.

```bash
curl -X POST http://localhost:3000/api/analyze-dataset \
  -H "Content-Type: application/json" \
  -d '{
    "columns": [{"name": "revenue", "type": "number"}],
    "data": [...],
    "datasetName": "sales_data"
  }'
```

Response:
```json
{
  "rowCount": 1000,
  "columnCount": 5,
  "numericMetrics": ["revenue", "quantity"],
  "categoricalFields": ["region", "category"],
  "suggestedQuestions": ["Show revenue by region", ...]
}
```

### POST `/api/analyze-query`
Analyzes user query and generates dashboard.

```bash
curl -X POST http://localhost:3000/api/analyze-query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Show monthly revenue by region",
    "columns": [...],
    "sampleData": [...],
    "conversationHistory": [...]  // Optional, for follow-up queries
  }'
```

Response:
```json
{
  "sql": "SELECT ...",
  "message": "Here are your results...",
  "charts": [...],
  "table": [...],
  "insights": ["Revenue peaked in Q3", ...],
  "keyFindings": ["East region leads", ...],
  "recommendations": ["Focus on East region", ...],
  "querySuggestions": [{"text": "...", "category": "Comparison"}]
}
```

### POST `/api/generate-report`
Generates markdown business report.

```bash
curl -X POST http://localhost:3000/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "SELECT ...",
    "charts": [...],
    "table": [...],
    "datasetName": "sales_data"
  }'
```

Response:
```json
{
  "markdown": "# Business Report\n\n...",
  "timestamp": "2026-03-10T12:34:56Z"
}
```

---

## 📂 Project Structure

```
src/
├── components/
│   ├── ChatPanel.tsx                    ← Chat interface with suggestions
│   ├── DashboardPanel.tsx               ← Dashboard with insights & reports
│   ├── DatasetIntelligence.tsx          ← Dataset analysis display
│   ├── InsightSummary.tsx               ← Insights panel
│   ├── QuerySuggestions.tsx             ← Suggestions display
│   ├── BusinessReportGenerator.tsx      ← Report download button
│   └── ... (other existing components)
└── lib/
    └── store.ts                         ← State management

server/
└── routes/
    ├── analyze-dataset.ts               ← Dataset analysis endpoint
    ├── analyze-query.ts                 ← Query analysis endpoint (enhanced)
    ├── generate-report.ts               ← Report generation endpoint
    └── ... (other existing routes)
```

---

## 🎨 UI/UX Overview

### Layout
```
┌─────────────────────────────────────────┐
│              Navigation Bar             │
├──────────────────┬──────────────────────┤
│                  │                      │
│   Chat Panel     │  Dashboard Panel     │
│   (35%)          │  (65%)               │
│                  │                      │
│  - Messages      │  - Insights Summary  │
│  - Suggestions   │  - Charts            │
│  - Input         │  - Data Table        │
│  - Intelligence  │  - Suggestions Info  │
│                  │  - Report Button     │
│                  │                      │
└──────────────────┴──────────────────────┘
```

### Component Hierarchy
- **ChatPanel**
  - Messages (user/AI)
  - DatasetIntelligencePanel
  - QuerySuggestionsPanel (clickable)
  - Input area

- **DashboardPanel**
  - InsightSummaryPanel
  - SQLViewer
  - Charts (grid)
  - DataTable
  - QuerySuggestionsPanel (info)
  - BusinessReportGenerator

---

## 🧪 Testing V3 Features

### Test Case 1: Dataset Intelligence
```
1. Upload sample_data.csv
2. Verify dataset summary appears
3. Check row/column counts are correct
4. Click a suggested question
5. Dashboard appears with data
```

### Test Case 2: Insights
```
1. Ask a query: "Show revenue by region"
2. Check dashboard appears
3. Verify insights panel displays:
   - Key insights (bullet points)
   - Key findings (data patterns)
   - Recommendations (actions)
```

### Test Case 3: Suggestions
```
1. After dashboard appears
2. Verify suggestion buttons appear in chat
3. Click one suggestion
4. Dashboard updates without refresh
5. New suggestions appear for new data
```

### Test Case 4: Follow-up Query
```
1. Ask initial query
2. Type follow-up: "Filter to East region"
3. Verify dashboard updates in place
4. Check conversation history maintained
5. Verify new insights generated
```

### Test Case 5: Report Generation
```
1. Dashboard with data displayed
2. Click "Generate Business Report"
3. Verify download prompt appears
4. Open downloaded .md file
5. Check contains:
   - SQL query
   - Chart data
   - Recommendations
   - Timestamp
```

---

## 🐛 Troubleshooting

### Issue: Components not showing
**Solution**: 
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Check console for errors (F12)

### Issue: API errors
**Solution**:
1. Verify GEMINI_API_KEY is set
2. Check server is running on port 3000
3. Verify dataset is uploaded before queries
4. Check API response in browser DevTools (Network tab)

### Issue: Insights/Suggestions not appearing
**Solution**:
1. Ensure chart data is valid
2. Check server logs for `generateInsights()` errors
3. Verify API response includes these fields
4. Try a different query

### Issue: Report download fails
**Solution**:
1. Check browser download settings
2. Verify dashboard has data
3. Check server logs for `/api/generate-report` errors
4. Try different dashboard query

---

## 🔗 Architecture Overview

### Data Flow
```
User Action → ChatPanel → /api/analyze-query → Generate Insights
                                    ↓
                              Store Update
                                    ↓
                              DashboardPanel Renders
                                    ↓
                        Display Insights + Suggestions
```

### Conversation Context
- Last 6 messages stored
- Passed to AI on each query
- Enables context-aware follow-ups
- Maintains conversation history

### Insight Generation
- Analyzes chart data statistics
- Calculates min/max/average/variation
- Generates insights based on patterns
- Creates category-based suggestions

---

## 📊 Key Libraries Used

- **Frontend**:
  - React 18
  - TypeScript
  - Zustand (state management)
  - Framer Motion (animations)
  - Shadcn UI (components)
  - Recharts (charting)

- **Backend**:
  - Express.js
  - Google Gemini API (for AI analysis)
  - TypeScript

---

## ✅ Verification Checklist

Before deployment:

- [ ] npm run build succeeds
- [ ] No TypeScript errors
- [ ] All components render
- [ ] API endpoints respond
- [ ] Dataset upload works
- [ ] Insights appear
- [ ] Suggestions work
- [ ] Reports download
- [ ] Follow-up queries work
- [ ] No console errors

---

## 📖 Additional Documentation

- `V3_UPGRADE_DOCUMENTATION.md` - Full technical documentation
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
- Component source files - Inline JSDoc comments
- API route files - Request/response specs

---

## 🎓 Learning Resources

### Understanding the Features
1. Start with dataset upload
2. Ask simple queries
3. Click suggestions to see context
4. Try follow-up queries
5. Generate a report

### Modifying Features
1. Read component source code
2. Check store definitions
3. Review API route implementations
4. Follow existing patterns
5. Test changes locally

---

## 🚀 Next Steps

1. **Install & Run**
   ```bash
   npm install && npm run dev
   ```

2. **Test Features** (following test cases above)

3. **Deploy** (when ready for production)
   ```bash
   npm run build
   npm start
   ```

4. **Monitor** (check server logs, user feedback)

5. **Enhance** (add custom features as needed)

---

## 💬 Support & Feedback

For issues or enhancements:
1. Check troubleshooting section
2. Review API documentation
3. Check component source code
4. Refer to full documentation files

---

## 📝 Version Information

- **Current Version**: 3.0.0
- **Release Date**: 2026-03-10
- **Features**: 5 major analytics features
- **New Endpoints**: 2 (/api/analyze-dataset, /api/generate-report)
- **Status**: Production Ready

---

Happy analyzing! 🎉

