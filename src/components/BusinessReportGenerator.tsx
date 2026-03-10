import { Download, FileText, Clock } from "lucide-react";
import { DashboardData } from "@/lib/store";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface BusinessReportGeneratorProps {
  dashboardData: DashboardData | null;
  datasetName: string;
}

export function BusinessReportGenerator({
  dashboardData,
  datasetName,
}: BusinessReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    if (!dashboardData) return;

    setIsGenerating(true);
    try {
      // Generate markdown report
      const reportData = {
        sql: dashboardData.sql,
        charts: dashboardData.charts,
        table: dashboardData.table,
        datasetName,
      };

      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const { markdown } = await response.json();

      // Create download link
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/markdown;charset=utf-8," + encodeURIComponent(markdown)
      );
      element.setAttribute(
        "download",
        `business-report-${Date.now()}.md`
      );
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Report generation error:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!dashboardData) {
    return null;
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={generateReport}
      disabled={isGenerating}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
    >
      {isGenerating ? (
        <>
          <Clock className="h-4 w-4 animate-spin" />
          Generating Report...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Generate Business Report
        </>
      )}
    </motion.button>
  );
}
