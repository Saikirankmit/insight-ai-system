import { useState, useCallback } from "react";
import { Search, Sparkles, X } from "lucide-react";
import { EXAMPLE_QUERIES } from "@/lib/mockData";
import { motion } from "framer-motion";

interface PromptInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = useCallback(() => {
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
    }
  }, [query, isLoading, onSubmit]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="glass-panel glow-border p-1.5">
        <div className="flex items-center gap-3 px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Ask a question about your data..."
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
            disabled={isLoading}
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!query.trim() || isLoading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            <Sparkles className="h-4 w-4" />
            Generate
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground">Try:</span>
        {EXAMPLE_QUERIES.slice(0, 3).map((eq) => (
          <button
            key={eq}
            onClick={() => { setQuery(eq); onSubmit(eq); }}
            className="text-xs px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          >
            {eq}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
