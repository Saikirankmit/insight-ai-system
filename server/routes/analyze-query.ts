import type { Request, Response } from "express";

type ChartType = "line" | "bar" | "pie" | "area";

type QueryResult = {
  sql: string;
  message: string;
  charts: {
    type: ChartType;
    title: string;
    data: Record<string, unknown>[];
    keys: string[];
  }[];
  table: Record<string, unknown>[];
};

type AnalysisResult = QueryResult & {
  insights?: string[];
  keyFindings?: string[];
  recommendations?: string[];
  querySuggestions?: { text: string; category: string }[];
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^\d.-]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const inferTableFields = (table: Record<string, unknown>[]) => {
  const sample = table.find((row) => row && typeof row === "object") ?? {};
  const entries = Object.entries(sample);
  const labelField =
    entries.find(([k, v]) => isNonEmptyString(v) && !["sql"].includes(k.toLowerCase()))?.[0] ?? "name";
  const valueField =
    entries.find(([, v]) => typeof v === "number")?.[0] ??
    entries.find(([, v]) => toNumber(v) !== null)?.[0] ??
    "value";
  return { labelField, valueField };
};

const generateInsights = (result: QueryResult): Partial<AnalysisResult> => {
  const insights: string[] = [];
  const keyFindings: string[] = [];
  const recommendations: string[] = [];
  const querySuggestions: { text: string; category: string }[] = [];

  // Analyze charts data
  result.charts.forEach((chart) => {
    if (chart.data && chart.data.length > 0) {
      const chartTitle = chart.title.toLowerCase();

      // Extract numeric values
      const numericValues = chart.data.flatMap((row) =>
        chart.keys
          .map((key) => toNumber(row[key]))
          .filter((n): n is number => n !== null)
      );

      if (numericValues.length > 0) {
        const max = Math.max(...numericValues);
        const min = Math.min(...numericValues);
        const avg = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;

        // Generate insights
        if (chart.data.length > 0 && chart.data[0].name) {
          const topItem = chart.data[0].name;
          insights.push(`${topItem} shows the highest value with ${max.toFixed(2)}.`);
        }

        if (max - min > avg * 0.5) {
          keyFindings.push(`Significant variation detected across ${chartTitle}.`);
        }

        // Add recommendations
        recommendations.push(`Review the data for ${chartTitle} to identify trends and opportunities.`);
      }

      // Suggest follow-up questions
      if (chart.type === "bar" || chart.type === "pie") {
        querySuggestions.push({
          text: `Compare values across ${chart.title}`,
          category: "Comparison",
        });
      }

      if (chart.type === "line") {
        querySuggestions.push({
          text: `Analyze trends in ${chart.title} over time`,
          category: "Trend",
        });
      }
    }
  });

  // Add general suggestions
  if (result.table.length > 0) {
    querySuggestions.push({
      text: `Show top performers by key metric`,
      category: "Analysis",
    });
  }

  querySuggestions.push({
    text: `Filter data by specific criteria`,
    category: "Filter",
  });

  querySuggestions.push({
    text: `Compare results with previous period`,
    category: "Comparison",
  });

  return {
    insights: insights.slice(0, 3),
    keyFindings: keyFindings.slice(0, 3),
    recommendations: recommendations.slice(0, 3),
    querySuggestions: querySuggestions.slice(0, 4),
  };
};

const normalizeCharts = (result: QueryResult): QueryResult => {
  const safeTable = Array.isArray(result.table) ? result.table : [];

  result.charts = (Array.isArray(result.charts) ? result.charts : []).map((chart) => {
    const type: ChartType = ["line", "bar", "pie", "area"].includes(chart?.type)
      ? (chart.type as ChartType)
      : "bar";

    const rawData = Array.isArray(chart?.data) ? chart.data : [];
    const rawKeys = Array.isArray(chart?.keys)
      ? chart.keys.filter((k): k is string => isNonEmptyString(k))
      : [];

    if (type === "pie") {
      const pieData = rawData
        .map((row, index) => {
          const name = isNonEmptyString(row?.name) ? row.name.trim() : `Item ${index + 1}`;
          const direct = toNumber(row?.value);
          const fromFirstKey = rawKeys.length > 0 ? toNumber(row?.[rawKeys[0]]) : null;
          const firstNumeric = Object.values(row ?? {}).map(toNumber).find((n) => n !== null) ?? null;
          const value = direct ?? fromFirstKey ?? firstNumeric ?? 0;
          return { name, value };
        })
        .filter((row) => Number.isFinite(row.value));

      return {
        type,
        title: isNonEmptyString(chart?.title) ? chart.title : "Distribution",
        data: pieData.slice(0, 25),
        keys: ["value"],
      };
    }

    let keys = rawKeys;
    if (!keys.length) {
      const candidate =
        Object.keys(rawData[0] ?? {}).find((k) => k !== "name" && toNumber(rawData[0]?.[k]) !== null) ??
        "value";
      keys = [candidate];
    }

    let normalizedData = rawData.map((row, index) => {
      const name = isNonEmptyString(row?.name) ? row.name.trim() : `Item ${index + 1}`;
      const normalizedRow: Record<string, string | number> = { name };
      for (const key of keys) {
        normalizedRow[key] = toNumber(row?.[key]) ?? 0;
      }
      return normalizedRow;
    });

    const clearlyBroken =
      normalizedData.length <= 1 ||
      normalizedData.every((row) => keys.every((k) => (row[k] as number) === 0));

    if (clearlyBroken && safeTable.length > 0) {
      const { labelField, valueField } = inferTableFields(safeTable);
      const fallbackKey = keys[0] ?? valueField;
      keys = [fallbackKey];
      normalizedData = safeTable.slice(0, 20).map((row, index) => {
        const labelRaw = row[labelField];
        const valueRaw = row[fallbackKey] ?? row[valueField];
        return {
          name: isNonEmptyString(labelRaw) ? labelRaw : `Row ${index + 1}`,
          [fallbackKey]: toNumber(valueRaw) ?? 0,
        };
      });
    }

    return {
      type,
      title: isNonEmptyString(chart?.title) ? chart.title : "Chart",
      data: normalizedData,
      keys,
    };
  });

  return result;
};

export default async function analyzeQueryHandler(req: Request, res: Response) {
  try {
    const { query, columns, sampleData, conversationHistory } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GROK_API_KEY = process.env.GROK_API_KEY;

    if (!GEMINI_API_KEY && !GROK_API_KEY) {
      res.status(500).json({ error: "No AI API keys configured (GEMINI_API_KEY or GROK_API_KEY required)" });
      return;
    }

    const systemPrompt = `You are a conversational data analyst AI assistant called InsightAI. You help users explore their data through natural language.

Rules:
1) Return ONLY valid JSON matching the required shape.
2) The "message" field should be a short, friendly explanation of what you did (1-3 sentences). Use markdown formatting.
3) For line/bar/area charts: each data row must have a short string "name" plus numeric values for every key in "keys".
4) For pie charts: each row must be {"name": string, "value": number} and keys must be ["value"].
5) Do not place paragraphs or CSV blobs inside "name" fields.
6) Use realistic values inferred from sample rows.
7) When the user asks to modify, filter, or change an existing dashboard, interpret it as a modification of the previous result.
8) If the dataset doesn't contain the requested information, set message to explain what columns are available and return empty charts/table.

Dataset columns: ${JSON.stringify(columns)}
Sample rows: ${JSON.stringify(sampleData?.slice(0, 8))}`;

    const messages: { role: string; parts: { text: string }[] }[] = [];

    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory.slice(-6)) {
        messages.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        });
      }
    }

    messages.push({
      role: "user",
      parts: [{ text: `${systemPrompt}\n\nUser question: "${query}"` }],
    });

    let response;
    let aiProvider = "Gemini";

    // Try Gemini first
    if (GEMINI_API_KEY) {
      console.log("Attempting to use Gemini API...");
      try {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: messages,
              generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: "OBJECT",
                  properties: {
                    sql: { type: "STRING", description: "The SQL query to answer the question" },
                    message: { type: "STRING", description: "A short friendly explanation of the result in markdown" },
                    charts: {
                      type: "ARRAY",
                      items: {
                        type: "OBJECT",
                        properties: {
                          type: { type: "STRING", enum: ["line", "bar", "pie", "area"] },
                          title: { type: "STRING" },
                          data: {
                            type: "ARRAY",
                            items: {
                              type: "OBJECT",
                              properties: {
                                name: { type: "STRING" },
                                value: { type: "NUMBER" },
                              },
                              required: ["name"],
                            },
                          },
                          keys: { type: "ARRAY", items: { type: "STRING" } },
                        },
                        required: ["type", "title", "data", "keys"],
                      },
                    },
                    table: {
                      type: "ARRAY",
                      items: { type: "OBJECT" },
                    },
                  },
                  required: ["sql", "message", "charts", "table"],
                },
              },
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Gemini API error:", response.status, errorText);
          throw new Error(`Gemini error: ${response.status}`);
        }
      } catch (e) {
        console.error("Gemini failed:", e);
        if (GROK_API_KEY) {
          console.log("Falling back to Grok API...");
          aiProvider = "Grok";
          // Fall through to use Grok
        } else {
          throw e;
        }
      }
    }

    // Fall back to Grok if Gemini failed or not available
    if (aiProvider === "Grok" || !response) {
      if (!GROK_API_KEY) {
        throw new Error("Grok API key not configured");
      }

      response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "grok-beta",
          messages: [
            {
              role: "user",
              content: `${systemPrompt}\n\nUser question: "${query}"\n\nRespond with ONLY valid JSON in this format:\n{\n  "sql": "SELECT...",\n  "message": "explanation",\n  "charts": [{...}],\n  "table": [{...}]\n}`,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Grok API error:", response.status, errorText);
        res.status(500).json({ error: "AI service error", provider: "Grok", details: errorText });
        return;
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${aiProvider} API error:`, response.status, errorText);

      if (response.status === 429) {
        res.status(429).json({ error: "Rate limit exceeded. Please try again in a moment." });
        return;
      }
      if (response.status === 503) {
        res.status(503).json({ error: "AI is busy right now. Please retry in a few seconds." });
        return;
      }
      res.status(500).json({ error: "AI service error", provider: aiProvider, details: errorText });
      return;
    }

    let textContent: string;

    if (aiProvider === "Grok") {
      const grokResponse = await response.json();
      textContent = grokResponse.choices?.[0]?.message?.content;
    } else {
      const geminiResponse = await response.json();
      textContent = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    if (!textContent) {
      throw new Error(`No content in ${aiProvider} response`);
    }

    const parsed = JSON.parse(textContent) as QueryResult;
    const normalized = normalizeCharts({
      sql: typeof parsed.sql === "string" ? parsed.sql : "SELECT * FROM your_table LIMIT 10",
      message: typeof parsed.message === "string" ? parsed.message : "Here are the results for your query.",
      charts: Array.isArray(parsed.charts) ? parsed.charts : [],
      table: Array.isArray(parsed.table) ? parsed.table : [],
    });

    // Generate insights and suggestions
    const { insights, keyFindings, recommendations, querySuggestions } = generateInsights(normalized);

    res.json({
      ...normalized,
      insights,
      keyFindings,
      recommendations,
      querySuggestions,
      provider: aiProvider,
    });
  } catch (e) {
    console.error("analyze-query error:", e);
    res.status(500).json({ error: e instanceof Error ? e.message : "Unknown error" });
  }
}
