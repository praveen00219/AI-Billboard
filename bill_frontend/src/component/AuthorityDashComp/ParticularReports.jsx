import apiClient from "../../api/apiClient";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ParticularReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate=useNavigate();

    const { citizenId } = useParams(); 
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await apiClient.get(
                    `/report/my-reports/${citizenId}`
                );
                if (res.data.status) {
                    setReports(res.data.reports);
                } else {
                    setReports([]);
                }
            } catch (err) {
                console.error("Error fetching reports:", err);
                setError("Failed to fetch reports.");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [citizenId]);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "text-yellow-400 bg-yellow-900/20";
            case "resolved":
                return "text-green-400 bg-green-900/20";
            case "rejected":
                return "text-red-400 bg-red-900/20";
            default:
                return "text-gray-400 bg-gray-900/20";
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "⏳";
            case "resolved":
                return "✅";
            case "rejected":
                return "❌";
            default:
                return "ℹ️";
        }
    };


    const handleReport=(id)=>{
        navigate(`/report-deatils/${id}`);
    }



    if (loading) return <p className="text-gray-400 p-4">Loading reports...</p>;
    if (error) return <p className="text-red-400 p-4">{error}</p>;

    return (
        <>
            <div className="bg-[#0A0A0A]/90 backdrop-blur-md rounded-xl shadow-md overflow-hidden border border-[#FAFAFA]/20">
                <div className="p-6 border-b border-[#FAFAFA]/20">
                    <h2 className="text-3xl font-extrabold text-[#E5E7EB]">
                        Citizen Reports
                    </h2>
                    <p className="text-sm text-gray-400 mt-2">
                        History of all violation reports submitted
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-[#0A0A0A]/95 border-b border-[#FAFAFA]/20">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">Title</th>
                                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">Category</th>
                                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">Location</th>
                                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">Date</th>
                                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">Status</th>
                                <th className="p-4 text-sm font-semibold text-[#E5E7EB]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length > 0 ? (
                                reports.map((report) => (
                                    <tr
                                        key={report.reportId}
                                        className="border-b border-[#FAFAFA]/20 hover:bg-[#0A0A0A]/70 transition-colors duration-200"
                                    >
                                        <td className="p-4 font-medium text-[#E5E7EB]">{report.title}</td>
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
                                                onClick={()=>handleReport(report.reportId)}
                                                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200 bg-blue-900/20 px-3 py-1 rounded-lg"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-4 text-center text-gray-400">
                                        No reports found for this citizen.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default ParticularReports;
