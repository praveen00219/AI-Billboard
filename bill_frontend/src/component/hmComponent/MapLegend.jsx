import { AlertTriangle, CheckCircle, Clock, XCircle, Shield, Target } from "lucide-react";

function MapLegend() {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-gradient-to-b from-[#0A0A0A] to-[#050505] p-6 text-white shadow-xl backdrop-blur-md relative overflow-hidden font-['Inter'] mt-6">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 relative z-10 border-b border-white/10 pb-4">
        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
          <Target size={18} />
        </div>
        <div>
          <h2 className="font-bold text-lg tracking-wide uppercase">HUD Legend</h2>
          <p className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mt-1">
            Visual Guide
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-8 relative z-10">
        
        <div className="flex flex-col space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-white/5 pb-2">Resolution Status</h4>
          <div className="flex flex-col space-y-3">
            <span className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded px-3 py-1.5 text-xs font-mono font-bold text-yellow-400 w-max">
              <Clock size={14} /> PENDING
            </span>
            <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded px-3 py-1.5 text-xs font-mono font-bold text-blue-400 w-max">
              <AlertTriangle size={14} /> UNDER REVIEW
            </span>
            <span className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded px-3 py-1.5 text-xs font-mono font-bold text-green-400 w-max">
              <CheckCircle size={14} /> APPROVED
            </span>
            <span className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded px-3 py-1.5 text-xs font-mono font-bold text-red-400 w-max">
              <XCircle size={14} /> REJECTED
            </span>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-white/5 pb-2">
            Risk Classification
          </h4>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">High Priority</div>
                <div className="text-[10px] text-gray-500 font-mono">Critical structural/safety hazard</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]"></span>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">Medium Risk</div>
                <div className="text-[10px] text-gray-500 font-mono">Moderate compliance violation</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">Low Risk</div>
                <div className="text-[10px] text-gray-500 font-mono">Minor informational flags</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-white/5 pb-2">
            Anomaly Types
          </h4>
          <div className="flex flex-col space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                SIZE
              </span>
              <span className="text-[11px] text-gray-400">Dimensions exceed specs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                PLACEMENT
              </span>
              <span className="text-[11px] text-gray-400">Illegal structural loc</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                CONTENT
              </span>
              <span className="text-[11px] text-gray-400">Prohibited visual media</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                HAZARD
              </span>
              <span className="text-[11px] text-gray-400">Direct safety threat</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-white/5 pb-2">
            Field Operations
          </h4>
          <ul className="text-[11px] text-gray-400 space-y-2 font-mono">
            <li className="flex items-start gap-2">
              <span className="text-cyan-500">{">"}</span> Transmit precise visual data
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500">{">"}</span> Tag accurate GPS coordinates
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500">{">"}</span> Classify hazard severity
            </li>
            <li className="flex items-start gap-2 mt-2 pt-2 border-t border-white/5 text-gray-500 text-[10px]">
              <Shield size={10} className="inline mr-1" /> Maintains grid compliance
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MapLegend;