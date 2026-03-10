import { DatasetUploader } from "@/components/DatasetUploader";
import { DataTable } from "@/components/DataTable";
import { useAppStore } from "@/lib/store";
import { Database, Rows3, Columns3, Trash2, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { ColumnDef } from "@/lib/store";
import Papa from "papaparse";

export default function DatasetManagerPage() {
  const { datasetLoaded, datasetName, dataset, columns, loadDataset, clearDataset } = useAppStore();

  const handleUpload = (file: File) => {
    // First read as text to check for binary plist wrapper
    const reader = new FileReader();
    reader.onload = (e) => {
      let text = e.target?.result as string;
      if (!text) {
        toast.error("Could not read the file");
        return;
      }

      console.log("File first 100 chars:", JSON.stringify(text.slice(0, 100)));
      console.log("File size:", text.length, "chars");

      // Detect macOS binary plist wrapper and extract CSV content
      if (text.startsWith("bplist")) {
        console.log("Detected binary plist wrapper, extracting CSV content...");
        // Find the CSV content inside the plist - look for common CSV patterns
        const csvStart = text.indexOf("Campaign_ID") !== -1
          ? text.indexOf("Campaign_ID")
          : text.search(/[A-Za-z_]+[,\t][A-Za-z_]+/);
        
        if (csvStart > 0) {
          text = text.slice(csvStart);
          console.log("Extracted CSV starting at index:", csvStart);
        } else {
          toast.error("This file appears to be in binary format. Please re-export it as a plain CSV file.");
          return;
        }
      }

      // Remove BOM if present
      if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
      }

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          console.log("Papa parse results:", {
            rows: results.data.length,
            fields: results.meta.fields,
            errors: results.errors.slice(0, 3),
          });

          if (!results.data || results.data.length === 0) {
            toast.error("CSV file is empty or could not be parsed");
            return;
          }

          const rows = results.data as Record<string, any>[];
          const headers = results.meta.fields || Object.keys(rows[0]);

          if (headers.length <= 1) {
            // Try with different delimiters
            console.log("Only 1 column detected, trying tab delimiter...");
            Papa.parse(text, {
              header: true,
              skipEmptyLines: true,
              dynamicTyping: true,
              delimiter: "\t",
              complete: (retryResults) => {
                const retryHeaders = retryResults.meta.fields || [];
                console.log("Tab-delimited retry fields:", retryHeaders);
                if (retryHeaders.length > 1) {
                  finishParsing(file.name, retryResults.data as Record<string, any>[], retryHeaders);
                } else {
                  // Still 1 column - use original results
                  finishParsing(file.name, rows, headers);
                }
              },
            });
            return;
          }

          finishParsing(file.name, rows, headers);
        },
        error: (error) => {
          console.error("Papa parse error:", error);
          toast.error(`Failed to parse CSV: ${error.message}`);
        },
      });
    };
    reader.readAsText(file);
  };

  const finishParsing = (fileName: string, rows: Record<string, any>[], headers: string[]) => {
    const cols: ColumnDef[] = headers.map((name) => {
      const sampleValues = rows.slice(0, 50).map((r) => r[name]);
      const nonNull = sampleValues.filter((v) => v != null && v !== "");
      const allNumbers = nonNull.length > 0 && nonNull.every((v) => typeof v === "number");
      const hasDate = name.toLowerCase().includes("date") || name.toLowerCase().includes("time");
      return {
        name,
        type: hasDate ? "DATE" : allNumbers ? "NUMBER" : "VARCHAR",
      };
    });

    loadDataset(fileName, rows, cols);
    toast.success(`Loaded ${rows.length.toLocaleString()} rows × ${headers.length} columns from ${fileName}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dataset Manager</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload and manage your data sources</p>
      </div>

      <DatasetUploader onUpload={handleUpload} />

      {datasetLoaded && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat-card flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dataset</p>
                <p className="text-foreground font-semibold text-sm truncate max-w-[150px]">{datasetName}</p>
              </div>
            </div>
            <div className="stat-card flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center">
                <Rows3 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rows</p>
                <p className="text-foreground font-semibold">{dataset.length.toLocaleString()}</p>
              </div>
            </div>
            <div className="stat-card flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-success/10 flex items-center justify-center">
                <Columns3 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Columns</p>
                <p className="text-foreground font-semibold">{columns.length}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Schema</h3>
              <button
                onClick={() => {
                  clearDataset();
                  toast.info("Dataset cleared");
                }}
                className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove Dataset
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {columns.map((col) => (
                <div key={col.name} className="px-3 py-2.5 rounded-xl bg-muted/20 border border-border/30">
                  <p className="text-sm font-medium text-foreground">{col.name}</p>
                  <p className="text-xs text-primary font-mono">{col.type}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Preview</h3>
            <DataTable data={dataset} maxRows={10} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
