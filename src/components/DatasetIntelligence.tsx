import { DatasetIntelligence } from "@/lib/store";
import { BarChart3, Sparkles, TrendingUp, Tag } from "lucide-react";
import { motion } from "framer-motion";

interface DatasetIntelligenceProps {
  intelligence: DatasetIntelligence;
  onSuggestedQuestion: (question: string) => void;
  isLoading?: boolean;
}

export function DatasetIntelligencePanel({
  intelligence,
  onSuggestedQuestion,
  isLoading,
}: DatasetIntelligenceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-panel p-5 rounded-xl space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Dataset Summary</h3>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-panel/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">Rows</p>
          <p className="text-lg font-bold text-foreground">{intelligence.rowCount.toLocaleString()}</p>
        </div>
        <div className="glass-panel/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">Columns</p>
          <p className="text-lg font-bold text-foreground">{intelligence.columnCount}</p>
        </div>
      </div>

      {/* Numeric Metrics */}
      {intelligence.numericMetrics.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="h-3 w-3 text-primary" />
            <p className="text-xs font-semibold text-muted-foreground uppercase">Detected Metrics</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {intelligence.numericMetrics.map((metric) => (
              <span key={metric} className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {metric}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Categorical Fields */}
      {intelligence.categoricalFields.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Tag className="h-3 w-3 text-blue-500" />
            <p className="text-xs font-semibold text-muted-foreground uppercase">Detected Dimensions</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {intelligence.categoricalFields.map((field) => (
              <span key={field} className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                {field}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Questions */}
      {intelligence.suggestedQuestions.length > 0 && (
        <div>
          <label className="flex items-center gap-1.5 mb-2">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <p className="text-xs font-semibold text-muted-foreground uppercase">Suggested Questions</p>
          </label>
          <div className="space-y-1.5">
            {intelligence.suggestedQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestedQuestion(question)}
                disabled={isLoading}
                className="w-full text-left text-xs px-3 py-2 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                • {question}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
