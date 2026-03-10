import { useAppStore } from "@/lib/store";
import { History, Play, BarChart3, Trash2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function QueryHistoryPage() {
  const { queryHistory, clearHistory } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Query History</h1>
          <p className="text-sm text-muted-foreground mt-1">Review and re-run your previous queries</p>
        </div>
        {queryHistory.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear History
          </button>
        )}
      </div>

      {queryHistory.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-16 text-center"
        >
          <Clock className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No queries yet</p>
          <p className="text-sm text-muted-foreground mb-6">Generate a dashboard to see your query history here</p>
          <button
            onClick={() => navigate("/app")}
            className="btn-gradient text-sm px-6 py-2.5"
          >
            Go to Dashboard
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {queryHistory.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel-hover p-5 flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{item.query}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {item.timestamp}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BarChart3 className="h-3 w-3" />
                    {item.chartsGenerated} charts
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate("/app")}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-all duration-200"
              >
                <Play className="h-3 w-3" />
                Run Again
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
