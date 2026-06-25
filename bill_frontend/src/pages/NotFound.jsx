import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-['Inter']">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 text-center max-w-lg w-full">
        {/* Animated Glitch Text */}
        <div className="relative inline-block mb-6 group">
          <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 select-none relative z-10">
            404
          </h1>
          <h1 className="text-8xl md:text-9xl font-black text-red-500 absolute top-0 left-[2px] -z-10 animate-pulse opacity-50">
            404
          </h1>
          <h1 className="text-8xl md:text-9xl font-black text-cyan-500 absolute -top-[2px] -left-[2px] -z-10 animate-pulse opacity-50" style={{ animationDelay: '0.1s' }}>
            404
          </h1>
          
          <div className="absolute -inset-x-6 top-1/2 h-[2px] bg-red-500/50 -translate-y-1/2 group-hover:h-[4px] transition-all duration-300" />
        </div>

        <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-8">
          <FaExclamationTriangle className="text-red-500" />
          <span className="text-sm font-mono font-bold tracking-widest text-red-400 uppercase">
            Sector Not Found
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
          Dead End / Signal Lost
        </h2>
        
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-10 font-mono">
          The requested coordinate does not exist in our databanks. The transmission might be corrupted or the node has been permanently retired.
        </p>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1"
        >
          <FaHome size={18} />
          <span>RETURN TO BASE</span>
        </button>

        {/* Telemetry Footer */}
        <div className="mt-16 text-center">
          <p className="text-[10px] font-mono font-bold text-gray-600 tracking-widest uppercase">
            System Error Protocol &bull; Edge Node Terminated
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
