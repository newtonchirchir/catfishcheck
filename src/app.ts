import express from "express";
import cors from "cors";
import helmet from "helmet";
import scanRoutes from "./routes/scan.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "catfishcheck-api",
  });
});

app.use("/scans", scanRoutes);
app.use("/uploads", uploadRoutes);

export default app;
