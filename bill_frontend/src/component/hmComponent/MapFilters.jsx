import { Filter, Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import { useState } from "react";

function MapFilters({ originalReports, setReports }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [category, setCategory] = useState("All categories");
  const [risk, setRisk] = useState("All risk levels");

  const handleSubmit = (e) => {
    e.preventDefault();

    const filtered = originalReports?.filter((report) => {
      const matchesSearch =
        search.trim() === "" ||
        report.title?.toLowerCase().includes(search.toLowerCase()) ||
        report.description?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All statuses" ||
        report.status?.toLowerCase() === status.toLowerCase();

      const matchesCategory =
        category === "All categories" ||
        report.category?.toLowerCase() === category.toLowerCase() ||
        (category.toLowerCase() === "hazard" &&
          report.category?.toLowerCase().includes("hazard")) ||
        (category.toLowerCase() === "size" &&
          report.category?.toLowerCase().includes("size")) ||
        (category.toLowerCase() === "placement" &&
          report.category?.toLowerCase().includes("placement")) ||
        (category.toLowerCase() === "content" &&
          report.category?.toLowerCase().includes("content"));

      const matchesRisk =
        risk === "All risk levels" ||
        report.risk_level?.toLowerCase() === risk.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory && matchesRisk;
    });

    setReports(filtered);
  };

  const handleReset = () => {
    setSearch("");
    setStatus("All statuses");
    setCategory("All categories");
    setRisk("All risk levels");
    setReports(originalReports);
  };

  const selectClasses =
    "w-full rounded-xl border border-white/10 bg-black/50 py-3 px-4 text-sm text-[#fafafa] transition duration-200 ease-in-out hover:bg-white/5 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none appearance-none cursor-pointer";

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-gradient-to-b from-[#0A0A0A] to-[#050505] p-6 text-white shadow-xl backdrop-blur-md relative overflow-hidden font-['Inter']">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
              <SlidersHorizontal size={18} />
            </div>
            <h2 className="font-bold text-lg tracking-wide uppercase">Telemetry Filters</h2>
          </div>
          <p className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mt-2 ml-11">
            Refine coordinate dataset
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        onReset={handleReset}
        className="space-y-5 relative z-10"
      >
        <div className="flex flex-col">
          <label htmlFor="search" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            Keyword Query
          </label>
          <div className="relative group">
            <input
              id="search"
              type="search"
              placeholder="Search anomalies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-11 pr-4 text-sm placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white"
            />
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col relative">
            <label htmlFor="status" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Resolution Status
            </label>
            <div className="relative">
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={selectClasses}
              >
                <option className="bg-[#0A0A0A] text-white">All statuses</option>
                <option className="bg-[#0A0A0A] text-white">Pending</option>
                <option className="bg-[#0A0A0A] text-white">Approved</option>
                <option className="bg-[#0A0A0A] text-white">Rejected</option>
                <option className="bg-[#0A0A0A] text-white">Under Review</option>
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-4 h-4" />
            </div>
          </div>

          <div className="flex flex-col relative">
            <label htmlFor="category" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Infraction Type
            </label>
            <div className="relative">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClasses}
              >
                <option className="bg-[#0A0A0A] text-white">All categories</option>
                <option className="bg-[#0A0A0A] text-white">Size</option>
                <option className="bg-[#0A0A0A] text-white">Placement</option>
                <option className="bg-[#0A0A0A] text-white">Content</option>
                <option className="bg-[#0A0A0A] text-white">Hazard</option>
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-4 h-4" />
            </div>
          </div>

          <div className="flex flex-col relative">
            <label htmlFor="risk" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Risk Level
            </label>
            <div className="relative">
              <select
                id="risk"
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
                className={selectClasses}
              >
                <option className="bg-[#0A0A0A] text-white">All risk levels</option>
                <option className="bg-[#0A0A0A] text-white">High</option>
                <option className="bg-[#0A0A0A] text-white">Medium</option>
                <option className="bg-[#0A0A0A] text-white">Low</option>
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-cyan-500/10 border border-cyan-500/50 hover:bg-cyan-500 hover:text-black py-3 px-4 text-xs font-bold uppercase tracking-widest text-cyan-400 transition-all duration-300"
          >
            Execute Filter
          </button>
          <button
            type="reset"
            className="rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/20 py-3 px-4 text-red-400 transition-all flex items-center justify-center group"
            title="Reset Filters"
          >
            <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default MapFilters;
