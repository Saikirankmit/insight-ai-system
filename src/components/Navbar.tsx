import { useAppStore } from "@/lib/store";
import { Database, Upload, User, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function Navbar() {
  const { datasetLoaded, datasetName } = useAppStore();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-border/40 bg-card/30 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        {datasetLoaded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-success/10 border border-success/20 text-success text-xs font-medium"
          >
            <Database className="h-3.5 w-3.5" />
            {datasetName}
          </motion.div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/app/datasets")}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/40 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-200"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload CSV
        </button>
        <button className="h-9 w-9 rounded-xl border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-200 relative">
          <Bell className="h-4 w-4" />
        </button>
        <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center cursor-pointer hover:bg-primary/25 transition-colors">
          <User className="h-4 w-4 text-primary" />
        </div>
      </div>
    </header>
  );
}
