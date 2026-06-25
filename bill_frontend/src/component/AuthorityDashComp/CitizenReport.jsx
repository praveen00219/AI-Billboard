import { useNavigate } from "react-router-dom";
function CitizenReports({ mockReports, getStatusIcon, getStatusColor }) {
  const navigate = useNavigate();
  return (
    <div className="bg-[#0A0A0A]/90 backdrop-blur-md rounded-xl shadow-md overflow-hidden border border-[#FAFAFA]/20 mb-6 mt-2">
      <div className="p-6 border-b border-[#FAFAFA]/20">
        <h2 className="text-3xl font-extrabold text-[#E5E7EB]">Your Reports</h2>
        <p className="text-sm text-gray-400 mt-2">
          History of all violation reports you've submitted
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
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
              <th className="p-4 text-sm font-semibold text-[#E5E7EB]">Date</th>
              <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                Status
              </th>
              <th className="p-4 text-sm font-semibold text-[#E5E7EB]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {mockReports.map((report) => (
              <tr
                key={report.id}
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
                  {report.location.address}
                </td>
                <td className="p-4 text-gray-300">
                  {new Date(report.timestamp).toLocaleDateString()}
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
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                    onClick={() => navigate(`/report-deatils/${report.id}`)}
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
  );
}

export default CitizenReports;