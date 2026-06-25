import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AllCitizens } from "../../hooks/Authority/AllCitizenList";

function CitizenList() {
  const { citizens, loading, error } = AllCitizens();
  const navigate = useNavigate();

  const handleReportView = (reportId) => {
    navigate(`/reports/${reportId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#fafafa]">
        Loading citizens...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] p-4 sm:p-6">
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-teal-300 drop-shadow-md">
        Citizen List
      </h2>
      <div className="bg-[#0a0a0a] rounded-xl p-5 shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th className="py-3 px-4 text-xs uppercase">Name</th>
              <th className="py-3 px-4 text-xs uppercase">Email</th>
              <th className="py-3 px-4 text-xs uppercase">Phone</th>
              <th className="py-3 px-4 text-xs uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {citizens.map((citizen) => (
              <tr
                key={citizen.userId}
                className="hover:bg-gray-900 transition-colors duration-300 border-b border-gray-700"
              >
                <td className="py-3 px-4 text-lg font-semibold text-blue-300">
                  {citizen.name}
                </td>
                <td className="py-3 px-4 text-sm text-green-400">
                  {citizen.email}
                </td>
                <td className="py-3 px-4 text-sm text-orange-400">
                  {citizen.phoneNo}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleReportView(citizen.userId)}
                    className="bg-purple-600 hover:bg-purple-700 text-[#fafafa] text-sm px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
                  >
                    <FileText size={18} />
                    See Reports
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {citizens.length === 0 && (
          <p className="text-center text-gray-400 mt-4">No citizens found.</p>
        )}
      </div>
    </div>
  );
}

export default CitizenList;
