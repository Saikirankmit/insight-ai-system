import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Search, TrendingUp, Hash, Type } from "lucide-react";
import { useNavigate } from "react-router-dom";

const COLORS = ["hsl(199, 89%, 48%)", "hsl(262, 83%, 58%)", "hsl(152, 69%, 42%)", "hsl(38, 92%, 50%)", "hsl(340, 75%, 55%)"];

export default function DataExplorerPage() {
  const { dataset, columns, datasetLoaded } = useAppStore();
  const navigate = useNavigate();

  if (!datasetLoaded) {
    return (
      <div className="max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Data Explorer</h1>
          <p className="text-sm text-muted-foreground mt-1">Explore your dataset structure and statistics</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-16 text-center mt-6"
        >
          <Search className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No dataset loaded</p>
          <p className="text-sm text-muted-foreground mb-6">Upload a CSV file to start exploring your data</p>
          <button
            onClick={() => navigate("/app/datasets")}
            className="btn-gradient text-sm px-6 py-2.5"
          >
            Upload Dataset
          </button>
        </motion.div>
      </div>
    );
  }

  const numericCols = columns.filter(c => c.type === "DECIMAL" || c.type === "INTEGER" || c.type === "NUMBER");
  const stringCols = columns.filter(c => c.type !== "DECIMAL" && c.type !== "INTEGER" && c.type !== "NUMBER" && c.type !== "DATE");

  // Build charts dynamically from actual data
  const charts: { title: string; data: any[]; type: "bar" | "pie" }[] = [];

  // For the first string column, create a bar chart of first numeric column
  if (stringCols.length > 0 && numericCols.length > 0) {
    const groupCol = stringCols[0].name;
    const valCol = numericCols[0].name;
    const grouped = dataset.reduce((acc, r) => {
      const key = String(r[groupCol] ?? "Unknown");
      acc[key] = (acc[key] || 0) + (Number(r[valCol]) || 0);
      return acc;
    }, {} as Record<string, number>);
    const barData = Object.entries(grouped).slice(0, 8).map(([name, value]) => ({ name, value }));
    charts.push({ title: `${valCol} by ${groupCol}`, data: barData, type: "bar" });
  }

  // Pie chart for second string column or same
  if (stringCols.length > 0) {
    const groupCol = stringCols[stringCols.length > 1 ? 1 : 0].name;
    const grouped = dataset.reduce((acc, r) => {
      const key = String(r[groupCol] ?? "Unknown");
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const pieData = Object.entries(grouped).slice(0, 6).map(([name, value]) => ({ name, value }));
    charts.push({ title: `Distribution by ${groupCol}`, data: pieData, type: "pie" });
  }

  const tooltipStyle = {
    contentStyle: { background: "hsl(225, 28%, 9%)", border: "1px solid hsl(225, 22%, 15%)", borderRadius: "12px", fontSize: "12px", color: "hsl(210, 20%, 92%)" },
  };

  const totalRows = dataset.length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Data Explorer</h1>
        <p className="text-sm text-muted-foreground mt-1">Explore your dataset structure and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Rows", value: totalRows.toLocaleString(), icon: Hash, color: "primary" },
          { label: "Columns", value: columns.length.toString(), icon: Type, color: "accent" },
          { label: "Numeric Fields", value: numericCols.length.toString(), icon: TrendingUp, color: "success" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {charts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {charts.map((chart, ci) => (
            <motion.div key={ci} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + ci * 0.1 }} className="glass-panel p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">{chart.title}</h3>
              <ResponsiveContainer width="100%" height={260}>
                {chart.type === "bar" ? (
                  <BarChart data={chart.data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 22%, 15%)" />
                    <XAxis dataKey="name" tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 10 }} axisLine={false} />
                    <YAxis tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 10 }} axisLine={false} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="value" fill={COLORS[0]} radius={[6, 6, 0, 0]} />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie data={chart.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                      {chart.data.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                    </Pie>
                    <Tooltip {...tooltipStyle} />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </motion.div>
          ))}
        </div>
      )}

      <div className="glass-panel p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Column Schema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {columns.map((col) => {
            const values = dataset.map((r) => r[col.name]);
            const isNumeric = col.type === "DECIMAL" || col.type === "INTEGER" || col.type === "NUMBER";
            const numValues = isNumeric ? values.filter(v => typeof v === "number") as number[] : [];
            return (
              <motion.div
                key={col.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-3 rounded-xl bg-muted/20 border border-border/30 hover:border-primary/20 transition-colors"
              >
                <p className="text-sm font-medium text-foreground">{col.name}</p>
                <p className="text-xs text-primary font-mono mb-1">{col.type}</p>
                {isNumeric && numValues.length > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Min: {Math.min(...numValues).toLocaleString()} · Max: {Math.max(...numValues).toLocaleString()}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">{new Set(values).size} unique values</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
