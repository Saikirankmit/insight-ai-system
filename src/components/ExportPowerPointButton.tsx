import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Loader } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "@/components/ui/use-toast";

export function ExportPowerPointButton() {
  const [isLoading, setIsLoading] = useState(false);
  const currentDashboard = useAppStore((state) => state.currentDashboard);
  const datasetName = useAppStore((state) => state.datasetName);

  const handleExport = async () => {
    if (!currentDashboard || !currentDashboard.charts || currentDashboard.charts.length === 0) {
      toast({
        title: "No Charts",
        description: "Please create a dashboard with charts before exporting.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: "Generating...",
      description: "Creating your PowerPoint presentation",
    });

    try {
      const chartsData = currentDashboard.charts.map((chart: any) => ({
        title: chart.title || "Chart",
        insight: currentDashboard.insights?.[0] || "Data visualization",
        chart_type: chart.type || "bar",
        chart_config: chart.chartConfig || {},
        data: chart.data || [],
      }));

      const response = await fetch("/api/export/pptx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          charts: chartsData,
          datasetName: datasetName || "Dataset Report",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PowerPoint");
      }

      // Get filename from response headers or use default
      const contentDisposition = response.headers.get("content-disposition");
      let filename = "InsightAI-Report.pptx";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      // Trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Downloaded!",
        description: `Your PowerPoint report has been downloaded as ${filename}`,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export PowerPoint",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleExport}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-black font-medium rounded-lg transition-all"
    >
      {isLoading ? (
        <>
          <Loader className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Export PPTX
        </>
      )}
    </motion.button>
  );
}
