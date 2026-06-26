import express from "express";
import {
    analyzeImages,
    generateReportDraft,
    createReport,
    getAllReports,
    getReportById,
    getCitizenReportById,
    getReportsByCitizenId,
    getReportsByStatus,
    updateReportStatus,
    getAiAnalysis,
    getAuthReporting
} from "../controllers/report.controller.js";
import { upload, uploadMemory, handleUploadError } from "../middlewares/upload.middleware.js";
import { verifyCitizenToken, verifyAuthorityToken } from "../middlewares/auth.middleware.js";
import { aiRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

// ─── Citizen Routes ───────────────────────────────────────────────────────────

// AI Analysis of billboard images (citizen only)
router.post("/analysis", aiRateLimiter, verifyCitizenToken, upload.array("photo", 5), handleUploadError, analyzeImages);

// AI draft generation — title + description from an image (citizen only, no DB write)
router.post("/ai-generate", aiRateLimiter, verifyCitizenToken, uploadMemory.array("photo", 5), handleUploadError, generateReportDraft);

// Submit a new citizen report
router.post("/citizen-report", verifyCitizenToken, upload.array("photo", 5), handleUploadError, createReport);

// Get reports for citizen dashboard
router.get("/auth-reporting", verifyCitizenToken, getAuthReporting);

// Get specific report details for the logged-in citizen
// NOTE: Must be defined BEFORE /report/:id to avoid conflicts
router.get("/citizen-report/:reportId", verifyCitizenToken, getCitizenReportById);

// Get reports by citizen ID
router.get("/my-reports/:citizenId", verifyCitizenToken, getReportsByCitizenId);

// ─── Authority Routes ─────────────────────────────────────────────────────────

// Get all reports (Authority Dashboard)
router.get("/all-reports", verifyAuthorityToken, getAllReports);

// Get specific report detail (authority view)
router.get("/report/:id", verifyAuthorityToken, getReportById);

// Update report status (Approve / Reject)
router.put("/change-status/:id", verifyAuthorityToken, updateReportStatus);

// Get reports filtered by status
router.get("/reports-by-status/:status", verifyAuthorityToken, getReportsByStatus);

// ─── Shared Routes ────────────────────────────────────────────────────────────

// AI analysis for a specific report (accessible by both)
router.get("/ai-analysis/:reportId", getAiAnalysis);

export default router;
