import { useAppStore } from "@/lib/store";
import { Moon, Sun, Database, Info, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { isDark, toggleTheme, datasetName, datasetLoaded } = useAppStore();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your InsightAI experience</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 space-y-5">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Appearance</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-warning" />}
            <div>
              <p className="text-sm font-medium text-foreground">{isDark ? "Dark Mode" : "Light Mode"}</p>
              <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-12 h-7 rounded-full transition-colors relative ${isDark ? "bg-primary" : "bg-muted"}`}
          >
            <div className={`absolute top-1 h-5 w-5 rounded-full bg-primary-foreground transition-transform duration-300 ${isDark ? "left-[24px]" : "left-1"}`} />
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 space-y-5">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Data Source</h3>
        <div className="flex items-center gap-3">
          <Database className={`h-5 w-5 ${datasetLoaded ? "text-success" : "text-muted-foreground"}`} />
          <div>
            <p className="text-sm font-medium text-foreground">{datasetLoaded ? datasetName : "No dataset loaded"}</p>
            <p className="text-xs text-muted-foreground">{datasetLoaded ? "Active dataset" : "Upload a CSV to get started"}</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel p-6 space-y-5">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">AI Engine</h3>
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Google Gemini</p>
            <p className="text-xs text-muted-foreground">Powering natural language to SQL conversion</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 space-y-5">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">About</h3>
        <div className="flex items-center gap-3">
          <Info className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">InsightAI v1.0</p>
            <p className="text-xs text-muted-foreground">AI-Powered Conversational BI Dashboard Generator</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
