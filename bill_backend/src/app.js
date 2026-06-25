import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import config from "./config/app.config.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

// Import Routes
import authRoutes from "./routes/auth.routes.js";
import authorityRoutes from "./routes/authority.routes.js";
import reportRoutes from "./routes/report.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// Middleware Setup
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
    ],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes Mounting (Standardized API structure)
app.use("/api/auth", authRoutes);       // Citizen Auth
app.use("/api/auth", authorityRoutes);  // Authority Auth (Mounted under /api/auth for consistency)
app.use("/api/report", reportRoutes);   // Reports (Mounted under /api/report)
app.use("/api/admin", adminRoutes);     // Admin/Violations
app.use("/api/authority", adminRoutes); // Authority prefix compatibility
app.use("/api/status", adminRoutes);    // Status prefix compatibility

app.get("/", (req, res) => res.status(200).send("Billboard Backend API is running..."));

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
