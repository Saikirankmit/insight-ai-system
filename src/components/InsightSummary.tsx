import { InsightSummary } from "@/lib/store";
import { Sparkles, Lightbulb, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface InsightSummaryProps {
  summary: InsightSummary;
}

export function InsightSummaryPanel({ summary }: InsightSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-panel p-5 rounded-xl space-y-5 mb-5"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">AI Insight Summary</h3>
      </div>

      {/* Key Insights */}
      {summary.insights.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            <p className="text-xs font-semibold text-muted-foreground">KEY INSIGHTS</p>
          </div>
          <ul className="space-y-1.5">
            {summary.insights.map((insight, idx) => (
              <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-primary">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Findings */}
      {summary.keyFindings.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <p className="text-xs font-semibold text-muted-foreground">KEY FINDINGS</p>
          </div>
          <ul className="space-y-1.5">
            {summary.keyFindings.map((finding, idx) => (
              <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-emerald-500">•</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {summary.recommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <AlertCircle className="h-3.5 w-3.5 text-cyan-500" />
            <p className="text-xs font-semibold text-muted-foreground">RECOMMENDATIONS</p>
          </div>
          <ul className="space-y-1.5">
            {summary.recommendations.map((rec, idx) => (
              <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-cyan-500">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
