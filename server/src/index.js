import express from "express";
import cors from "cors";
import api from "./routes/api.js";

const app = express();
const port = Number(process.env.PORT || 5000);
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "100kb" }));
app.use("/api", api);
app.use((req, res) => res.status(404).json({ error: "Route not found", path: req.path }));
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ error: error.message || "Internal server error" });
});
app.listen(port, () => console.log(`AI Footprint API listening on http://localhost:${port}`));
