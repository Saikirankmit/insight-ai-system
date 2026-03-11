import { useAppStore } from "@/lib/store";
import { ChartCard } from "@/components/ChartCard";
import { DataTable } from "@/components/DataTable";
import { SQLViewer } from "@/components/SQLViewer";
import { InsightSummaryPanel } from "@/components/InsightSummary";
import { QuerySuggestionsPanel } from "@/components/QuerySuggestions";
import { BusinessReportGenerator } from "@/components/BusinessReportGenerator";
import { ExportPowerPointButton } from "@/components/ExportPowerPointButton";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Sparkles } from "lucide-react";


export function DashboardPanel() {
  const { currentDashboard, datasetLoaded, datasetName, insightSummary, querySuggestions } = useAppStore();

  return (
    <div className="h-full overflow-y-auto p-6 bg-gradient-to-b from-background/50 to-card/20">
      {!currentDashboard ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="relative mb-6">
            <motion.div
              animate={{ 
                y: [0, -20, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="floating-orb w-[200px] h-[200px] bg-primary absolute -top-20 -right-10"
            />
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative z-10 border border-primary/30"
            >
              <BarChart3 className="h-8 w-8 text-primary" />
            </motion.div>
          </div>
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-3 relative z-10">Your Dashboard</h3>
          <p className="text-sm text-muted-foreground max-w-sm relative z-10 leading-relaxed">
            {datasetLoaded
              ? `Dataset "${datasetName}" loaded. Ask a question in the chat to generate visualizations.`
              : "Upload a dataset and start a conversation to see interactive charts here."}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={JSON.stringify(currentDashboard.sql).slice(0, 50)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3 justify-between sticky top-0 z-10 bg-gradient-to-b from-card/80 to-transparent backdrop-blur-sm py-2">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                </motion.div>
                <h2 className="text-lg font-bold text-foreground">Analytics Dashboard</h2>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                {currentDashboard.charts.length} chart{currentDashboard.charts.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* AI Insight Summary */}
            {insightSummary && <InsightSummaryPanel summary={insightSummary} />}

            {/* SQL */}
            <SQLViewer sql={currentDashboard.sql} />

            {/* Charts */}
            {currentDashboard.charts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className={`grid gap-4 ${currentDashboard.charts.length === 1 ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-2"}`}
              >
                {currentDashboard.charts.map((chart, i) => (
                  <motion.div
                    key={`${chart.title}-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                  >
                    <ChartCard
                      type={chart.type}
                      title={chart.title}
                      data={chart.data}
                      keys={chart.keys}
                      index={i}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Data Table */}
            {currentDashboard.table.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-widest opacity-70">Raw Data</h3>
                <DataTable data={currentDashboard.table} />
              </motion.div>
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

            {/* Export PowerPoint */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="flex gap-2 pt-2"
            >
              <ExportPowerPointButton />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
