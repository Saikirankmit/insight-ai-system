import { useState } from "react";
import { Copy, Eye, EyeOff, Check } from "lucide-react";
import { motion } from "framer-motion";

interface SQLViewerProps {
  sql: string;
}

export function SQLViewer({ sql }: SQLViewerProps) {
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40">
        <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Generated SQL</h3>
        <div className="flex gap-1">
          <button onClick={() => setVisible(!visible)} className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {visible && (
        <motion.pre
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="code-block m-3 overflow-x-auto text-foreground/90"
        >
          <code>{sql}</code>
        </motion.pre>
      )}
    </div>
  );
}
