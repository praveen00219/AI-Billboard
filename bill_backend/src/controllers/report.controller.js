import fs from "fs";
import prisma from "../config/prisma.config.js";
import { analyzeBillboard } from "../services/ai.service.js";

// Analyze Billboard Images
export const analyzeImages = async (req, res) => {
    try {
        const { title, description, location, latitude, longitude, date } = req.body;

        console.log("📩 Analysis Request:", { title, description, location, latitude, longitude, date, filesCount: req.files?.length || 0 });

        if (!description || !location || !req.files?.length) {
            console.error("🚨 Validation failed for analysis:", { description: !!description, location: !!location, files: req.files?.length });
            return res.status(400).json({ success: false, error: "Missing required fields (description, location, or images)" });
        }

        const results = await Promise.all(
            req.files.map(async (file) => {
                const imageBuffer = fs.readFileSync(file.path);
                const imageBase64 = imageBuffer.toString("base64");
                return await analyzeBillboard(imageBase64, file.mimetype, description, latitude, longitude);
            })
        );

        const finalRisk = results.reduce(
            (acc, r) => (r.riskPercentage > acc.riskPercentage ? r : acc),
            results[0]
        );

        res.json({ success: true, finalRisk, allResults: results });
    } catch (err) {
        console.error("🚨 Analysis route error:", err);
        res.status(500).json({ success: false, error: err.message || "AI analysis failed" });
    }
};

// Create Citizen Report
export const createReport = async (req, res) => {
    try {
        const citizenId = req.user.id;
        const {
            title, description, location, date, latitude, longitude,
            extractedText, category, riskLevel, riskPercentage, riskReason,
        } = req.body;

        if (!citizenId || !title || !description || !location) {
            console.error("🚨 Validation failed for report creation:", { citizenId, title: !!title, description: !!description, location: !!location });
            return res.status(400).json({ success: false, error: "Missing required fields for report creation" });
        }

        console.log("📝 Creating report for citizen:", citizenId);

        const report = await prisma.report.create({
            data: {
                citizenId: parseInt(citizenId),
                title,
                category: category || "General",
                location,
                description,
                date: new Date(date),
                latitude: (latitude && latitude !== "") ? parseFloat(latitude) : null,
                longitude: (longitude && longitude !== "") ? parseFloat(longitude) : null,
                media: {
                    create: req.files?.map(file => ({
                        fileUrl: `uploads/${file.filename}`,
                        fileType: file.mimetype.startsWith("image") ? "image" : "video"
                    })) || []
                },
                aiAnalysis: {
                    create: {
                        extractedText,
                        riskPercentage: riskPercentage ? parseFloat(riskPercentage) : null,
                        riskLevel,
                        riskDescription: riskReason,
                        category
                    }
                }
            }
        });

        res.json({ success: true, reportId: report.id, message: "Report, media & AI analysis saved successfully" });
    } catch (err) {
        console.error("Citizen Report Error:", err);
        res.status(500).json({ success: false, error: "Internal server error: " + err.message });
    }
};

// Get All Reports (Authority Dashboard)
export const getAllReports = async (req, res) => {
    try {
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const reports = await prisma.report.findMany({
            include: {
                citizen: { select: { name: true, email: true } },
                media: true,
                aiAnalysis: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedReports = reports.map(report => ({
            reportId: report.id,
            title: report.title,
            description: report.description,
            category: report.category,
            location: report.location,
            latitude: report.latitude,
            longitude: report.longitude,
            date: report.date,
            status: report.status,
            userId: report.citizenId,
            userName: report.citizen?.name || 'Unknown',
            riskPercentage: report.aiAnalysis?.[0]?.riskPercentage
                ? parseFloat(report.aiAnalysis[0].riskPercentage)
                : 0,
            riskLevel: report.aiAnalysis?.[0]?.riskLevel || null,
            media: report.media.map(m => {
                let url = m.fileUrl;
                if (url && !/^https?:\/\//i.test(url)) {
                    url = `${baseUrl}/${url.replace(/^\/?/, "")}`;
                }
                return { mediaId: m.id, type: m.fileType, url };
            }),
        }));

        res.json({ success: true, reports: formattedReports });
    } catch (err) {
        console.error("Error fetching reports:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};


// Get Report by ID
export const getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const report = await prisma.report.findUnique({
            where: { id: parseInt(id) },
            include: {
                citizen: {
                    select: { name: true, email: true, number: true }
                },
                media: true,
                aiAnalysis: true
            }
        });

        if (!report) {
            return res.status(404).json({ status: false, error: "Report not found" });
        }

        const formattedReport = {
            reportId: report.id,
            title: report.title,
            description: report.description,
            category: report.category,
            location: report.location,
            latitude: report.latitude,
            longitude: report.longitude,
            date: report.date,
            status: report.status,
            userId: report.citizenId,
            userName: report.citizen?.name || 'Unknown',
            media: report.media.map(m => {
                let url = m.fileUrl;
                if (url && !/^https?:\/\//i.test(url)) {
                    url = `${baseUrl}/${url.replace(/^\/?/, "")}`;
                }
                return {
                    mediaId: m.id,
                    type: m.fileType,
                    url: url
                };
            }),
            aiAnalysis: report.aiAnalysis[0] || null
        };

        res.json({ status: true, success: true, report: formattedReport });
    } catch (err) {
        console.error("Error fetching report:", err);
        res.status(500).json({ status: false, success: false, error: "Internal server error" });
    }
};

// Get Reports by Citizen ID
export const getReportsByCitizenId = async (req, res) => {
    try {
        const { citizenId } = req.params;
        const reports = await prisma.report.findMany({
            where: { citizenId: parseInt(citizenId) },
            include: {
                media: true,
                aiAnalysis: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, status: true, reports });
    } catch (err) {
        console.error("Error fetching citizen reports:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

// Get Reports by Status
export const getReportsByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const reports = await prisma.report.findMany({
            where: { status },
            include: {
                citizen: { select: { name: true } },
                media: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, reports });
    } catch (err) {
        console.error("Error fetching reports by status:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

// Update Report Status
export const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) return res.status(400).json({ success: false, error: "Status is required" });

        const updatedReport = await prisma.report.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.json({ success: true, message: "Report status updated successfully", report: updatedReport });
    } catch (err) {
        console.error("Error updating report status:", err);
        res.status(500).json({ success: false, error: "Database error or report not found" });
    }
};

// Get AI Analysis for Report
export const getAiAnalysis = async (req, res) => {
    try {
        const { reportId } = req.params;
        const analysis = await prisma.aiAnalysis.findFirst({
            where: { reportId: parseInt(reportId) }
        });

        if (!analysis) {
            return res.status(404).json({ success: false, error: "AI analysis not found" });
        }
        res.json({ success: true, analysis });
    } catch (err) {
        console.error("Error fetching AI analysis:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

// Get Reports for Auth Dashboard
export const getAuthReporting = async (req, res) => {
    try {
        const citizenId = req.user.id;
        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const reports = await prisma.report.findMany({
            where: { citizenId },
            include: {
                citizen: { select: { name: true } },
                media: true
            },
            orderBy: { date: 'desc' }
        });

        const formattedReports = reports.map(report => ({
            reportId: report.id,
            title: report.title,
            description: report.description,
            category: report.category,
            location: report.location,
            latitude: report.latitude,
            longitude: report.longitude,
            date: report.date,
            status: report.status,
            userId: report.citizenId,
            userName: report.citizen.name,
            media: report.media.map(m => {
                let url = m.fileUrl;
                if (url && !/^https?:\/\//i.test(url)) {
                    url = `${baseUrl}/${url.replace(/^\/?/, "")}`;
                }
                return {
                    mediaId: m.id,
                    type: m.fileType,
                    url: url
                };
            })
        }));

        res.json({ status: true, reports: formattedReports, role: req.user.role || 'user' });
    } catch (err) {
        console.error("Auth reporting fetch error:", err);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
};

// Get Single Report Details for Citizen
export const getCitizenReportById = async (req, res) => {
    try {
        const citizenId = req.user.id;
        const { reportId } = req.params;
        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const report = await prisma.report.findFirst({
            where: { 
                id: parseInt(reportId),
                citizenId: citizenId
            },
            include: {
                citizen: { select: { name: true } },
                media: true,
                aiAnalysis: true
            }
        });

        if (!report) return res.status(404).json({ status: false, message: "Report not found or unauthorized" });

        const formattedReport = {
            reportId: report.id,
            title: report.title,
            description: report.description,
            category: report.category,
            location: report.location,
            latitude: report.latitude,
            longitude: report.longitude,
            date: report.date,
            status: report.status,
            userId: report.citizenId,
            userName: report.citizen.name,
            media: report.media.map(m => {
                let url = m.fileUrl;
                if (url && !/^https?:\/\//i.test(url)) {
                    url = `${baseUrl}/${url.replace(/^\/?/, "")}`;
                }
                return {
                    mediaId: m.id,
                    type: m.fileType,
                    url: url
                };
            }),
            aiAnalysis: report.aiAnalysis[0] || null
        };

        res.json({ status: true, report: formattedReport, role: req.user.role || 'user' });
    } catch (err) {
        console.error("Citizen report details fetch error:", err);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
};

export default {
    analyzeImages,
    createReport,
    getAllReports,
    getReportById,
    getCitizenReportById,
    getReportsByCitizenId,
    getReportsByStatus,
    updateReportStatus,
    getAiAnalysis,
    getAuthReporting
};
