import apiClient from './apiClient';

export const reportApi = {
  // Analyze billboard images (AI)
  analyzeImages: async (formData) => {
    const response = await apiClient.post('/report/analysis', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Submit a new citizen report
  createReport: async (reportData) => {
    const response = await apiClient.post('/report/citizen-report', reportData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get reports for citizen dashboard
  getAuthReporting: async () => {
    const response = await apiClient.get('/report/auth-reporting');
    return response.data;
  },

  // Get specific report details for citizen
  getCitizenReportById: async (reportId) => {
    const response = await apiClient.get(`/report/citizen-report/${reportId}`);
    return response.data;
  },

  // Get reports by citizen ID
  getMyReports: async (citizenId) => {
    const response = await apiClient.get(`/report/my-reports/${citizenId}`);
    return response.data;
  },

  // Get specific report detail for authority
  getAuthorityReportById: async (reportId) => {
    const response = await apiClient.get(`/report/report/${reportId}`);
    return response.data;
  },


  // Get all reports (Authority Dashboard)
  getAllReports: async () => {
    const response = await apiClient.get('/report/all-reports');
    return response.data;
  },

  // Update report status (Approve/Reject)
  updateReportStatus: async (id, status) => {
    const response = await apiClient.put(`/report/change-status/${id}`, { status });
    return response.data;
  },

  // Get AI analysis for a specific report
  getAiAnalysis: async (reportId) => {
    const response = await apiClient.get(`/report/ai-analysis/${reportId}`);
    const data = response.data;

    // Transform raw DB shape into the shape ReportDetails.jsx expects
    if (data.success && data.analysis) {
      const a = data.analysis;
      return {
        riskAssessment: {
          percentage: a.riskPercentage ? parseFloat(a.riskPercentage) : 0,
          level: a.riskLevel || "Unknown",
          category: a.category || "Unknown",
        },
        extractedContent: a.extractedText || "",
        risks: a.riskDescription || "",
        aiSummary: a.riskDescription || "",
      };
    }

    return null;
  },
};
