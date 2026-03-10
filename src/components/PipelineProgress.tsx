import { motion } from "framer-motion";
import { Check, Loader2, Circle, AlertCircle } from "lucide-react";
import type { PipelineStep } from "@/lib/mockData";

interface PipelineProgressProps {
  steps: PipelineStep[];
}

export function PipelineProgress({ steps }: PipelineProgressProps) {
  return (
    <div className="glass-panel p-6">
      <h3 className="text-sm font-semibold text-foreground mb-5 tracking-wide uppercase">Processing Pipeline</h3>
      <div className="space-y-1">
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 py-2.5"
          >
            <div className="shrink-0">
              {step.status === "complete" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-7 w-7 rounded-full bg-success/15 flex items-center justify-center"
                >
                  <Check className="h-3.5 w-3.5 text-success" />
                </motion.div>
              )}
              {step.status === "running" && (
                <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center">
                  <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                </div>
              )}
              {step.status === "pending" && (
                <div className="h-7 w-7 rounded-full bg-muted/50 flex items-center justify-center">
                  <Circle className="h-3 w-3 text-muted-foreground/50" />
                </div>
              )}
              {step.status === "error" && (
                <div className="h-7 w-7 rounded-full bg-destructive/15 flex items-center justify-center">
                  <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-medium ${
                step.status === "complete" ? "text-success" :
                step.status === "running" ? "text-primary" :
                step.status === "error" ? "text-destructive" :
                "text-muted-foreground/60"
              }`}>
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground truncate">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
