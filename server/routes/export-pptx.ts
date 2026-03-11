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

    // Create presentation
    const prs = new PptxGenJSClass();

    // Slide 1: Title Slide
    const titleSlide = prs.addSlide();
    titleSlide.background = { color: THEME.background };

    titleSlide.addText("InsightAI Report", {
      x: 0.5,
      y: 2.5,
      w: 9,
      h: 0.8,
      fontSize: 54,
      bold: true,
      color: THEME.text,
      align: "center",
      fontFace: "Arial",
    });

    titleSlide.addText(`${datasetName || "Dataset"} Analysis`, {
      x: 0.5,
      y: 3.5,
      w: 9,
      h: 0.6,
      fontSize: 32,
      color: THEME.accent,
      align: "center",
      fontFace: "Arial",
    });

    titleSlide.addText(`Total Charts: ${charts.length}`, {
      x: 0.5,
      y: 4.5,
      w: 9,
      h: 0.5,
      fontSize: 20,
      color: THEME.textSecondary,
      align: "center",
      fontFace: "Arial",
    });

    // Chart Slides
    for (let i = 0; i < charts.length; i++) {
      const chart = charts[i] as ChartData;
      const slide = prs.addSlide();
      slide.background = { color: THEME.background };

      // Header
      slide.addShape("rect", {
        x: 0,
        y: 0,
        w: 10,
        h: 1,
        fill: { color: THEME.card },
        line: { type: "none" },
      });

      slide.addText(chart.title, {
        x: 0.5,
        y: 0.2,
        w: 6,
        h: 0.6,
        fontSize: 28,
        bold: true,
        color: THEME.accent,
        fontFace: "Arial",
      });

      const metaText = `Type: ${chart.chart_type} | Rows: ${chart.data.length}`;
      slide.addText(metaText, {
        x: 0.5,
        y: 0.65,
        w: 9,
        h: 0.25,
        fontSize: 11,
        color: THEME.textSecondary,
        fontFace: "Arial",
      });

      // Insight Strip
      if (chart.insight) {
        slide.addShape("rect", {
          x: 0.5,
          y: 1.3,
          w: 9,
          h: 0.8,
          fill: { color: THEME.accent },
          line: { type: "none" },
        });

        slide.addText(chart.insight, {
          x: 0.7,
          y: 1.4,
          w: 8.6,
          h: 0.6,
          fontSize: 13,
          color: "#000000",
          bold: true,
          align: "left",
          valign: "middle",
          fontFace: "Arial",
        });
      }

      // Add data table
      const contentY = chart.insight ? 2.3 : 1.3;
      const contentH = 7.5 - contentY - 0.5;
      addDataTable(prs, slide, chart, contentY, contentH);
    }

    // Final Slide
    const finalSlide = prs.addSlide();
    finalSlide.background = { color: THEME.background };

    finalSlide.addText("End of Report", {
      x: 0.5,
      y: 3,
      w: 9,
      h: 1,
      fontSize: 48,
      bold: true,
      color: THEME.accent,
      align: "center",
      fontFace: "Arial",
    });

    finalSlide.addText(new Date().toLocaleDateString(), {
      x: 0.5,
      y: 4.5,
      w: 9,
      h: 0.4,
      fontSize: 14,
      color: THEME.textSecondary,
      align: "center",
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

function addDataTable(
  prs: any,
  slide: any,
  chart: ChartData,
  y: number,
  h: number
) {
  if (chart.data.length === 0) {
    slide.addText("No data available", {
      x: 0.5,
      y,
      w: 9,
      h: 0.5,
      fontSize: 12,
      color: THEME.textSecondary,
      fontFace: "Arial",
    });
    return;
  }

  const rows = chart.data.slice(0, 15); // Limit to 15 rows
  const headers = Object.keys(rows[0] || {});

  // Build table data
  const tableData: any[][] = [
    headers.map((h) => ({
      text: h,
      options: { bold: true, color: "#000000", fill: THEME.accent },
    })),
  ];

  // Add data rows with alternating colors
  rows.forEach((row: any, rowIndex: number) => {
    const rowData = headers.map((header) => ({
      text: String(row[header] || "").substring(0, 30), // Limit text length
      options: {
        color: THEME.text,
        fill: rowIndex % 2 === 0 ? THEME.card : THEME.background,
      },
    }));
    tableData.push(rowData);
  });

  const colW = 9 / headers.length;

  slide.addTable(tableData, {
    x: 0.5,
    y,
    w: 9,
    h: Math.min(h, 4.5),
    border: { pt: 1, color: THEME.textSecondary },
    colW: Array(headers.length).fill(colW),
    align: "left",
  });
}
