import express from "express";
import { getAllUsersWithReports, getViolationsForHeatmap, getCitizenStatuses, updateReportStatus } from "../controllers/admin.controller.js";
import { getReportsByStatus } from "../controllers/report.controller.js";
import { verifyAuthorityToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get all users and their details
router.get("/getalluser-for-authority", verifyAuthorityToken, getAllUsersWithReports);

// Heatmap violations
router.get("/violations", getViolationsForHeatmap);

// Citizen statuses summary
router.get("/citizen-status", getCitizenStatuses);

// Pending reports
router.get("/pending-reports", verifyAuthorityToken, (req, res) => {
    req.params.status = 'pending';
    getReportsByStatus(req, res);
});

// Update report status
router.patch("/update-status", verifyAuthorityToken, updateReportStatus);

export default router;
