import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CitizenReportsForDash } from "../../hooks/Citizen/CitiZenReportsForDash";
import { useAuth } from "../../middleware/AuthController";
import { UseRollBased } from "../../middleware/RollBasedAccessController";
import CitizenReport from "./CitizenReport";

function CitizenDashboard() {
  const { type } = UseRollBased();
  const { authenticated } = useAuth();
  const navigate = useNavigate();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { reports, stats, loading, error, fetchReports } =
    CitizenReportsForDash(authenticated);
  const user = JSON.parse(localStorage.getItem("user"));

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "under-review":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-500/40 hover:bg-yellow-900/50";
      case "approved":
        return "bg-green-900/30 text-green-400 border-green-500/40 hover:bg-green-900/50";
      case "rejected":
        return "bg-red-900/30 text-red-400 border-red-500/40 hover:bg-red-900/50";
      case "under-review":
        return "bg-orange-900/30 text-orange-400 border-orange-500/40 hover:bg-orange-900/50";
      default:
        return "bg-yellow-900/30 text-yellow-400 border-yellow-500/40 hover:bg-yellow-900/50";
    }
  };

  if (type !== "citizen") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-[#fafafa]">
        <h1 className="text-3xl font-bold mb-4">🚫 Access Denied</h1>
        <p className="text-gray-400">
          This dashboard is protected and only accessible by <b>Citizens</b>.
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] text-red-400 text-lg font-semibold">
        Unauthorized access — please log in first.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] text-[#E5E7EB] text-lg font-semibold">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Loading reports...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] text-red-400 text-lg font-semibold gap-4">
        <span>Error: {error}</span>
        <button
          onClick={() => fetchReports()}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 bg-[#0A0A0A] text-[#E5E7EB] p-6 sm:p-8 lg:p-12 pt-16 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-[#FAFAFA]/20 pb-6">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Track your violation reports and contribute to a compliant city
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsReportDialogOpen(true)}
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg border border-blue-500/50"
          >
            <Plus className="mr-2 h-5 w-5" />
            Report Violation
          </button>
          <button
            onClick={() => fetchReports()}
            className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg border border-gray-500/50"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Reports",
            value: stats.myReports,
            color: "text-blue-400",
            icon: <FileText className="h-5 w-5 text-gray-400" />,
            note: "All time submissions",
          },
          {
            label: "Pending",
            value: stats.pendingReports,
            color: "text-yellow-400",
            icon: <Clock className="h-5 w-5 text-gray-400" />,
            note: "Awaiting review",
          },
          {
            label: "Approved",
            value: stats.approvedReports,
            color: "text-green-400",
            icon: <CheckCircle className="h-5 w-5 text-gray-400" />,
            note: "Confirmed violations",
          },
          {
            label: "Rejected",
            value: stats.rejectedReports,
            color: "text-red-400",
            icon: <XCircle className="h-5 w-5 text-gray-400" />,
            note: "Not violations",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-[#0A0A0A]/90 backdrop-blur-md rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#FAFAFA]/20"
          >
            <div className="flex flex-row items-center justify-between pb-3">
              <h3 className="text-sm font-semibold text-[#E5E7EB]">
                {stat.label}
              </h3>
              {stat.icon}
            </div>
            <div className={`text-4xl font-extrabold ${stat.color}`}>
              {stat.value}
            </div>
            <p className="text-xs text-gray-400 mt-1">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0A0A0A]/90 backdrop-blur-md rounded-xl shadow-md overflow-hidden border border-[#FAFAFA]/20">
        <div className="p-6 border-b border-[#FAFAFA]/20">
          <h2 className="text-3xl font-extrabold text-[#E5E7EB]">
            Your Reports
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            History of all violation reports you've submitted
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-[#0A0A0A]/95 border-b border-[#FAFAFA]/20">
              <tr>
                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                  Title
                </th>
                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                  Category
                </th>
                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                  Location
                </th>
                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                  Date
                </th>
                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                  Status
                </th>
                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.reportId}
                  className="border-b border-[#FAFAFA]/20 hover:bg-[#0A0A0A]/70 transition-colors duration-200"
                >
                  <td className="p-4 font-medium text-[#E5E7EB]">
                    {report.title}
                  </td>
                  <td className="p-4">
                    <span className="capitalize inline-block px-3 py-1 text-xs font-medium text-[#E5E7EB] border border-[#FAFAFA]/20 rounded-full bg-[#0A0A0A]/90">
                      {report.category}
                    </span>
                  </td>
                  <td className="p-4 max-w-[200px] truncate text-gray-300">
                    {report.location}
                  </td>
                  <td className="p-4 text-gray-300">
                    {new Date(report.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-[#FAFAFA]/20 ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {getStatusIcon(report.status)}
                      <span className="capitalize">{report.status}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() =>
                        navigate(`/report-deatils/${report.reportId}`)
                      }
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200 bg-blue-900/20 px-3 py-1 rounded-lg"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CitizenReport
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        onSuccess={fetchReports}
      />
    </div>
  );
}

export default CitizenDashboard;
