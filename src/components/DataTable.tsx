interface DataTableProps {
  data: Record<string, any>[];
  maxRows?: number;
}

export function DataTable({ data, maxRows = 20 }: DataTableProps) {
  const rows = data.slice(0, maxRows);
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  if (columns.length === 0) {
    return (
      <div className="glass-panel p-8 text-center text-muted-foreground text-sm">
        No data to display
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40">
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {col.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2.5 text-foreground/90 font-mono text-xs">
                    {typeof row[col] === "number"
                      ? row[col].toLocaleString()
                      : String(row[col] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > maxRows && (
        <div className="px-4 py-2.5 text-xs text-muted-foreground border-t border-border/30 bg-muted/10">
          Showing {maxRows} of {data.length} rows
        </div>
      )}
    </div>
  );
}
