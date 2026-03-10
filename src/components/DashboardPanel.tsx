import { useAppStore } from "@/lib/store";
import { ChartCard } from "@/components/ChartCard";
import { DataTable } from "@/components/DataTable";
import { SQLViewer } from "@/components/SQLViewer";
import { InsightSummaryPanel } from "@/components/InsightSummary";
import { QuerySuggestionsPanel } from "@/components/QuerySuggestions";
import { BusinessReportGenerator } from "@/components/BusinessReportGenerator";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Sparkles } from "lucide-react";


export function DashboardPanel() {
  const { currentDashboard, datasetLoaded, datasetName, insightSummary, querySuggestions } = useAppStore();

  return (
    <div className="h-full overflow-y-auto p-6">
      {!currentDashboard ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="relative">
            <div className="floating-orb w-[180px] h-[180px] bg-primary absolute -top-10 -right-10" />
            <div className="h-16 w-16 rounded-2xl bg-muted/40 flex items-center justify-center mb-5 relative z-10">
              <BarChart3 className="h-8 w-8 text-muted-foreground/40" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2 relative z-10">Dashboard Area</h3>
          <p className="text-sm text-muted-foreground max-w-sm relative z-10">
            {datasetLoaded
              ? `Dataset "${datasetName}" loaded. Ask a question in the chat to generate visualizations.`
              : "Upload a dataset and start a conversation to see interactive charts here."}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={JSON.stringify(currentDashboard.sql).slice(0, 50)}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {/* Header */}
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-base font-semibold text-foreground">Live Dashboard</h2>
              </div>
              <span className="text-xs text-muted-foreground">
                {currentDashboard.charts.length} chart{currentDashboard.charts.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* AI Insight Summary */}
            {insightSummary && <InsightSummaryPanel summary={insightSummary} />}

            {/* SQL */}
            <SQLViewer sql={currentDashboard.sql} />

            {/* Charts */}
            {currentDashboard.charts.length > 0 && (
              <div className={`grid gap-4 ${currentDashboard.charts.length === 1 ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-2"}`}>
                {currentDashboard.charts.map((chart, i) => (
                  <ChartCard
                    key={`${chart.title}-${i}`}
                    type={chart.type}
                    title={chart.title}
                    data={chart.data}
                    keys={chart.keys}
                    index={i}
                  />
                ))}
              </div>
            )}

            {/* Data Table */}
            {currentDashboard.table.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Raw Data</h3>
                <DataTable data={currentDashboard.table} />
              </div>
            )}

            {/* Query Suggestions */}
            {querySuggestions.length > 0 && (
              <QuerySuggestionsPanel 
                suggestions={querySuggestions} 
                onSuggestionClick={() => {}} 
              />
            )}

            {/* Business Report Generator */}
            <BusinessReportGenerator 
              dashboardData={currentDashboard}
              datasetName={datasetName}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
