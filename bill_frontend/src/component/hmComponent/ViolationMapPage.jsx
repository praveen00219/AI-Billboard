import { useMemo } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

const RISK_COLORS = {
  high: "#ef4444",
  medium: "#eab308",
  low: "#22c55e",
};

export default function ViolationMapPage({ reports }) {
  const center = useMemo(() => {
    if (!reports.length) return [20.2961, 85.8245]; // Default to Bhubaneswar, India if no reports
    const lat =
      reports.reduce(
        (sum, report) => sum + parseFloat(report.latitude || 0),
        0
      ) / reports.length;
    const lng =
      reports.reduce(
        (sum, report) => sum + parseFloat(report.longitude || 0),
        0
      ) / reports.length;
    return [lat, lng];
  }, [reports]);

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ background: "#050505" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains={["a", "b", "c", "d"]}
        />

        {reports &&
          reports.map((v) => {
            const risk = v.risk_level ? v.risk_level.toLowerCase() : "medium";
            return (
              <CircleMarker
                key={v.id}
                center={[
                  parseFloat(v.latitude || 0),
                  parseFloat(v.longitude || 0),
                ]}
                radius={8}
                pathOptions={{
                  color: RISK_COLORS[risk],
                  fillColor: RISK_COLORS[risk],
                  fillOpacity: 0.8,
                  weight: 2,
                }}
              >
                <Popup className="custom-popup">
                  <div className="bg-black/90 text-white font-['Inter'] p-3 rounded-lg border border-white/10 min-w-[240px] shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                      <h4 className="font-bold text-sm text-cyan-400 truncate max-w-[150px]">
                        {v.title}
                      </h4>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">
                        #{v.id}
                      </span>
                    </div>
                    
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-mono">Risk Level:</span>
                        <span style={{ color: RISK_COLORS[risk] }} className="font-bold uppercase tracking-wider text-[10px]">
                          {risk}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-mono">Status:</span>
                        <span className="text-gray-300 font-semibold">{v.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-mono">Category:</span>
                        <span className="text-gray-300">{v.category}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                        {v.description}
                      </p>
                    </div>
                    
                    <div className="mt-3 text-[9px] text-gray-600 font-mono uppercase tracking-widest text-center">
                      Detected: {new Date(v.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>

      <style>{`
        /* Override default Leaflet popup styles for the high-tech look */
        .custom-popup .leaflet-popup-content-wrapper {
          background: transparent;
          box-shadow: none;
          padding: 0;
          border-radius: 0;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          line-height: normal;
        }
        .custom-popup .leaflet-popup-tip-container {
          display: none;
        }
        .custom-popup a.leaflet-popup-close-button {
          color: #fff;
          top: 12px;
          right: 12px;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
