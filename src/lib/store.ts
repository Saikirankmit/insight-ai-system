import { create } from "zustand";
import type { QueryHistoryItem } from "./mockData";

export interface ColumnDef {
  name: string;
  type: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  dashboardData?: DashboardData | null;
}

export interface DashboardData {
  sql: string;
  charts: { type: "line" | "bar" | "pie" | "area"; title: string; data: any[]; keys: string[]; id?: string }[];
  table: any[];
  conversationActionHistory?: string[]; // Track 'add', 'modify', 'filter', 'reset' actions
}

// V3 Features
export interface InsightSummary {
  insights: string[];
  keyFindings: string[];
  recommendations: string[];
}

export interface QuerySuggestion {
  id: string;
  text: string;
  category: string;
}

export interface DatasetIntelligence {
  rowCount: number;
  columnCount: number;
  numericMetrics: string[];
  categoricalFields: string[];
  suggestedQuestions: string[];
}

interface AppState {
  // Dataset
  datasetLoaded: boolean;
  datasetName: string;
  dataset: Record<string, any>[];
  columns: ColumnDef[];
  loadDataset: (name: string, data: Record<string, any>[], columns: ColumnDef[]) => void;
  clearDataset: () => void;

  // Chat / Conversation
  chatMessages: ChatMessage[];
  currentDashboard: DashboardData | null;
  addChatMessage: (msg: ChatMessage) => void;
  setCurrentDashboard: (data: DashboardData | null) => void;
  mergeDashboard: (action: "add" | "modify" | "filter" | "reset", newData: DashboardData) => void;
  clearChat: () => void;

  // Query history
  queryHistory: QueryHistoryItem[];
  addQueryToHistory: (item: QueryHistoryItem) => void;
  clearHistory: () => void;

  // V3 Features
  datasetIntelligence: DatasetIntelligence | null;
  setDatasetIntelligence: (intel: DatasetIntelligence | null) => void;
  
  insightSummary: InsightSummary | null;
  setInsightSummary: (summary: InsightSummary | null) => void;
  
  querySuggestions: QuerySuggestion[];
  setQuerySuggestions: (suggestions: QuerySuggestion[]) => void;

  // Theme
  isDark: boolean;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  datasetLoaded: false,
  datasetName: "",
  dataset: [],
  columns: [],
  loadDataset: (name, data, columns) =>
    set({ datasetLoaded: true, datasetName: name, dataset: data, columns }),
  clearDataset: () =>
    set({ datasetLoaded: false, datasetName: "", dataset: [], columns: [], datasetIntelligence: null }),

  chatMessages: [],
  currentDashboard: null,
  addChatMessage: (msg) =>
    set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  setCurrentDashboard: (data) => set({ currentDashboard: data }),
  mergeDashboard: (action, newData) =>
    set((s) => {
      if (action === "reset" || !s.currentDashboard) {
        return {
          currentDashboard: {
            ...newData,
            conversationActionHistory: [action],
          },
        };
      }

      const current = { ...s.currentDashboard };
      const history = [...(current.conversationActionHistory || []), action];

      if (action === "add") {
        // Add new charts to existing dashboard
        const newCharts = newData.charts.map((c, i) => ({ ...c, id: `${Date.now()}-${i}` }));
        return {
          currentDashboard: {
            sql: newData.sql || current.sql,
            charts: [...current.charts, ...newCharts],
            table: newData.table || current.table,
            conversationActionHistory: history,
          },
        };
      }

      if (action === "modify") {
        // Replace the last chart(s) or refine them
        const lastChartIndex = Math.max(
          0,
          current.charts.length - (newData.charts.length || 1)
        );
        const preservedCharts = current.charts.slice(0, lastChartIndex);
        const modifiedCharts = newData.charts.map((c, i) => ({
          ...c,
          id: current.charts[lastChartIndex + i]?.id || `${Date.now()}-${i}`,
        }));
        return {
          currentDashboard: {
            sql: newData.sql || current.sql,
            charts: [...preservedCharts, ...modifiedCharts],
            table: newData.table || current.table,
            conversationActionHistory: history,
          },
        };
      }

      if (action === "filter") {
        // Apply filter to existing charts (update their data)
        const filteredCharts = current.charts.map((chart, i) => {
          if (i === current.charts.length - 1 && newData.charts[0]) {
            return {
              ...chart,
              data: newData.charts[0].data,
              table: newData.table,
            };
          }
          return chart;
        });
        return {
          currentDashboard: {
            sql: newData.sql || current.sql,
            charts: filteredCharts,
            table: newData.table || current.table,
            conversationActionHistory: history,
          },
        };
      }

      return { currentDashboard: s.currentDashboard };
    }),
  clearChat: () => set({ chatMessages: [], currentDashboard: null, insightSummary: null, querySuggestions: [] }),

  queryHistory: [],
  addQueryToHistory: (item) =>
    set((s) => ({ queryHistory: [item, ...s.queryHistory] })),
  clearHistory: () => set({ queryHistory: [] }),

  // V3 Features
  datasetIntelligence: null,
  setDatasetIntelligence: (intel) => set({ datasetIntelligence: intel }),
  
  insightSummary: null,
  setInsightSummary: (summary) => set({ insightSummary: summary }),
  
  querySuggestions: [],
  setQuerySuggestions: (suggestions) => set({ querySuggestions: suggestions }),

  isDark: true,
  toggleTheme: () =>
    set((s) => {
      const next = !s.isDark;
      document.documentElement.classList.toggle("dark", next);
      return { isDark: next };
    }),
}));
