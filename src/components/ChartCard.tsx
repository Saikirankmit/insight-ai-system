import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";

const COLORS = [
  "hsl(199, 89%, 48%)",
  "hsl(262, 83%, 58%)",
  "hsl(152, 69%, 42%)",
  "hsl(38, 92%, 50%)",
  "hsl(340, 75%, 55%)",
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
        background: "hsl(225, 28%, 9%)",
        border: "1px solid hsl(225, 22%, 15%)",
        borderRadius: "12px",
        fontSize: "12px",
        color: "hsl(210, 20%, 92%)",
      },
    };

    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 22%, 15%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} axisLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend />
              {keys.map((key, i) => (
                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 22%, 15%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} axisLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend />
              {keys.map((key, i) => (
                <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[6, 6, 0, 0]} />
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
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 22%, 15%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} axisLine={false} />
              <Tooltip {...tooltipStyle} />
              {keys.map((key, i) => (
                <Area key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.1} strokeWidth={2} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className="glass-panel p-6"
    >
      <h4 className="text-sm font-semibold text-foreground mb-4">{title}</h4>
      {renderChart()}
    </motion.div>
  );
}
