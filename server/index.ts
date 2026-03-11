import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import analyzeQueryHandler from "./routes/analyze-query.js";
import analyzeDatasetHandler from "./routes/analyze-dataset.js";
import generateReportHandler from "./routes/generate-report.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.post("/api/analyze-query", analyzeQueryHandler);
app.post("/api/analyze-dataset", analyzeDatasetHandler);
app.post("/api/generate-report", generateReportHandler);

if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../dist/public");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
