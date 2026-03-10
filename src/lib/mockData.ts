export interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  chartsGenerated: number;
  sql: string;
}

export interface PipelineStep {
  id: string;
  label: string;
  description: string;
  status: "pending" | "running" | "complete" | "error";
}

export const PIPELINE_STEPS: PipelineStep[] = [
  { id: "analyze", label: "Analyzing Prompt", description: "Understanding your natural language query", status: "pending" },
  { id: "sql", label: "Generating SQL", description: "Converting to structured query language", status: "pending" },
  { id: "query", label: "Querying Data", description: "Fetching results from the dataset", status: "pending" },
  { id: "chart", label: "Selecting Visualization", description: "Choosing the best chart types", status: "pending" },
  { id: "dashboard", label: "Building Dashboard", description: "Rendering interactive components", status: "pending" },
];

export const EXAMPLE_QUERIES = [
  "Show monthly sales revenue by region",
  "Compare product category performance",
  "Show top 5 products by revenue",
  "What is the average revenue per unit by category?",
  "Show sales trends for Q3 2024",
];
