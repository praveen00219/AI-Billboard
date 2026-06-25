import { AlertTriangle, CheckCircle, Clock, MapPin, Scan, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import MapFilters from "../../component/hmComponent/MapFilters";
import MapLegend from "../../component/hmComponent/MapLegend";
import ViolationMapPage from "../../component/hmComponent/ViolationMapPage";
import { useAuth } from "../../middleware/AuthController";
import { UseRollBased } from "../../middleware/RollBasedAccessController";
import { normalizeReports } from "./NormalizeReports";
import { reportApi } from "../../api/report.api";
import apiClient from "../../api/apiClient";

function HeatMapPage() {
  const { authenticated } = useAuth();
  const { type } = UseRollBased();

  const [originalReports, setOriginalReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);

  const [highRisk, setHighRisk] = useState(0);
  const [mediumRisk, setMediumRisk] = useState(0);
  const [lowRisk, setLowRisk] = useState(0);
  const [totalReports, setTotalReports] = useState(0);

  const fetchReportDetails = async () => {
    try {
      let data = [];
      if (type === "citizen") {
        const res = await reportApi.getAuthReporting();
        data = res.reports || [];
      } else if (type === "authority") {
        const res = await apiClient.get("/admin/violations");
        data = res.data || [];
      }

      if (Array.isArray(data)) {
        const cleaned = normalizeReports(data);
        setOriginalReports(cleaned);
        setFilteredReports(cleaned);
      } else {
        setOriginalReports([]);
        setFilteredReports([]);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      setOriginalReports([]);
      setFilteredReports([]);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchReportDetails();
    }
  }, [authenticated, type]);

  useEffect(() => {
    let high = 0;
    let medium = 0;
    let low = 0;

    originalReports.forEach((report) => {
      const level = (report.risk_level || "").toLowerCase();
      if (level === "high") high++;
      else if (level === "medium") medium++;
      else if (level === "low") low++;
    });

    setTotalReports(originalReports.length);
    setHighRisk(high);
    setMediumRisk(medium);
    setLowRisk(low);
  }, [originalReports]);

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-[#fafafa] font-['Inter'] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />
        <AlertTriangle size={64} className="text-red-500 mb-6 animate-pulse" />
        <h1 className="text-2xl font-bold tracking-widest uppercase mb-2">Access Denied</h1>
        <p className="text-red-400 font-mono text-sm">System requires active authenticated link.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto bg-[#050505] text-white min-h-screen font-['Inter'] relative overflow-hidden">
      
      {/* Background Matrix & Gradients */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0 opacity-50" />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none z-0" />
      
      <div className="relative z-10 px-4 py-12 max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Live Telemetry</span>
            </div>
            <h1 className="font-black text-4xl sm:text-5xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 flex items-center gap-4">
              Global Heatmap <Activity className="text-cyan-400" size={32} />
            </h1>
            <p className="text-gray-400 max-w-2xl mt-4 leading-relaxed font-mono text-sm">
              <span className="text-cyan-500 mr-2">{">"}</span>
              Geospatial visualization of all detected billboard anomalies. Monitor city-wide compliance and deploy field teams directly to high-risk zones.
            </p>
          </div>
          
          <div className="px-5 py-3 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md flex items-center gap-4">
            <Scan className="text-cyan-500 animate-[spin_4s_linear_infinite]" size={24} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Grid Status</p>
              <p className="text-sm font-bold text-white mt-0.5">ONLINE / ACTIVE</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              title: "Total Anomalies",
              value: totalReports,
              desc: "All registered infractions",
              icon: MapPin,
              color: "text-white",
              bg: "bg-white/5 border-white/10",
              glow: "group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            },
            {
              title: "Critical Priority",
              value: highRisk,
              desc: "Immediate action required",
              icon: AlertTriangle,
              color: "text-red-500",
              bg: "bg-red-500/5 border-red-500/20",
              glow: "group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
            },
            {
              title: "Elevated Risk",
              value: mediumRisk,
              desc: "Pending structural review",
              icon: Clock,
              color: "text-yellow-400",
              bg: "bg-yellow-500/5 border-yellow-500/20",
              glow: "group-hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]"
            },
            {
              title: "Low Risk",
              value: lowRisk,
              desc: "Minor compliance issues",
              icon: CheckCircle,
              color: "text-green-400",
              bg: "bg-green-500/5 border-green-500/20",
              glow: "group-hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]"
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl p-5 border backdrop-blur-sm transition-all duration-300 ${item.bg} ${item.glow}`}
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <p className="font-bold text-xs uppercase tracking-wider text-gray-400">{item.title}</p>
                <div className={`p-1.5 rounded-lg bg-black/50 ${item.color}`}>
                  <item.icon size={16} />
                </div>
              </div>
              <div className="relative z-10">
                <p className={`font-black text-4xl mb-1 ${item.color}`}>
                  {item.value}
                </p>
                <p className="text-gray-500 text-[11px] font-mono uppercase tracking-wider">{item.desc}</p>
              </div>
              
              {/* Decorative Corner */}
              <div className="absolute bottom-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                <div className="w-4 h-4 border-b-2 border-r-2 border-current text-white/50" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          <div className="xl:w-1/4 space-y-6">
            <MapFilters
              originalReports={originalReports}
              setReports={setFilteredReports}
            />
            <MapLegend />
          </div>
          
          <div className="xl:w-3/4 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative group bg-[#0A0A0A] h-[600px] xl:h-[800px]">
             {/* Scanner Bar on Map */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-[scanner_3s_ease-in-out_infinite] z-20 pointer-events-none" />
            
            {/* Target Reticle Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-cyan-500/20 rounded-full z-10 pointer-events-none flex items-center justify-center">
               <div className="w-2 h-2 bg-cyan-500/50 rounded-full" />
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-4 bg-cyan-500/50" />
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[2px] h-4 bg-cyan-500/50" />
               <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-[2px] bg-cyan-500/50" />
               <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-[2px] bg-cyan-500/50" />
            </div>

            <ViolationMapPage
              reports={filteredReports}
              setReports={setFilteredReports}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeatMapPage;
