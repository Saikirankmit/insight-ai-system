import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";

const COLORS = [
  "hsl(197, 100%, 52%)",
  "hsl(279, 89%, 60%)",
  "hsl(156, 75%, 45%)",
  "hsl(42, 97%, 55%)",
  "hsl(347, 80%, 58%)",
];

interface ChartCardProps {
  type: "line" | "bar" | "pie" | "area";
  title: string;
  data: any[];
  keys: string[];
  index?: number;
}

export function ChartCard({ type, title, data, keys, index = 0 }: ChartCardProps) {
  const renderChart = () => {
    const commonProps = { data, margin: { top: 5, right: 20, left: 0, bottom: 5 } };
    const tooltipStyle = {
      contentStyle: {
        background: "hsl(222, 30%, 8%)",
        border: "1px solid hsl(222, 28%, 14%)",
        borderRadius: "12px",
        fontSize: "12px",
        color: "hsl(210, 18%, 94%)",
      },
    };

    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 28%, 14%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(215, 12%, 45%)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215, 12%, 45%)", fontSize: 11 }} axisLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend />
              {keys.map((key, i) => (
                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2.5} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 28%, 14%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(215, 12%, 45%)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215, 12%, 45%)", fontSize: 11 }} axisLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend />
              {keys.map((key, i) => (
                <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[8, 8, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 28%, 14%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(215, 12%, 45%)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215, 12%, 45%)", fontSize: 11 }} axisLine={false} />
              <Tooltip {...tooltipStyle} />
              {keys.map((key, i) => (
                <Area key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.12} strokeWidth={2.5} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="glass-panel p-6 border-border/20 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-xs text-muted-foreground mt-1">
            {type === "line" && "Trend Analysis"}
            {type === "bar" && "Comparison View"}
            {type === "pie" && "Distribution"}
            {type === "area" && "Cumulative Data"}
          </p>
        </div>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="h-2 w-2 rounded-full bg-primary/60"
        />
      </div>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="transition-transform duration-300"
      >
        {renderChart()}
      </motion.div>
    </motion.div>
  );
}
