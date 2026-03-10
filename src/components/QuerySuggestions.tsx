import { QuerySuggestion } from "@/lib/store";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface QuerySuggestionsProps {
  suggestions: QuerySuggestion[];
  onSuggestionClick?: (suggestion: string) => void;
  isLoading?: boolean;
}

export function QuerySuggestionsPanel({
  suggestions,
  onSuggestionClick,
  isLoading,
}: QuerySuggestionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-panel p-5 rounded-xl"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Suggested Analysis</h3>
      </div>

      <div className="space-y-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSuggestionClick?.(suggestion.text)}
            disabled={isLoading || !onSuggestionClick}
            className="w-full text-left text-xs px-4 py-2.5 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-start gap-2">
              <span className="text-primary font-semibold text-[10px] uppercase mt-0.5">
                {suggestion.category}
              </span>
              <span className="flex-1">{suggestion.text}</span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
