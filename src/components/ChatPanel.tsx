import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Sparkles, Database, Trash2 } from "lucide-react";
import { useAppStore, type ChatMessage } from "@/lib/store";
import { EXAMPLE_QUERIES } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { PipelineProgress } from "@/components/PipelineProgress";
import { DatasetIntelligencePanel } from "@/components/DatasetIntelligence";
import { PIPELINE_STEPS, type PipelineStep } from "@/lib/mockData";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Detect dashboard action from user query and conversation context
function detectDashboardAction(
  query: string,
  chatMessages: ChatMessage[]
): "add" | "modify" | "filter" | "reset" {
  const queryLower = query.toLowerCase();

  // Reset patterns
  if (
    queryLower.includes("clear") ||
    queryLower.includes("start over") ||
    queryLower.includes("new analysis") ||
    queryLower.includes("fresh start")
  ) {
    return "reset";
  }

  // Filter patterns
  if (
    queryLower.includes("only") ||
    queryLower.includes("filter") ||
    queryLower.includes("show for") ||
    queryLower.includes("limit to") ||
    queryLower.includes("where") ||
    queryLower.includes("exclude")
  ) {
    return "filter";
  }

  // Modify/refine patterns
  if (
    queryLower.includes("it,") ||
    queryLower.includes("this") ||
    queryLower.includes("that") ||
    queryLower.includes("break") ||
    queryLower.includes("drill") ||
    queryLower.includes("deeper") ||
    queryLower.includes("more detail") ||
    queryLower.includes("expand") ||
    queryLower.includes("refine")
  ) {
    return "modify";
  }

  // Compare patterns (add a new comparison chart)
  if (
    queryLower.includes("compare") ||
    queryLower.includes("versus") ||
    queryLower.includes(" vs ") ||
    queryLower.includes("difference") ||
    queryLower.includes("alongside")
  ) {
    return "add";
  }

  // Default: add new chart if there are previous messages (conversation ongoing)
  return chatMessages.length > 0 ? "add" : "reset";
}

export function ChatPanel() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<PipelineStep[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    chatMessages,
    addChatMessage,
    setCurrentDashboard,
    mergeDashboard,
    clearChat,
    columns,
    dataset,
    datasetLoaded,
    datasetName,
    addQueryToHistory,
    datasetIntelligence,
    setDatasetIntelligence,
    setInsightSummary,
    setQuerySuggestions,
    querySuggestions,
  } = useAppStore();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chatMessages, steps]);

  // Analyze dataset when it's loaded
  useEffect(() => {
    const analyzeDataset = async () => {
      if (!datasetLoaded || datasetIntelligence) return;

      try {
        const response = await fetch("/api/analyze-dataset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            columns,
            data: dataset,
            datasetName,
          }),
        });

        if (response.ok) {
          const intelligence = await response.json();
          setDatasetIntelligence(intelligence);
        }
      } catch (error) {
        console.error("Dataset analysis error:", error);
      }
    };

    analyzeDataset();
  }, [datasetLoaded]);

  const sendMessage = useCallback(
    async (query: string) => {
      if (!query.trim() || isLoading) return;

      if (!datasetLoaded) {
        toast.error("Please upload a dataset first");
        return;
      }

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: query.trim(),
        timestamp: new Date(),
      };
      addChatMessage(userMsg);
      setInput("");
      setIsLoading(true);

      // Pipeline animation
      const newSteps = PIPELINE_STEPS.map((s) => ({ ...s, status: "pending" as const }));
      setSteps(newSteps);

      for (let i = 0; i < 2; i++) {
        await new Promise((r) => setTimeout(r, 350));
        setSteps((prev) =>
          prev.map((s, j) => ({ ...s, status: j < i ? "complete" : j === i ? "running" : "pending" }))
        );
        await new Promise((r) => setTimeout(r, 250));
        setSteps((prev) =>
          prev.map((s, j) => ({ ...s, status: j <= i ? "complete" : "pending" }))
        );
      }

      try {
        setSteps((prev) =>
          prev.map((s, j) => ({ ...s, status: j < 2 ? "complete" : j === 2 ? "running" : "pending" }))
        );

        // Build conversation history for context
        const conversationHistory = chatMessages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch("/api/analyze-query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query.trim(),
            columns,
            sampleData: dataset.slice(0, 10),
            conversationHistory,
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({ error: "Request failed" }));
          throw new Error(err.error || `Request failed with status ${response.status}`);
        }

        const result = await response.json();

        // Finish pipeline
        for (let i = 2; i < newSteps.length; i++) {
          setSteps((prev) =>
            prev.map((s, j) => ({
              ...s,
              status: j <= i ? "complete" : j === i + 1 ? "running" : s.status,
            }))
          );
          await new Promise((r) => setTimeout(r, 200));
        }
        setSteps((prev) => prev.map((s) => ({ ...s, status: "complete" as const })));

        // Detect dashboard action based on user query and conversation context
        const dashboardAction = detectDashboardAction(query, chatMessages);
        
        const dashboardData = { sql: result.sql, charts: result.charts, table: result.table };

        // Use mergeDashboard for smart evolution or setCurrentDashboard for fresh start
        if (dashboardAction === "reset" || !chatMessages.length) {
          setCurrentDashboard(dashboardData);
        } else {
          mergeDashboard(dashboardAction, dashboardData);
        }

        // Set insights and suggestions from V3 features
        if (result.insights || result.keyFindings || result.recommendations) {
          setInsightSummary({
            insights: result.insights || [],
            keyFindings: result.keyFindings || [],
            recommendations: result.recommendations || [],
          });
        }

        if (result.querySuggestions) {
          setQuerySuggestions(
            result.querySuggestions.map((s: { text: string; category: string }, idx: number) => ({
              id: idx.toString(),
              text: s.text,
              category: s.category,
            }))
          );
        }

        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.message || "Here are the results for your query.",
          timestamp: new Date(),
          dashboardData,
        };
        addChatMessage(aiMsg);

        addQueryToHistory({
          id: Date.now().toString(),
          query: query.trim(),
          timestamp: new Date().toLocaleString(),
          chartsGenerated: result.charts.length,
          sql: result.sql,
        });
      } catch (e) {
        console.error("Pipeline error:", e);
        toast.error(e instanceof Error ? e.message : "Failed to analyze query");
        setSteps((prev) =>
          prev.map((s) => (s.status === "running" ? { ...s, status: "error" as const } : s))
        );
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Sorry, I encountered an error: ${e instanceof Error ? e.message : "Unknown error"}. Please try again.`,
          timestamp: new Date(),
        };
        addChatMessage(errorMsg);
      } finally {
        setIsLoading(false);
        setTimeout(() => setSteps([]), 1500);
      }
    },
    [isLoading, datasetLoaded, chatMessages, columns, dataset, addChatMessage, setCurrentDashboard, addQueryToHistory, setInsightSummary, setQuerySuggestions]
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-card/60 to-background/20">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/20 shrink-0">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center"
          >
            <Sparkles className="h-4 w-4 text-primary" />
          </motion.div>
          <span className="font-bold text-sm text-foreground tracking-wide">AI Analytics</span>
        </div>
        {chatMessages.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearChat}
            className="text-muted-foreground hover:text-destructive transition-colors p-1.5 hover:bg-destructive/10 rounded-lg"
            title="Clear conversation"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Dataset Intelligence Panel */}
        {datasetIntelligence && chatMessages.length === 0 && !isLoading && (
          <DatasetIntelligencePanel 
            intelligence={datasetIntelligence}
            onSuggestedQuestion={sendMessage}
            isLoading={isLoading}
          />
        )}

        {chatMessages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            {datasetLoaded ? (
              <>
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Ask anything about your data</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                  I'll analyze your dataset and create interactive dashboards in real-time.
                </p>
                <div className="space-y-2 w-full max-w-xs">
                  {EXAMPLE_QUERIES.slice(0, 4).map((eq) => (
                    <button
                      key={eq}
                      onClick={() => sendMessage(eq)}
                      className="w-full text-left text-xs px-4 py-2.5 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      {eq}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <Database className="h-7 w-7 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No dataset loaded</h3>
                <p className="text-sm text-muted-foreground mb-4">Upload a CSV to start chatting with your data.</p>
                <button onClick={() => navigate("/app/datasets")} className="btn-gradient text-xs px-5 py-2">
                  Upload Dataset
                </button>
              </>
            )}
          </div>
        )}

        <AnimatePresence>
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm transition-all ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-primary/90 to-accent/80 text-primary-foreground rounded-br-sm shadow-lg"
                    : "glass-panel text-foreground rounded-bl-sm border border-border/30 hover:border-primary/30"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert prose-p:my-1 prose-headings:my-2 max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="font-medium">{msg.content}</p>
                )}
                <p className="text-[10px] mt-1.5 opacity-60 font-medium">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Pipeline progress inline */}
        <AnimatePresence>
          {steps.length > 0 && isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-[85%]"
            >
              <PipelineProgress steps={steps} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggestions when there's a conversation */}
      {chatMessages.length > 0 && !isLoading && querySuggestions.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
          {querySuggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => sendMessage(s.text)}
              className="text-[11px] px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              title={s.category}
            >
              {s.text}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border/20 shrink-0 bg-gradient-to-t from-card/60 to-transparent">
        <div className="flex items-center gap-2 glass-panel p-1.5 rounded-xl border border-border/40 hover:border-primary/30 transition-colors">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            placeholder={datasetLoaded ? "Ask anything about your data..." : "Upload a dataset first..."}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground/70 text-sm px-3 py-2.5 font-medium"
            disabled={isLoading || !datasetLoaded}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading || !datasetLoaded}
            className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 font-bold"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
