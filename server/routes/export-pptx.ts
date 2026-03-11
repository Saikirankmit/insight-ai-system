import type { Request, Response } from "express";

let PptxGenJS: any;

// Dynamic import for ESM compatibility
async function getPptxGenJS() {
  if (!PptxGenJS) {
    const module = await import("pptxgenjs");
    PptxGenJS = module.default || module;
  }
  return PptxGenJS;
}

interface ChartData {
  title: string;
  insight?: string;
  chart_type: string;
  chart_config?: Record<string, unknown>;
  data: Record<string, unknown>[];
}

const THEME = {
  background: "#080B14",
  card: "#0F1525",
  accent: "#FC2779",
  accentLight: "#FF6B9D",
  accentLighter: "#FFB0D1",
  text: "#FFFFFF",
  textSecondary: "#A0AEC0",
};

export default async function exportPptxHandler(req: Request, res: Response) {
  try {
    const { charts, datasetName } = req.body;

    if (!Array.isArray(charts) || charts.length === 0) {
      res.status(400).json({ error: "No charts provided" });
      return;
    }

    const PptxGenJSClass = await getPptxGenJS();

    // Create presentation with widescreen 16:9 aspect
    const prs = new PptxGenJSClass({
      defineLayout: [{ name: "LAYOUT1", width: 10, height: 5.625 }],
    });

    // Slide 1: Title Slide (Cover)
    const titleSlide = prs.addSlide();
    titleSlide.background = { color: THEME.background };

    // Decorative top bar
    titleSlide.addShape("rect", {
      x: 0,
      y: 0,
      w: 10,
      h: 0.15,
      fill: { color: THEME.accent },
    });

    titleSlide.addText("InsightAI Report", {
      x: 0.5,
      y: 1.8,
      w: 9,
      h: 1,
      fontSize: 60,
      bold: true,
      color: THEME.text,
      align: "center",
      fontFace: "Arial",
    });

    titleSlide.addText(`${datasetName || "Dataset"} Analysis`, {
      x: 0.5,
      y: 3,
      w: 9,
      h: 0.7,
      fontSize: 36,
      color: THEME.accent,
      align: "center",
      fontFace: "Arial",
    });

    // Summary info
    const summaryText = `Total Visualizations: ${charts.length} | Generated: ${new Date().toLocaleDateString()}`;
    titleSlide.addText(summaryText, {
      x: 0.5,
      y: 4.2,
      w: 9,
      h: 0.5,
      fontSize: 14,
      color: THEME.textSecondary,
      align: "center",
      fontFace: "Arial",
    });

    // Chart Slides
    for (let i = 0; i < charts.length; i++) {
      const chart = charts[i] as ChartData;
      const slide = prs.addSlide();
      slide.background = { color: THEME.background };

      // Header section with background
      slide.addShape("rect", {
        x: 0,
        y: 0,
        w: 10,
        h: 0.8,
        fill: { color: THEME.card },
        line: { type: "none" },
      });

      // Slide number indicator
      slide.addText(`${i + 1}`, {
        x: 9.5,
        y: 0.25,
        w: 0.4,
        h: 0.35,
        fontSize: 24,
        bold: true,
        color: THEME.accent,
        align: "right",
        fontFace: "Arial",
      });

      // Chart title
      slide.addText(chart.title, {
        x: 0.5,
        y: 0.15,
        w: 8.5,
        h: 0.5,
        fontSize: 28,
        bold: true,
        color: THEME.accent,
        fontFace: "Arial",
      });

      // Meta information
      const metaText = `${chart.chart_type.charAt(0).toUpperCase() + chart.chart_type.slice(1)} Chart | ${chart.data.length} Data Points`;
      slide.addText(metaText, {
        x: 0.5,
        y: 0.5,
        w: 8,
        h: 0.25,
        fontSize: 11,
        color: THEME.textSecondary,
        fontFace: "Arial",
      });

      // Insight section (if available)
      if (chart.insight) {
        slide.addShape("rect", {
          x: 0.5,
          y: 1,
          w: 9,
          h: 0.6,
          fill: { color: THEME.accent },
          line: { type: "none" },
        });

        slide.addText(chart.insight, {
          x: 0.7,
          y: 1.1,
          w: 8.6,
          h: 0.4,
          fontSize: 13,
          bold: true,
          color: "#000000",
          align: "left",
          valign: "middle",
          fontFace: "Arial",
        });
      }

      // Content area
      const contentY = chart.insight ? 1.8 : 1.1;
      const contentHeight = 5.625 - contentY - 0.3;

      // Generate visualization based on chart type
      if (chart.data && chart.data.length > 0) {
        const chartType = (chart.chart_type || "bar").toLowerCase();
        if (chartType === "bar" || chartType === "column") {
          addBarChartVisualization(slide, prs, chart, 0.5, contentY, 9, contentHeight);
        } else if (chartType === "line") {
          addLineChartVisualization(slide, prs, chart, 0.5, contentY, 9, contentHeight);
        } else if (chartType === "pie") {
          addPieChartVisualization(slide, prs, chart, 0.5, contentY, 9, contentHeight);
        } else {
          addTableVisualization(slide, prs, chart, 0.5, contentY, 9, contentHeight);
        }
      }
    }

    // Final Slide
    const finalSlide = prs.addSlide();
    finalSlide.background = { color: THEME.background };

    // Decorative footer bar
    finalSlide.addShape("rect", {
      x: 0,
      y: 5.475,
      w: 10,
      h: 0.15,
      fill: { color: THEME.accent },
    });

    finalSlide.addText("End of Report", {
      x: 0.5,
      y: 2,
      w: 9,
      h: 1,
      fontSize: 54,
      bold: true,
      color: THEME.accent,
      align: "center",
      fontFace: "Arial",
    });

    finalSlide.addText(new Date().toLocaleDateString(), {
      x: 0.5,
      y: 3.5,
      w: 9,
      h: 0.4,
      fontSize: 16,
      color: THEME.textSecondary,
      align: "center",
      fontFace: "Arial",
    });

    finalSlide.addText("Generated by InsightAI V3", {
      x: 0.5,
      y: 4.2,
      w: 9,
      h: 0.3,
      fontSize: 12,
      color: THEME.textSecondary,
      align: "center",
      italic: true,
      fontFace: "Arial",
    });

    // Generate and send file
    const buffer = await prs.write({ outputType: "arraybuffer" });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="InsightAI-Report-${Date.now()}.pptx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );
    res.send(Buffer.from(buffer as ArrayBuffer));
  } catch (e) {
    console.error("export-pptx error:", e);
    res.status(500).json({ error: e instanceof Error ? e.message : "Unknown error" });
  }
}

function addBarChartVisualization(
  slide: any,
  prs: any,
  chart: ChartData,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const data = chart.data.slice(0, 10);
  if (data.length === 0) return;

  const barHeight = Math.min(0.4, (h - 0.5) / data.length);
  const labelWidth = 2;
  const chartWidth = w - labelWidth - 0.3;

  // Find max value for scaling
  const values = data.map((d: any) => {
    const keys = Object.keys(d).filter((k) => k !== "name");
    return Number(d[keys[0]] || 0);
  });
  const maxValue = Math.max(...values);
  const scale = (maxValue > 0 ? chartWidth / maxValue : 1);

  // Draw bars
  data.forEach((row: any, index: number) => {
    const barY = y + index * barHeight;
    const keys = Object.keys(row).filter((k) => k !== "name");
    const value = Number(row[keys[0]] || 0);
    const barWidth = value * scale;

    // Bar label
    slide.addText(String(row.name || "").substring(0, 15), {
      x,
      y: barY,
      w: labelWidth,
      h: barHeight,
      fontSize: 9,
      color: THEME.text,
      align: "right",
      valign: "middle",
      fontFace: "Arial",
    });

    // Bar background
    slide.addShape("rect", {
      x: x + labelWidth + 0.1,
      y: barY + barHeight / 4,
      w: chartWidth,
      h: barHeight / 2,
      fill: { color: THEME.card },
      line: { type: "none" },
    });

    // Value bar
    slide.addShape("rect", {
      x: x + labelWidth + 0.1,
      y: barY + barHeight / 4,
      w: barWidth,
      h: barHeight / 2,
      fill: { color: THEME.accent },
      line: { type: "none" },
    });

    // Value label
    slide.addText(String(value.toFixed(0)), {
      x: x + labelWidth + 0.15 + barWidth,
      y: barY,
      w: 0.5,
      h: barHeight,
      fontSize: 8,
      color: THEME.textSecondary,
      align: "left",
      valign: "middle",
      fontFace: "Arial",
    });
  });
}

function addLineChartVisualization(
  slide: any,
  prs: any,
  chart: ChartData,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const data = chart.data.slice(0, 20);
  if (data.length < 2) {
    addTableVisualization(slide, prs, chart, x, y, w, h);
    return;
  }

  // Extract values
  const values = data.map((d: any) => {
    const keys = Object.keys(d).filter((k) => k !== "name");
    return Number(d[keys[0]] || 0);
  });

  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;

  const pointWidth = w / (data.length - 1);
  const pointHeight = h * 0.8;

  // Draw grid and points
  data.forEach((row: any, index: number) => {
    const value = values[index];
    const normalizedY = ((value - minValue) / range) * pointHeight;
    const pointX = x + index * pointWidth;
    const pointYPos = y + h - normalizedY - 0.2;

    // Draw vertical grid line
    if (index % Math.max(1, Math.floor(data.length / 5)) === 0) {
      slide.addShape("line", {
        x: pointX,
        y: y + 0.2,
        w: 0,
        h: h - 0.4,
        line: { color: THEME.card, width: 1 },
      });
    }

    // Draw point
    slide.addShape("ellipse", {
      x: pointX - 0.1,
      y: pointYPos - 0.1,
      w: 0.2,
      h: 0.2,
      fill: { color: THEME.accent },
      line: { type: "none" },
    });

    // Connect to next point
    if (index < data.length - 1) {
      const nextValue = values[index + 1];
      const nextNormalizedY = ((nextValue - minValue) / range) * pointHeight;
      const nextPointX = x + (index + 1) * pointWidth;
      const nextPointYPos = y + h - nextNormalizedY - 0.2;

      slide.addShape("line", {
        x: pointX,
        y: pointYPos,
        w: nextPointX - pointX,
        h: nextPointYPos - pointYPos,
        line: { color: THEME.accentLight, width: 2 },
      });
    }
  });

  // Add legend
  slide.addText(`Min: ${minValue.toFixed(0)} | Max: ${maxValue.toFixed(0)}`, {
    x,
    y: y + h + 0.1,
    w,
    h: 0.25,
    fontSize: 9,
    color: THEME.textSecondary,
    align: "center",
    fontFace: "Arial",
  });
}

function addPieChartVisualization(
  slide: any,
  prs: any,
  chart: ChartData,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const data = chart.data.slice(0, 5);
  if (data.length === 0) return;

  // For pie chart, create a legend-style display since drawing actual pie is complex
  const values = data.map((d: any) => {
    const keys = Object.keys(d).filter((k) => k !== "name");
    return Number(d[keys[0]] || 0);
  });
  const total = values.reduce((a, b) => a + b, 0);

  const colors = [THEME.accent, THEME.accentLight, THEME.accentLighter, "#FF85B4", "#FFB8D9"];

  // Create visual pie chart using segments
  data.forEach((row: any, index: number) => {
    const value = values[index];
    const percent = total > 0 ? (value / total) * 100 : 0;

    // Color box
    slide.addShape("rect", {
      x: x + 0.5,
      y: y + index * 0.6,
      w: 0.3,
      h: 0.3,
      fill: { color: colors[index % colors.length] },
      line: { type: "none" },
    });

    // Label
    slide.addText(String(row.name || "").substring(0, 25), {
      x: x + 1,
      y: y + index * 0.6,
      w: 3,
      h: 0.3,
      fontSize: 11,
      color: THEME.text,
      valign: "middle",
      fontFace: "Arial",
    });

    // Percentage bar background
    slide.addShape("rect", {
      x: x + 4.2,
      y: y + index * 0.6 + 0.05,
      w: w - 4.2 - x - 0.3,
      h: 0.2,
      fill: { color: THEME.card },
      line: { type: "none" },
    });

    // Percentage bar fill
    slide.addShape("rect", {
      x: x + 4.2,
      y: y + index * 0.6 + 0.05,
      w: ((w - 4.2 - x - 0.3) * percent) / 100,
      h: 0.2,
      fill: { color: colors[index % colors.length] },
      line: { type: "none" },
    });

    // Percentage text
    slide.addText(`${percent.toFixed(1)}%`, {
      x: x + w - 0.8,
      y: y + index * 0.6,
      w: 0.7,
      h: 0.3,
      fontSize: 10,
      color: THEME.text,
      align: "right",
      valign: "middle",
      fontFace: "Arial",
    });
  });
}

function addTableVisualization(
  slide: any,
  prs: any,
  chart: ChartData,
  x: number,
  y: number,
  w: number,
  h: number
) {
  if (chart.data.length === 0) {
    slide.addText("No data available", {
      x,
      y,
      w,
      h: 0.5,
      fontSize: 12,
      color: THEME.textSecondary,
      fontFace: "Arial",
    });
    return;
  }

  const rows = chart.data.slice(0, 12);
  const headers = Object.keys(rows[0] || {});

  // Build table data
  const tableData: any[][] = [
    headers.map((h) => ({
      text: h,
      options: { bold: true, color: "#000000", fill: THEME.accent, fontSize: 10 },
    })),
  ];

  rows.forEach((row: any, rowIndex: number) => {
    const rowData = headers.map((header) => ({
      text: String(row[header] || "").substring(0, 20),
      options: {
        color: THEME.text,
        fill: rowIndex % 2 === 0 ? THEME.card : THEME.background,
        fontSize: 9,
      },
    }));
    tableData.push(rowData);
  });

  const colW = w / headers.length;

  slide.addTable(tableData, {
    x,
    y,
    w,
    h: Math.min(h, 3.5),
    border: { pt: 1, color: THEME.textSecondary },
    colW: Array(headers.length).fill(colW),
    align: "left",
  });
}
