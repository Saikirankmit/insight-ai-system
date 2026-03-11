import { useAppStore } from "@/lib/store";
import { Database, Upload, User, Bell, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function Navbar() {
  const { datasetLoaded, datasetName } = useAppStore();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-border/30 bg-card/40 backdrop-blur-2xl flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        {datasetLoaded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-success/12 border border-success/30 text-success/95 text-xs font-semibold tracking-wide"
          >
            <Database className="h-3.5 w-3.5" />
            <span className="truncate max-w-sm">{datasetName}</span>
          </motion.div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          onClick={() => navigate("/app/datasets")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/40 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/10 transition-all duration-300"
        >
          <Upload className="h-4 w-4" />
          Upload
        </motion.button>
        <motion.button
          whileHover={{ y: -2 }}
          className="h-10 w-10 rounded-xl border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 relative group"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-success/80 group-hover:bg-success animate-pulse"></span>
        </motion.button>
        <motion.div
          whileHover={{ y: -2 }}
          className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center cursor-pointer border border-primary/30 hover:border-primary/50 transition-all duration-300"
        >
          <User className="h-4 w-4 text-primary" />
        </motion.div>
      </div>
    </header>
  );
}
