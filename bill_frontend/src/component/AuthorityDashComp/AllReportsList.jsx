import { CheckCircle, XCircle, Eye, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authorityApiClient } from "../../api/apiClient";

export default function AllReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await authorityApiClient.get("/report/all-reports");
      if (response.data.success || response.data.status) {
        setReports(response.data.reports);
      }
    } catch (err) {
      console.error("Fetch reports error:", err);
      setError("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      await authorityApiClient.put(`/report/change-status/${reportId}`, { status: newStatus });
      // Update local state
      setReports(reports.map(r => r.reportId === reportId ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update status");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "approved":
      case "resolved": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "rejected": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading reports...</div>;
  if (error) return <div className="p-8 text-center text-red-400">{error}</div>;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#fafafa] flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          Recent Violation Reports
        </h2>
      </div>

      <div className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1a1a1a] border-b border-gray-800">
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Report Info</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Risk Score</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {reports.map((report) => (
                <tr key={report.reportId} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors uppercase">
                      {report.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">{report.category}</span>
                      <span>{new Date(report.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-400 max-w-[200px] truncate">
                    {report.location}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${report.riskPercentage > 70 ? 'bg-red-500' : report.riskPercentage > 40 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                          style={{ width: `${report.riskPercentage || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-300">{report.riskPercentage || 0}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => navigate(`/report-deatils/${report.reportId}`)}
                      className="p-2 text-gray-400 hover:text-white transition-colors bg-gray-800 rounded-lg"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {report.status === "pending" && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(report.reportId, "approved")}
                          className="p-2 text-green-500 hover:bg-green-500 hover:text-white transition-all bg-green-500/10 rounded-lg"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(report.reportId, "rejected")}
                          className="p-2 text-red-500 hover:bg-red-500 hover:text-white transition-all bg-red-500/10 rounded-lg"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reports.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No reports found to manage.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
