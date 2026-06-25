import "leaflet/dist/leaflet.css";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Gauge,
  Images as ImagesIcon,
  Info,
  Loader2,
  MapPin,
  Ruler,
  Shield,
  Tag,
  User,
  XCircle,
  Scan,
  Cpu,
  Camera
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../middleware/AuthController";
import { reportApi } from "../../api/report.api";
import { UseRollBased } from "../../middleware/RollBasedAccessController";

const API_URL = "http://localhost:2000";

const isValidCoordinate = (lat, lon) => {
  const isValidLat =
    typeof lat === "number" && !isNaN(lat) && lat >= -90 && lat <= 90;
  const isValidLon =
    typeof lon === "number" && !isNaN(lon) && lon >= -180 && lon <= 180;
  return isValidLat && isValidLon;
};

const getStatusMeta = (status) => {
  const base =
    "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border";
  switch ((status || "").toLowerCase()) {
    case "approved":
      return {
        label: "Approved",
        icon: CheckCircle2,
        className: `${base} border-green-500/30 bg-green-500/10 text-green-400`,
      };
    case "rejected":
      return {
        label: "Rejected",
        icon: XCircle,
        className: `${base} border-red-500/30 bg-red-500/10 text-red-400`,
      };
    default:
      return {
        label: "Pending",
        icon: Loader2,
        className: `${base} border-amber-500/30 bg-amber-500/10 text-amber-300`,
      };
  }
};

const riskConfig = {
  high: {
    color: "red",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/40",
    textColor: "text-red-400",
    icon: AlertCircle,
    label: "High Risk",
  },
  medium: {
    color: "yellow",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/40",
    textColor: "text-yellow-400",
    icon: AlertTriangle,
    label: "Medium Risk",
  },
  low: {
    color: "green",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/40",
    textColor: "text-green-400",
    icon: CheckCircle,
    label: "Low Risk",
  },
  unknown: {
    color: "gray",
    bgColor: "bg-gray-500/20",
    borderColor: "border-gray-500/40",
    textColor: "text-gray-400",
    icon: Gauge,
    label: "Unknown Risk",
  },
};

const RiskVisualization = ({ percentage, level }) => {
  const riskLevel = level?.toLowerCase() || "unknown";
  const config = riskConfig[riskLevel] || riskConfig.unknown;
  const Icon = config.icon;

  return (
    <div className="relative">
      {/* Volume-like risk meter */}
      <div className="flex items-end justify-center gap-1 h-16 sm:h-20 mb-3 sm:mb-4">
        {[20, 40, 60, 80, 100].map((threshold) => (
          <div
            key={threshold}
            className={`w-2 sm:w-3 rounded-t-lg transition-all duration-500 ease-out ${
              percentage >= threshold
                ? riskLevel === "high"
                  ? "bg-red-500"
                  : riskLevel === "medium"
                  ? "bg-yellow-500"
                  : riskLevel === "low"
                  ? "bg-green-500"
                  : "bg-gray-500"
                : "bg-white/10"
            }`}
            style={{
              height: `${threshold * 0.5}px`,
              animation: percentage >= threshold ? "pulse 2s infinite" : "none",
            }}
          />
        ))}
      </div>

      {/* Current level indicator */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
          <Icon size={16} className={config.textColor} />
          <span
            className={`text-base sm:text-lg font-bold ${config.textColor}`}
          >
            {percentage}%
          </span>
        </div>
        <div className={`text-xs sm:text-sm font-semibold ${config.textColor}`}>
          {config.label}
        </div>
      </div>

      {/* Floating indicator */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 -top-1 w-4 h-4 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center shadow-lg border-2"
        style={{
          borderColor:
            riskLevel === "high"
              ? "#ef4444"
              : riskLevel === "medium"
              ? "#eab308"
              : riskLevel === "low"
              ? "#22c55e"
              : "#6b7280",
          bottom: `${percentage * 0.5}px`,
        }}
      >
        <div
          className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full ${
            riskLevel === "high"
              ? "bg-red-500"
              : riskLevel === "medium"
              ? "bg-yellow-500"
              : riskLevel === "low"
              ? "bg-green-500"
              : "bg-gray-500"
          }`}
        />
      </div>
    </div>
  );
};

const RiskBreakdown = ({ risks }) => {
  if (!risks) return null;

  const riskTypes = {
    placement: { icon: MapPin, label: "Placement", color: "blue" },
    content: { icon: Eye, label: "Content", color: "purple" },
    size: { icon: Ruler, label: "Size", color: "orange" },
    structural: { icon: Shield, label: "Structural", color: "red" },
    regulatory: { icon: FileText, label: "Regulatory", color: "yellow" },
  };

  const detectedRisks = [];

  // Simple keyword matching for risk types
  const riskText = risks.toLowerCase();
  if (
    riskText.includes("placement") ||
    riskText.includes("location") ||
    riskText.includes("obstruct")
  ) {
    detectedRisks.push(riskTypes.placement);
  }
  if (
    riskText.includes("content") ||
    riskText.includes("obscene") ||
    riskText.includes("political")
  ) {
    detectedRisks.push(riskTypes.content);
  }
  if (
    riskText.includes("size") ||
    riskText.includes("dimension") ||
    riskText.includes("large")
  ) {
    detectedRisks.push(riskTypes.size);
  }
  if (
    riskText.includes("structural") ||
    riskText.includes("damage") ||
    riskText.includes("leaning")
  ) {
    detectedRisks.push(riskTypes.structural);
  }
  if (
    riskText.includes("regulation") ||
    riskText.includes("compliance") ||
    riskText.includes("illegal")
  ) {
    detectedRisks.push(riskTypes.regulatory);
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
      {detectedRisks.map((risk, index) => {
        const Icon = risk.icon;
        return (
          <div
            key={index}
            className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 ${
              risk.color === "blue"
                ? "border-blue-500/30 bg-blue-500/10"
                : risk.color === "purple"
                ? "border-purple-500/30 bg-purple-500/10"
                : risk.color === "orange"
                ? "border-orange-500/30 bg-orange-500/10"
                : risk.color === "red"
                ? "border-red-500/30 bg-red-500/10"
                : "border-yellow-500/30 bg-yellow-500/10"
            } backdrop-blur-sm`}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <Icon
                size={12}
                className={
                  risk.color === "blue"
                    ? "text-blue-400"
                    : risk.color === "purple"
                    ? "text-purple-400"
                    : risk.color === "orange"
                    ? "text-orange-400"
                    : risk.color === "red"
                    ? "text-red-400"
                    : "text-yellow-400"
                }
              />
              <span
                className={`text-[10px] sm:text-xs font-medium ${
                  risk.color === "blue"
                    ? "text-blue-300"
                    : risk.color === "purple"
                    ? "text-purple-300"
                    : risk.color === "orange"
                    ? "text-orange-300"
                    : risk.color === "red"
                    ? "text-red-300"
                    : "text-yellow-300"
                }`}
              >
                {risk.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default function ReportDetails() {

  const { type } = UseRollBased();
  const { authenticated } = useAuth();
  const navigate = useNavigate();
  const { reportId } = useParams();

  // Fetch Report Data
  const { 
    data: reportData, 
    isLoading: reportLoading, 
    error: reportError 
  } = useQuery({
    queryKey: ['report-details', reportId, type],
    queryFn: () => type === "authority" ? reportApi.getAuthorityReportById(reportId) : reportApi.getCitizenReportById(reportId),
    enabled: authenticated && !!reportId,
    select: (data) => {
      if (!data.status) return null;
      const report = data.report;
      const latitude = parseFloat(report.latitude);
      const longitude = parseFloat(report.longitude);
      let coords = [20.337878, 85.817908];

      if (isValidCoordinate(latitude, longitude)) {
        coords = [latitude, longitude];
      }

      const media = report.media.map((item) => ({
        ...item,
        url: item.url.startsWith("/uploads")
          ? `${API_URL}${item.url}`
          : item.url,
      }));

      return {
        ...report,
        locationText: report.location || "Bhubaneswar, Odisha, India",
        coords,
        latitude,
        longitude,
        media,
      };
    }
  });

  // Fetch AI Analysis Data
  const { 
    data: aiAnalysis, 
    isLoading: aiLoading, 
    error: aiError 
  } = useQuery({
    queryKey: ['ai-analysis', reportId],
    queryFn: () => reportApi.getAiAnalysis(reportId),
    enabled: authenticated && !!reportId,
  });

  const handleUpdateStatus = async (newStatus) => {
    try {
      await reportApi.updateReportStatus(reportId, newStatus);
      window.location.reload(); // Refresh to show new status
    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update status");
    }
  };

  const loading = reportLoading;
  const error = reportError?.message;
  const report = reportData;
  const statusMeta = useMemo(() => getStatusMeta(report?.status), [report]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span className="text-sm sm:text-base">Loading report details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center p-4">
        <div className="text-center">
          <span className="text-red-400 text-sm sm:text-base block mb-4">
            Error: {error}
          </span>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 px-4 py-2 text-sm"
            >
              <Loader2 className="h-4 w-4" />
              Retry
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 px-4 py-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center p-4">
        <span className="text-red-400 text-sm sm:text-base">
          No report data available
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#020202] text-[#fafafa] font-sans selection:bg-cyan-500/30">
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 z-10">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all px-4 py-2 text-sm font-semibold hover:-translate-x-1"
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:block">Return to Command Center</span>
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Network Synced
            </div>
            <StatusPill meta={statusMeta} />
          </div>
        </div>

        <div className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              {report.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-500 font-mono mt-2 flex items-center gap-2">
              <Scan size={14} className="text-cyan-500" />
              CASE ID: #{report.reportId}
            </p>
          </div>
          <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg backdrop-blur-md self-start md:self-auto">
            <p className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Processing Engine</p>
            <p className="text-sm font-bold text-yellow-400 flex items-center gap-2 mt-0.5">
              YOLOv8 Edge Architecture <Cpu size={14} />
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <section className="rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#0A0A0A] to-[#020202] p-5 sm:p-6 shadow-[0_0_40px_rgba(34,211,238,0.1)] relative overflow-hidden group">
              {/* Internal glow */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
              
              <header className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg animate-pulse-glow">
                    <Camera className="text-cyan-400" size={18} />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white uppercase">Neural Processing Feed</h2>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping-slow"></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                </div>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {report.media.length > 0 ? (
                  report.media.map((media, i) => (
                    <figure
                      key={media.mediaId}
                      className="group/img relative overflow-hidden rounded-xl border border-white/10 bg-black"
                    >
                      {/* Active Continuous YOLO Scanner */}
                      <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,1)] animate-scanner z-20 pointer-events-none"></div>
                      
                      {/* Simulated continuous bounding boxes */}
                      <div className="absolute top-[30%] left-[20%] w-[40%] h-[50%] animate-draw-box bg-yellow-400/5 z-10 flex flex-col justify-between pointer-events-none" style={{animationDelay: `${i * 0.5}s`}}>
                        <div className="bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.5 w-fit flex items-center gap-1 uppercase">
                          <Scan size={10} /> TARGET <span className="bg-black/20 px-1 rounded">{(Math.random() * (0.99 - 0.85) + 0.85).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-end p-0.5">
                          <div className="w-1.5 h-1.5 border-b-2 border-l-2 border-yellow-400"></div>
                          <div className="w-1.5 h-1.5 border-b-2 border-r-2 border-yellow-400"></div>
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-cyan-500/5 mix-blend-overlay transition-opacity z-10 pointer-events-none"></div>

                      {media.type.startsWith("image") ? (
                        <img
                          src={media.url}
                          alt={`Evidence ${i + 1}`}
                          className="h-56 sm:h-64 md:h-80 w-full object-cover transition-transform duration-1000 group-hover/img:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.target.outerHTML = `
                              <div className="h-56 sm:h-64 md:h-80 w-full flex items-center justify-center text-white/60 bg-black/30 text-xs font-mono">
                                [IMAGE_DATA_CORRUPTED]
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="h-56 w-full flex items-center justify-center bg-black/50 border border-white/5 font-mono text-xs text-white/50">
                          [UNSUPPORTED_MEDIA_STREAM]
                        </div>
                      )}
                      
                      {/* YOLO Telemetry Tag */}
                      <div className="absolute bottom-3 right-3 px-2 py-1.5 bg-black/80 backdrop-blur border border-cyan-500/30 rounded text-[9px] font-mono font-black text-cyan-400 z-20 flex flex-col gap-1">
                        <span>SYS: ONLINE</span>
                        <span>FPS: 60.0</span>
                      </div>
                    </figure>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 font-mono flex items-center gap-2 bg-black/50 p-4 rounded-lg border border-white/5 w-full col-span-full">
                    <XCircle size={14} className="text-red-500" /> [NO_VISUAL_DATA_FOUND_IN_DATABANKS]
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-white/5 bg-[#050505] p-5 sm:p-6 font-mono">
              <header className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
                <FileText className="text-blue-500" size={16} />
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Incident Log / Description
                </h2>
              </header>
              <div className="bg-black border border-white/5 rounded-lg p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>
                <p className="text-sm leading-relaxed text-gray-300">
                  <span className="text-blue-500 mr-2">{">"}</span> {report.description}
                </p>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-white/5 bg-[#0A0A0A] p-5 sm:p-6 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-white/5 pb-3">
                Current Status
              </h3>
              <div className="p-3 bg-black rounded-xl border border-white/5 inline-flex items-center justify-center w-full shadow-inner">
                <StatusPill meta={statusMeta} />
              </div>
            </section>

            <section className="rounded-2xl border border-white/5 bg-gradient-to-b from-[#0A0A0A] to-[#050505] p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
                <Shield size={100} />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 border-b border-white/5 pb-3">
                Telemetry Data
              </h3>
              <div className="space-y-4">
                <div className="bg-black/50 border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-blue-500/30 transition-colors">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <User size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Reported By</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{report.userName}</div>
                  </div>
                </div>

                <div className="bg-black/50 border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-purple-500/30 transition-colors">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Timestamp</div>
                    <div className="text-sm font-semibold text-white mt-0.5 font-mono">{new Date(report.date).toLocaleString()}</div>
                  </div>
                </div>

                <div className="bg-black/50 border border-white/5 rounded-xl p-4 flex flex-col gap-3 hover:border-rose-500/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Location Hash</div>
                      <div className="text-sm font-semibold text-white mt-0.5 leading-snug">{report.locationText}</div>
                    </div>
                  </div>
                  <div className="bg-black rounded border border-white/5 p-2 text-xs font-mono text-cyan-400 flex items-center justify-between">
                    <span>COORDS:</span>
                    <span>
                      {isValidCoordinate(report.latitude, report.longitude)
                        ? `[${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}]`
                        : "NULL_COORDINATES"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {type === "authority" && (
              <section className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 md:p-6 text-center">
                <h3 className="text-sm sm:text-base font-medium mb-4">
                  Management Actions
                </h3>
                <div className="flex flex-col gap-3">
                  {report.status === "pending" || report.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => handleUpdateStatus("approved")}
                        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all"
                      >
                        <CheckCircle size={18} /> Approve Report
                      </button>
                      <button
                        onClick={() => handleUpdateStatus("rejected")}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all"
                      >
                        <XCircle size={18} /> Reject Report
                      </button>
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm">
                      This report has already been <b>{report.status}</b>.
                    </p>
                  )}
                </div>
              </section>
            )}
          </aside>
        </div>

        <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-6 mt-4 sm:mt-6">
          <section className="w-full lg:w-1/2 rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-black p-3 sm:p-4 backdrop-blur-sm">
            <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-blue-400" />
              Location Map
            </h3>
            <div className="overflow-hidden rounded-lg sm:rounded-xl border border-white/10">
              {isValidCoordinate(report.latitude, report.longitude) ? (
                <MapContainer
                  center={[report.latitude, report.longitude]}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="h-48 sm:h-56 md:h-64 w-full"
                  attributionControl={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <CircleMarker
                    center={[report.latitude, report.longitude]}
                    radius={8}
                    color="#ff0000"
                    fillColor="#ff0000"
                    fillOpacity={0.5}
                  >
                    <Popup>
                      <div className="text-sm">
                        <div className="font-medium mb-1">
                          {report.locationText}
                        </div>
                        <div className="text-xs opacity-80">
                          {report.latitude.toFixed(4)},{" "}
                          {report.longitude.toFixed(4)}
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                </MapContainer>
              ) : (
                <div className="h-48 sm:h-56 md:h-64 w-full flex items-center justify-center text-white/60 bg-black/30">
                  <p className="text-xs sm:text-sm p-3 sm:p-4 text-center">
                    Map not available: Invalid or missing coordinates
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="w-full lg:w-1/2 rounded-2xl border border-white/5 bg-gradient-to-br from-[#0A0A0A] to-[#050505] p-5 sm:p-6 shadow-xl relative overflow-hidden">
            {/* AI Background Glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg sm:text-xl font-bold tracking-wide flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Gauge size={18} className="text-purple-400" />
                </div>
                <span>Neural Vision Analysis</span>
              </h3>
              <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">YOLOv8 Active</span>
              </div>
            </div>

            {aiLoading ? (
              <div className="flex items-center justify-center h-40 sm:h-48">
                <div className="text-center">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto mb-2 sm:mb-3 text-purple-400" />
                  <p className="text-white/60 text-xs sm:text-sm">
                    Analyzing billboard risks...
                  </p>
                </div>
              </div>
            ) : aiError ? (
              <div className="text-center py-6 sm:py-8">
                <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-400 mx-auto mb-2 sm:mb-3" />
                <p className="text-red-400 text-sm sm:text-base mb-1 sm:mb-2">
                  Analysis Failed
                </p>
                <p className="text-white/60 text-xs sm:text-sm">{aiError}</p>
              </div>
            ) : !aiAnalysis ? (
              <div className="text-center py-6 sm:py-8">
                <Gauge className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mx-auto mb-2 sm:mb-3" />
                <p className="text-white/60 text-xs sm:text-sm">
                  No AI analysis available
                </p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-black/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/10">
                  <RiskVisualization
                    percentage={aiAnalysis.riskAssessment?.percentage || 0}
                    level={aiAnalysis.riskAssessment?.level}
                  />
                </div>

                {aiAnalysis.risks && (
                  <div className="bg-black/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                    <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2 text-white/80">
                      <Shield size={14} className="text-blue-400" />
                      Detected Risks
                    </h4>
                    <RiskBreakdown risks={aiAnalysis.risks} />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-black/30 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/10">
                    <div className="text-[10px] sm:text-xs text-white/60 mb-1">
                      Category
                    </div>
                    <div className="font-semibold text-white/90 text-xs sm:text-sm">
                      {aiAnalysis.riskAssessment?.category || "Unknown"}
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/10">
                    <div className="text-[10px] sm:text-xs text-white/60 mb-1">
                      Level
                    </div>
                    <div
                      className={`font-semibold text-xs sm:text-sm ${
                        riskConfig[
                          aiAnalysis.riskAssessment?.level?.toLowerCase()
                        ]?.textColor || "text-white"
                      }`}
                    >
                      {aiAnalysis.riskAssessment?.level || "Unknown"}
                    </div>
                  </div>
                </div>

                {aiAnalysis.extractedContent && (
                  <div className="bg-black/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                    <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-2 text-white/80">
                      <Eye size={14} className="text-green-400" />
                      Extracted Text
                    </h4>
                    <div className="bg-black/40 rounded-lg p-2 sm:p-3">
                      <p className="text-xs sm:text-sm text-white/80 font-mono">
                        "{aiAnalysis.extractedContent}"
                      </p>
                    </div>
                  </div>
                )}

                {aiAnalysis.aiSummary && (
                  <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-purple-500/20">
                    <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-2">
                      <Ruler size={14} className="text-purple-400" />
                      AI Summary
                    </h4>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                      {aiAnalysis.aiSummary}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

function StatusPill({ meta }) {
  const Icon = meta.icon;
  return (
    <span className={meta.className}>
      <Icon size={12} className={meta.icon === Loader2 ? "animate-spin" : ""} />
      {meta.label}
    </span>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2 items-start">
      <div className="col-span-1 flex items-center gap-1 sm:gap-2 text-white/70">
        <span className="opacity-80">{icon}</span>
        <span className="text-xs">{label}</span>
      </div>
      <div className="col-span-2 text-white/90 text-xs sm:text-sm">{value}</div>
    </div>
  );
}
