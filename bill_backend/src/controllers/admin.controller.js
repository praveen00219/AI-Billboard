import prisma from "../config/prisma.config.js";

// Get all users with their reports
export const getAllUsersWithReports = async (req, res) => {
    try {
        const users = await prisma.userAuth.findMany({
            include: {
                reports: true
            },
            orderBy: { id: 'asc' }
        });

        const formattedUsers = users.map(user => ({
            userId: user.id,
            name: user.name,
            email: user.email,
            phoneNo: user.number,
            reports: user.reports.map(report => ({
                reportId: report.id,
                title: report.title,
                description: report.description,
                category: report.category,
                location: report.location,
                date: report.date,
                status: report.status,
            }))
        }));

        return res.status(200).json({ status: true, users: formattedUsers });
    } catch (err) {
        console.error("DB Fetch Error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
    }
};

// Get all violations for Heatmap
export const getViolationsForHeatmap = async (req, res) => {
    try {
        const reports = await prisma.report.findMany();
        res.json(reports);
    } catch (err) {
        console.error("Error fetching violations:", err);
        res.status(500).json({ error: "Database query failed" });
    }
};

// Get all citizen report statuses
export const getCitizenStatuses = async (req, res) => {
    try {
        const reports = await prisma.report.findMany({
            select: { status: true }
        });
        const statuses = reports.map((row) => row.status);
        return res.status(200).json({ status: true, data: statuses });
    } catch (err) {
        console.error("Status fetch error:", err);
        return res.status(404).json({ status: false, message: "Status not found" });
    }
};

// Update report status
export const updateReportStatus = async (req, res) => {
    try {
        const { reportId, status } = req.body;
        const updatedReport = await prisma.report.update({
            where: { id: parseInt(reportId) },
            data: { status }
        });
        return res.status(200).json({ success: true, report: updatedReport });
    } catch (err) {
        console.error("Update Status Error:", err);
        return res.status(500).json({ success: false, message: "Failed to update report status" });
    }
};

export default {
    getAllUsersWithReports,
    getViolationsForHeatmap,
    getCitizenStatuses,
    updateReportStatus,
};
