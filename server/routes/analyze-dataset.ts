import type { Request, Response } from "express";

export default async function analyzeDatasetHandler(req: Request, res: Response) {
  try {
    const { columns, data, datasetName } = req.body;

    if (!columns || !Array.isArray(data)) {
      return res.status(400).json({
        error: "Missing required fields: columns and data",
      });
    }

    // Analyze dataset
    const rowCount = data.length;
    const columnCount = columns.length;

    // Detect numeric and categorical fields
    const numericMetrics: string[] = [];
    const categoricalFields: string[] = [];

    columns.forEach((col: { name: string; type: string }) => {
      if (col.type === "number" || col.type === "numeric") {
        numericMetrics.push(col.name);
      } else if (col.type === "string" || col.type === "categorical") {
        categoricalFields.push(col.name);
      }
    });

    // If type info is missing, infer from sample data
    if (numericMetrics.length === 0 && categoricalFields.length === 0 && data.length > 0) {
      const sample = data[0];
      columns.forEach((col: { name: string; type?: string }) => {
        const sampleValue = sample[col.name];
        if (typeof sampleValue === "number") {
          numericMetrics.push(col.name);
        } else if (typeof sampleValue === "string") {
          categoricalFields.push(col.name);
        }
      });
    }

    // Generate suggested questions
    const suggestedQuestions: string[] = [];

    if (numericMetrics.length > 0 && categoricalFields.length > 0) {
      const metric = numericMetrics[0];
      const dimension = categoricalFields[0];
      suggestedQuestions.push(`Show ${metric} by ${dimension}`);

      if (categoricalFields.length > 1) {
        suggestedQuestions.push(`Compare ${metric} across ${categoricalFields.slice(0, 2).join(" and ")}`);
      }
    }

    if (numericMetrics.length >= 2) {
      suggestedQuestions.push(`Analyze relationship between ${numericMetrics.slice(0, 2).join(" and ")}`);
    }

    if (categoricalFields.length > 0) {
      suggestedQuestions.push(`Top 5 by ${categoricalFields[0]}`);
    }

    if (numericMetrics.length > 0) {
      suggestedQuestions.push(`Trend analysis for ${numericMetrics[0]}`);
    }

    return res.json({
      rowCount,
      columnCount,
      numericMetrics: numericMetrics.slice(0, 5),
      categoricalFields: categoricalFields.slice(0, 5),
      suggestedQuestions: suggestedQuestions.slice(0, 5),
    });
  } catch (error) {
    console.error("Dataset analysis error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Dataset analysis failed",
    });
  }
}
