import {
  AlertTriangle,
  Camera,
  Eye,
  MapPin,
  Shield,
  Users,
  CheckCircle,
  Scan,
} from "lucide-react";
import { Link } from "react-router-dom";
import HomepageImage2 from "../assets/billboard-placement.png";
import HomepageImage1 from "../assets/roadside-billboard.png";
import Button from "../component/Button";
import Card from "../component/Card";
import { useAuth } from "../middleware/AuthController";
import { UseRollBased } from "../middleware/RollBasedAccessController";

function Home() {
  const { authenticated } = useAuth();
  const { type } = UseRollBased();

  return (
    <div className="relative min-h-screen bg-[#020202] text-gray-100 overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Animated Matrix Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern animate-grid opacity-[0.15] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020202]/50 to-[#020202] pointer-events-none" />

      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[150px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[50%] rounded-full bg-purple-600/20 blur-[150px] pointer-events-none animate-float-medium" />
      <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] rounded-full bg-yellow-500/10 blur-[120px] pointer-events-none translate-x-[-50%] animate-float-fast" />

      <div className="relative z-10 space-y-32">
        {/* HERO SECTION */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20">
          <div className="text-center space-y-12">
            <div className="space-y-6 animate-fade-in-up">
              {/* INDIA'S EDGE AI BANNER */}
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-yellow-500/5 border border-yellow-500/20 text-yellow-400 text-sm font-bold mb-4 backdrop-blur-md shadow-[0_0_30px_-5px_rgba(234,179,8,0.3)] animate-pulse-glow">
                <Scan className="w-5 h-5 text-yellow-400 animate-spin-slow" />
                <span className="text-gray-200 uppercase tracking-widest font-black text-xs">India's First Edge AI Platform</span>
                <div className="h-4 w-px bg-yellow-500/30 mx-1"></div>
                <span>Powered by YOLOv8</span>
                <span className="relative flex h-2.5 w-2.5 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1]">
                Real-Time Urban <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 animate-gradient-x drop-shadow-sm">
                  Compliance Grid
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                {type === "citizen"
                  ? "An AI-powered platform for reporting illegal or hazardous billboards. Join hands with your community to maintain urban aesthetics and safety."
                  : "The ultimate AI-powered command center for managing billboard compliance. Empower your authority with real-time detection and seamless workflows."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                to={
                  !authenticated
                    ? "/login"
                    : type === "citizen"
                    ? "/citizen-dashboard"
                    : "/authority-dash"
                }
              >
                <button className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.7)] transition-all duration-300 transform hover:-translate-y-1">
                  {type === "citizen" ? "Start Reporting Now" : "Access Command Center"}
                </button>
              </Link>

              <Link to={authenticated ? "/heatmap" : "/login"}>
                <button className="px-8 py-4 rounded-full font-bold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all duration-300 flex items-center gap-2 group">
                  <MapPin className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  View Public Heatmap
                </button>
              </Link>
            </div>

            <div className="mt-28 relative max-w-5xl mx-auto group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-yellow-500 rounded-3xl blur-[30px] opacity-30 group-hover:opacity-60 transition-opacity duration-700 animate-pulse-glow"></div>
              
              {/* Complex Interactive Image Container */}
              <div className="relative rounded-2xl shadow-2xl border border-white/20 transform group-hover:scale-[1.01] transition-transform duration-700 overflow-hidden bg-black">
                <img
                  src={HomepageImage1}
                  alt="Billboard detection dashboard"
                  className="object-cover w-full h-[450px] sm:h-[600px] opacity-90 group-hover:opacity-100 transition-opacity"
                />
                
                {/* YOLO Scanner Overlay Animation */}
                <div className="absolute left-0 w-full h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,1)] animate-scanner z-20"></div>
                <div className="absolute inset-0 bg-cyan-500/5 mix-blend-overlay pointer-events-none"></div>
                
                {/* Simulated Bounding Box 1 */}
                <div className="absolute top-[20%] left-[25%] w-[35%] h-[40%] animate-draw-box bg-yellow-400/10 z-10 flex flex-col justify-between" style={{animationDelay: '0.5s'}}>
                  <div className="bg-yellow-400 text-black text-[10px] font-black px-2 py-1 w-fit flex items-center gap-2">
                    <Scan className="w-3 h-3" /> BILLBOARD <span className="bg-black/20 px-1 rounded">0.98</span>
                  </div>
                  <div className="flex justify-between items-end p-1">
                    <div className="w-2 h-2 border-b-2 border-l-2 border-yellow-400"></div>
                    <div className="w-2 h-2 border-b-2 border-r-2 border-yellow-400"></div>
                  </div>
                </div>

                {/* Simulated Bounding Box 2 (Violation) */}
                <div className="absolute top-[65%] left-[60%] w-[25%] h-[20%] animate-draw-box bg-red-500/10 z-10 flex flex-col justify-between" style={{animationDelay: '1.5s', border: '2px solid transparent', borderTopColor: '#ef4444'}}>
                  <div className="bg-red-500 text-white text-[10px] font-black px-2 py-1 w-fit flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" /> HAZARD <span className="bg-black/20 px-1 rounded">0.94</span>
                  </div>
                </div>

                {/* Telemetry UI Overlay */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-3 font-mono text-[10px] text-cyan-400 text-right z-30">
                  <div>MODEL: YOLOv8-N</div>
                  <div>FPS: 60.0</div>
                  <div>INF: 12.4ms</div>
                  <div className="text-emerald-400 mt-1">STATUS: SYNCED</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INFINITE TECH MARQUEE */}
        <section className="border-y border-white/5 bg-[#000000] py-4 relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#020202] to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#020202] to-transparent z-10"></div>
          <div className="flex animate-marquee whitespace-nowrap opacity-60">
            {/* Double the content for seamless infinite scrolling */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16 px-8 items-center text-gray-500 font-mono text-sm tracking-widest font-black uppercase">
                <span className="flex items-center gap-2"><Scan className="w-4 h-4"/> YOLOv8 VISION</span>
                <span className="flex items-center gap-2"><Shield className="w-4 h-4"/> GOVT ENFORCEMENT API</span>
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4"/> GEO-SPATIAL MAPPING</span>
                <span className="flex items-center gap-2"><Camera className="w-4 h-4"/> SMART INTAKE PIPELINE</span>
                <span className="flex items-center gap-2"><Eye className="w-4 h-4"/> 12MS INFERENCE</span>
              </div>
            ))}
          </div>
        </section>
        {/* FEATURES SECTION - ADVANCED BENTO GRID */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center space-y-4 mb-20 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white drop-shadow-lg">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">Compliance Core</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
              Enterprise-grade infrastructure running real-time neural networks to keep your urban spaces totally compliant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards using Hyper-Glassmorphism */}
            {[
              {
                icon: <Camera className="h-8 w-8 text-blue-400" />,
                title: type === "citizen" ? "Snap & Report" : "Instant Intake API",
                desc: type === "citizen" ? "Capture violations directly from your phone. Our edge AI pre-processes the image locally." : "High-throughput API designed to ingest thousands of citizen reports securely and instantly.",
                glow: "group-hover:shadow-[0_0_40px_-10px_rgba(96,165,250,0.5)] group-hover:border-blue-500/50"
              },
              {
                icon: <Scan className="h-8 w-8 text-purple-400" />,
                title: "Neural Vision Analysis",
                desc: "Integrated with state-of-the-art YOLO architecture to automatically parse bounding boxes and exact violation classes.",
                glow: "group-hover:shadow-[0_0_40px_-10px_rgba(192,132,252,0.5)] group-hover:border-purple-500/50"
              },
              {
                icon: <Shield className="h-8 w-8 text-emerald-400" />,
                title: type === "citizen" ? "Direct Authority Link" : "Enforcement Dashboard",
                desc: type === "citizen" ? "Data is encrypted and piped directly into the central command center for your municipal enforcement." : "Approve, reject, and monitor compliance pipelines with military-grade encryption.",
                glow: "group-hover:shadow-[0_0_40px_-10px_rgba(52,211,153,0.5)] group-hover:border-emerald-500/50"
              },
              {
                icon: <MapPin className="h-8 w-8 text-rose-400" />,
                title: "Live Geofencing Heatmaps",
                desc: "Every detected anomaly is pinned on a live geospatial grid, highlighting zones with chronic non-compliance.",
                glow: "group-hover:shadow-[0_0_40px_-10px_rgba(251,113,133,0.5)] group-hover:border-rose-500/50"
              },
              {
                icon: <Users className="h-8 w-8 text-amber-400" />,
                title: "Zero-Trust Architecture",
                desc: "Strict role-based access control (RBAC) ensures only verified authorities can modify the master database.",
                glow: "group-hover:shadow-[0_0_40px_-10px_rgba(251,191,36,0.5)] group-hover:border-amber-500/50"
              },
              {
                icon: <AlertTriangle className="h-8 w-8 text-cyan-400" />,
                title: "Automated Triggers",
                desc: "Push webhooks and automated email notifications keep everyone synced when a report status updates.",
                glow: "group-hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.5)] group-hover:border-cyan-500/50"
              }
            ].map((feature, idx) => (
              <div key={idx} className={`group relative p-8 rounded-2xl bg-gradient-to-b from-[#0A0A0A] to-[#050505] border border-white/5 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-[#111111] overflow-hidden ${feature.glow}`}>
                {/* Internal scanning laser line for cards */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[marquee_2s_ease-in-out_infinite]"></div>
                
                <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 scale-150 transform group-hover:rotate-12">
                  {feature.icon}
                </div>
                <div className="mb-6 inline-flex p-4 rounded-xl bg-black shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)] border border-white/5 relative">
                  <div className="absolute inset-0 bg-current opacity-10 rounded-xl blur-md group-hover:opacity-30 transition-opacity" style={{color: feature.icon.props.className.match(/text-(\w+)-/)?.[0]}}></div>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-white tracking-wide mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SPLIT SECTION - DATA DASHBOARD VIBE */}
        <section className="relative py-32 border-y border-white/5 bg-[#030303] overflow-hidden">
          {/* Background Topographic/Grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold font-mono uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Systems Online
                </div>
                <h2 className="text-4xl sm:text-6xl font-black tracking-tighter">
                  {type === "citizen"
                    ? "Protect Your Urban Skyline"
                    : "Enforce Zoning With Precision"}
                </h2>
                <p className="text-xl text-gray-400 font-medium leading-relaxed">
                  {type === "citizen"
                    ? "Rogue advertisements aren't just an eyesore—they distract drivers and violate local zoning laws. Be the eyes of your city with real-time reporting."
                    : "Stop relying on manual patrols. Let crowdsourced data and AI do the heavy lifting to keep your jurisdiction 100% compliant."}
                </p>
                <div className="space-y-4 pt-4">
                  {[
                    { icon: <Shield className="h-5 w-5 text-emerald-400" />, title: "Public Safety First", desc: "Identify structurally unsound or distracting roadside boards instantly." },
                    { icon: <Eye className="h-5 w-5 text-purple-400" />, title: "Automated Audits", desc: "AI instantly parses text and images to flag potential violations with zero human error." },
                    { icon: <Users className="h-5 w-5 text-blue-400" />, title: "Civic Collaboration", desc: "A seamless, secure bridge between concerned residents and active authorities." }
                  ].map((item, i) => (
                    <div key={i} className="group flex items-start space-x-5 p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]">
                      <div className="mt-1 p-3 rounded-xl bg-black border border-white/10 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{item.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-glow"></div>
                
                {/* Tech Dashboard Image Frame */}
                <div className="relative rounded-[2rem] shadow-2xl border border-white/20 bg-black p-2 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-700">
                  <div className="absolute top-4 left-6 flex gap-2 z-20">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <img
                    src={HomepageImage2}
                    alt="City compliance tracking"
                    className="rounded-[1.5rem] w-full object-cover h-[500px] opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  
                  {/* Floating UI Elements for aesthetic */}
                  <div className="absolute -left-6 top-1/4 p-4 rounded-xl bg-[#0A0A0A]/95 border border-white/20 backdrop-blur-xl shadow-2xl animate-float-slow hidden md:block">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <CheckCircle className="text-green-400 w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-black tracking-wider text-gray-500">Auto-Resolved</div>
                        <div className="font-bold text-sm text-white">Zone A Checked</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION - HYPER GLOW */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-20">
          <div className="relative rounded-[3rem] overflow-hidden border border-white/20 bg-black p-12 sm:p-24 text-center shadow-[0_0_100px_-20px_rgba(37,99,235,0.3)] group">
            {/* Animated glowing core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,_rgba(37,99,235,0.15)_0%,_transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            
            <div className="relative z-10 space-y-10">
              <div className="inline-block p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 mb-4 animate-bounce-slow">
                <Shield className="w-12 h-12 text-blue-400" />
              </div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white drop-shadow-md">
                {type === "citizen" ? "Ready to make a difference?" : "Ready to modernize enforcement?"}
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
                {type === "citizen"
                  ? "Join BillboardWatch today. Every report brings us one step closer to a cleaner, safer community grid."
                  : "Deploy the BillboardWatch neural network in your municipality and turn citizens into your most valuable compliance asset."}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <Link
                  to={
                    !authenticated
                      ? "/login"
                      : type === "citizen"
                      ? "/citizen-dashboard"
                      : "/authority-dash"
                  }
                >
                  <button className="px-10 py-5 rounded-full font-black text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_40px_-5px_rgba(37,99,235,0.6)] hover:shadow-[0_0_60px_-5px_rgba(37,99,235,0.8)] transition-all transform hover:-translate-y-1 text-lg uppercase tracking-wider">
                    {type === "citizen" ? "Initialize Report" : "Access Command Console"}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
