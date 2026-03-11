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
          await addPieChartVisualization(slide, prs, chart, 0.5, contentY, 9, contentHeight);
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
  const data = chart.data.slice(0, 12);
  if (data.length === 0) return;

  // Vertical (column) bar chart
  const labels = data.map((d: any) => String(d.name || "").substring(0, 12));
  const values = data.map((d: any) => {
    const keys = Object.keys(d).filter((k) => k !== "name");
    return Number(d[keys[0]] || 0);
  });

  const barWidth = w / data.length - 0.1;
  const maxValue = Math.max(...values);
  const chartHeight = h * 0.85;
  const valueRange = maxValue > 0 ? maxValue : 1;

  // Draw chart background
  slide.addShape("rect", {
    x,
    y,
    w,
    h: chartHeight,
    fill: { color: THEME.background },
    line: { color: THEME.card, width: 1 },
  });

  // Draw grid lines
  for (let i = 0; i <= 4; i++) {
    const gridY = y + (chartHeight * i) / 4;
    const gridValue = maxValue - (maxValue * i) / 4;
    
    slide.addShape("line", {
      x,
      y: gridY,
      w,
      h: 0,
      line: { color: THEME.card, width: 1 },
    });

    slide.addText(String(gridValue.toFixed(0)), {
      x: x - 0.4,
      y: gridY - 0.15,
      w: 0.35,
      h: 0.3,
      fontSize: 8,
      color: THEME.textSecondary,
      align: "right",
      fontFace: "Arial",
    });
  }

  // Draw bars (vertical)
  data.forEach((row: any, index: number) => {
    const value = values[index];
    const barHeight = (value / valueRange) * chartHeight;
    const barX = x + index * (w / data.length) + 0.05;
    const barY = y + chartHeight - barHeight;

    // Bar
    slide.addShape("rect", {
      x: barX,
      y: barY,
      w: barWidth,
      h: barHeight,
      fill: { color: THEME.accent },
      line: { type: "none" },
    });

    // Value label on top of bar
    slide.addText(String(value.toFixed(0)), {
      x: barX,
      y: barY - 0.25,
      w: barWidth,
      h: 0.2,
      fontSize: 8,
      color: THEME.accent,
      align: "center",
      fontFace: "Arial",
    });

    // X-axis label
    slide.addText(labels[index], {
      x: barX,
      y: y + chartHeight + 0.1,
      w: barWidth,
      h: 0.3,
      fontSize: 8,
      color: THEME.text,
      align: "center",
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

async function addPieChartVisualization(
  slide: any,
  prs: any,
  chart: ChartData,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const data = chart.data.slice(0, 6);
  if (data.length === 0) return;

  // Extract pie data
  const pieLabels = data.map((row: any) => String(row.name || "").substring(0, 20));
  const pieValues = data.map((row: any) => {
    const keys = Object.keys(row).filter((k) => k !== "name");
    return Number(row[keys[0]] || 0);
  });

  const colors = [THEME.accent, THEME.accentLight, THEME.accentLighter, "#FF85B4", "#FFB8D9", "#FFC9DC"];
  const totalValue = pieValues.reduce((a, b) => a + b, 0);

  // Draw a simple segmented bar representation (horizontal stacked bar)
  const barHeight = Math.min(h * 0.3, 0.8);
  const barY = y + h * 0.15;
  let currentX = x;

  pieValues.forEach((value, index) => {
    const segmentWidth = (value / totalValue) * w;
    const percentage = ((value / totalValue) * 100).toFixed(0);

    // Draw segment
    slide.addShape("rect", {
      x: currentX,
      y: barY,
      w: segmentWidth,
      h: barHeight,
      fill: { color: colors[index % colors.length] },
      line: { color: THEME.background, width: 1 },
    });

    // Add percentage label on segment
    if (segmentWidth > 0.4) {
      slide.addText(percentage + "%", {
        x: currentX,
        y: barY + (barHeight - 0.2) / 2,
        w: segmentWidth,
        h: 0.2,
        fontSize: 9,
        bold: true,
        color: "#000000",
        align: "center",
        valign: "middle",
        fontFace: "Arial",
      });
    }

    currentX += segmentWidth;
  });

  // Add legend below chart
  let legendY = y + h * 0.65;
  let legendX = x;

  pieLabels.forEach((label, index) => {
    const legendValue = pieValues[index];
    const percentage = ((legendValue / totalValue) * 100).toFixed(1);
    const legendColor = colors[index % colors.length];

    // Legend color square
    slide.addShape("rect", {
      x: legendX,
      y: legendY,
      w: 0.15,
      h: 0.15,
      fill: { color: legendColor },
      line: { type: "none" },
    });

    // Legend text
    const labelText = `${label} (${percentage}%)`;
    slide.addText(labelText, {
      x: legendX + 0.2,
      y: legendY,
      w: w / 2 - 0.25,
      h: 0.2,
      fontSize: 8,
      color: THEME.text,
      align: "left",
      fontFace: "Arial",
    });

    legendX += w / 2 + 0.1;
    if (legendX > x + w) {
      legendX = x;
      legendY += 0.25;
    }
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
