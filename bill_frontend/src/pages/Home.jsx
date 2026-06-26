import { Suspense, lazy } from "react";
import {
  AlertTriangle,
  Camera,
  Eye,
  MapPin,
  Shield,
  Users,
  CheckCircle,
  Scan,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HomepageImage2 from "../assets/billboard-placement.png";
import HomepageImage1 from "../assets/roadside-billboard.png";
import { useAuth } from "../middleware/AuthController";
import { UseRollBased } from "../middleware/RollBasedAccessController";
import Reveal, { fadeUp, staggerContainer } from "../component/motion/Reveal";
import Counter from "../component/motion/Counter";
import Tilt from "../component/motion/Tilt";
import ScrollProgress from "../component/motion/ScrollProgress";

// Keep three.js out of the main bundle
const ParticleField = lazy(() => import("../component/three/ParticleField"));

function Home() {
  const { authenticated } = useAuth();
  const { type } = UseRollBased();

  const primaryHref = !authenticated
    ? "/login"
    : type === "citizen"
    ? "/citizen-dashboard"
    : "/authority-dash";

  const stats = [
    { to: 98, suffix: "%", label: "Detection accuracy" },
    { to: 12, suffix: "ms", label: "Avg inference" },
    { to: 5, suffix: "K+", label: "Reports analyzed" },
    { value: "24/7", label: "Live monitoring" },
  ];

  const steps = [
    {
      n: "01",
      icon: <Camera className="h-6 w-6" />,
      title: "Capture & Report",
      desc: "Snap a billboard from your phone — Civix attaches GPS location and context automatically.",
    },
    {
      n: "02",
      icon: <Scan className="h-6 w-6" />,
      title: "AI Vision Analysis",
      desc: "Vision models detect the billboard and classify the exact violation with a confidence score.",
    },
    {
      n: "03",
      icon: <Shield className="h-6 w-6" />,
      title: "Authority Action",
      desc: "Verified reports route straight to enforcement, with status tracked live end to end.",
    },
  ];

  const features = [
    { icon: <Camera className="h-6 w-6" />, tint: "text-brand-300", title: type === "citizen" ? "Snap & Report" : "Instant Intake API", desc: type === "citizen" ? "Capture violations from your phone. Civix pre-processes the image and extracts context automatically." : "High-throughput pipeline that ingests thousands of citizen reports securely and instantly." },
    { icon: <Scan className="h-6 w-6" />, tint: "text-accent-400", title: "Neural Vision Analysis", desc: "Computer-vision models parse each image to detect billboards and classify the exact violation type." },
    { icon: <Shield className="h-6 w-6" />, tint: "text-emerald-400", title: type === "citizen" ? "Direct Authority Link" : "Enforcement Dashboard", desc: type === "citizen" ? "Reports are encrypted and routed straight to your municipal enforcement command center." : "Approve, reject and monitor compliance pipelines with full audit trails." },
    { icon: <MapPin className="h-6 w-6" />, tint: "text-rose-400", title: "Live Geospatial Heatmaps", desc: "Every detected anomaly is pinned to a live map, surfacing zones with chronic non-compliance." },
    { icon: <Users className="h-6 w-6" />, tint: "text-amber-400", title: "Zero-Trust Access", desc: "Strict role-based access control ensures only verified authorities can modify the record of truth." },
    { icon: <AlertTriangle className="h-6 w-6" />, tint: "text-brand-300", title: "Automated Triggers", desc: "Notifications keep citizens and authorities in sync the moment a report status changes." },
  ];

  return (
    <div className="relative min-h-screen bg-ink-950 text-gray-100 overflow-hidden selection:bg-brand-500/30">
      <ScrollProgress />

      {/* ───────────── HERO ───────────── */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <Suspense fallback={null}>
          <ParticleField className="absolute inset-0 -z-10 opacity-50 pointer-events-none" />
        </Suspense>
        <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-[0.12] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_35%,#000_30%,transparent_75%)] pointer-events-none" />
        <div className="absolute top-[-12%] left-[-8%] -z-10 w-[45%] h-[45%] rounded-full bg-brand-600/25 blur-[150px] animate-aurora pointer-events-none" />
        <div className="absolute bottom-[0%] right-[-6%] -z-10 w-[40%] h-[45%] rounded-full bg-accent-500/15 blur-[150px] animate-aurora pointer-events-none" style={{ animationDelay: "4s" }} />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink-950 to-transparent pointer-events-none" />

        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate="show"
          className="container mx-auto max-w-5xl text-center"
        >
          <motion.div variants={fadeUp} className="flex justify-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass text-xs font-medium text-gray-300">
              <Scan className="w-4 h-4 text-accent-400 animate-spin-slow" />
              <span className="uppercase tracking-[0.18em] text-gray-400">Civix Vision Engine</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-7 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            Real-Time Urban
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient animate-gradient-x">Compliance Intelligence</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {type === "citizen"
              ? "Civix turns your phone into a civic sensor — report illegal or hazardous billboards and help keep your city safe and beautiful."
              : "Civix is the AI command center for billboard compliance — real-time detection, crowdsourced intake, and a single source of truth."}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to={primaryHref}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 shadow-[0_14px_44px_-12px_rgba(100,87,243,0.8)] transition-all duration-300 hover:-translate-y-0.5"
            >
              {type === "citizen" ? "Start Reporting" : "Open Command Center"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to={authenticated ? "/heatmap" : "/login"}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-gray-200 glass hover:bg-white/10 transition-all duration-300"
            >
              <MapPin className="w-4 h-4 text-gray-400 group-hover:text-accent-400 transition-colors" />
              View Public Heatmap
            </Link>
          </motion.div>

          {/* Hero showcase image (3D tilt) */}
          <motion.div variants={fadeUp} className="mt-20 relative max-w-5xl mx-auto group">
            <div className="absolute -inset-2 bg-gradient-to-r from-brand-500/40 via-accent-500/30 to-brand-500/40 rounded-[2rem] blur-[40px] opacity-40 group-hover:opacity-70 transition-opacity duration-700" />
            <Tilt max={6} className="relative rounded-2xl border border-white/10 overflow-hidden bg-black shadow-2xl">
              <img
                src={HomepageImage1}
                alt="AI billboard detection preview"
                loading="lazy"
                className="object-cover w-full h-[420px] sm:h-[560px] opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.9)] animate-scanner z-20" />
              <div className="absolute top-[20%] left-[25%] w-[35%] h-[40%] animate-draw-box bg-accent-400/10 z-10 flex flex-col justify-between" style={{ animationDelay: "0.5s" }}>
                <div className="bg-accent-400 text-ink-950 text-[10px] font-bold px-2 py-1 w-fit flex items-center gap-1.5">
                  <Scan className="w-3 h-3" /> BILLBOARD <span className="bg-black/20 px-1 rounded">0.98</span>
                </div>
              </div>
              <div className="absolute top-[64%] left-[60%] w-[25%] h-[20%] animate-draw-box bg-rose-500/10 z-10 flex flex-col justify-between" style={{ animationDelay: "1.5s", border: "2px solid transparent", borderTopColor: "#f43f5e" }}>
                <div className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 w-fit flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" /> HAZARD <span className="bg-black/20 px-1 rounded">0.94</span>
                </div>
              </div>
              <div className="absolute top-4 right-4 glass rounded-lg p-3 font-mono text-[10px] text-accent-400 text-right z-30">
                <div>MODEL: CIVIX-VISION</div>
                <div>FPS: 60.0</div>
                <div>INF: 12.4ms</div>
                <div className="text-emerald-400 mt-1">STATUS: SYNCED</div>
              </div>
            </Tilt>
          </motion.div>
        </motion.div>
      </section>

      {/* ───────────── STATS BAND ───────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
        <Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-3xl overflow-hidden glass ring-hairline">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/[0.015] px-6 py-8 text-center">
                <div className="font-display text-4xl sm:text-5xl font-bold text-gradient">
                  {s.value ? s.value : <Counter to={s.to} suffix={s.suffix} />}
                </div>
                <div className="mt-2 text-xs sm:text-sm uppercase tracking-wider text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ───────────── MARQUEE ───────────── */}
      <section className="border-y border-white/[0.06] bg-ink-900 py-4 relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-ink-900 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-ink-900 to-transparent z-10" />
        <div className="flex animate-marquee whitespace-nowrap opacity-60">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16 px-8 items-center text-gray-500 font-mono text-sm tracking-widest font-semibold uppercase">
              <span className="flex items-center gap-2"><Scan className="w-4 h-4" /> Neural Vision</span>
              <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Enforcement API</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Geospatial Mapping</span>
              <span className="flex items-center gap-2"><Camera className="w-4 h-4" /> Smart Intake</span>
              <span className="flex items-center gap-2"><Eye className="w-4 h-4" /> 12ms Inference</span>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full border border-white/10 text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">How it works</span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            From snapshot to <span className="text-gradient">enforcement</span>
          </h2>
          <p className="mt-4 text-lg text-gray-400">Three steps from a citizen's photo to verified municipal action.</p>
        </Reveal>

        <div className="relative">
          {/* connecting line (desktop) */}
          <div className="hidden md:block absolute top-[44px] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="relative text-center">
                <div className="relative z-10 mx-auto mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-2xl glass-strong text-brand-300">
                  {s.icon}
                  <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-[11px] font-bold text-white shadow-lg">
                    {s.n}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-white tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────── FEATURES ───────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            The <span className="text-gradient">Compliance Core</span>
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Production-grade infrastructure running real-time vision models to keep urban spaces compliant.
          </p>
        </Reveal>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="group relative p-7 rounded-2xl glass ring-hairline transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_24px_60px_-24px_rgba(100,87,243,0.45)]"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className={`mb-5 inline-flex p-3 rounded-xl bg-white/[0.04] border border-white/10 ${f.tint}`}>
                {f.icon}
              </div>
              <h3 className="font-display text-lg font-semibold text-white tracking-tight mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ───────────── SPLIT SECTION ───────────── */}
      <section className="relative py-28 border-y border-white/[0.06] bg-ink-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-200 text-xs font-semibold font-mono uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" /> Systems Online
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                {type === "citizen" ? "Protect Your Urban Skyline" : "Enforce Zoning With Precision"}
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                {type === "citizen"
                  ? "Rogue advertisements aren't just an eyesore — they distract drivers and break zoning laws. Be the eyes of your city with real-time reporting."
                  : "Stop relying on manual patrols. Let crowdsourced data and AI keep your jurisdiction compliant, end to end."}
              </p>
              <div className="space-y-3 pt-2">
                {[
                  { icon: <Shield className="h-5 w-5 text-emerald-400" />, title: "Public Safety First", desc: "Flag structurally unsound or distracting roadside boards instantly." },
                  { icon: <Eye className="h-5 w-5 text-accent-400" />, title: "Automated Audits", desc: "AI parses text and imagery to surface likely violations with zero manual triage." },
                  { icon: <Users className="h-5 w-5 text-brand-300" />, title: "Civic Collaboration", desc: "A secure bridge between concerned residents and active authorities." },
                ].map((item, i) => (
                  <div key={i} className="group flex items-start gap-4 p-4 rounded-2xl glass hover:border-white/15 transition-all duration-300">
                    <div className="mt-0.5 p-2.5 rounded-xl bg-white/[0.04] border border-white/10 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-brand-200 transition-colors">{item.title}</h3>
                      <p className="text-gray-400 text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-500/20 via-accent-500/20 to-brand-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-90 transition-opacity duration-700" />
              <Tilt max={5} className="relative rounded-[1.75rem] border border-white/10 bg-black p-2 overflow-hidden">
                <div className="absolute top-4 left-6 flex gap-2 z-20">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <img
                  src={HomepageImage2}
                  alt="City compliance tracking"
                  loading="lazy"
                  className="rounded-[1.4rem] w-full object-cover h-[460px] opacity-85 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute -left-5 top-1/4 p-4 rounded-xl glass-strong shadow-2xl animate-float-slow hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <CheckCircle className="text-emerald-400 w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Auto-Resolved</div>
                      <div className="font-semibold text-sm text-white">Zone A Checked</div>
                    </div>
                  </div>
                </div>
              </Tilt>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── CTA ───────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <Reveal>
          <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-ink-900 p-12 sm:p-20 text-center group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,_rgba(100,87,243,0.18)_0%,_transparent_70%)] opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="relative z-10 space-y-8">
              <div className="inline-flex p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 animate-bounce-slow">
                <Shield className="w-10 h-10 text-brand-300" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                {type === "citizen" ? "Ready to make a difference?" : "Ready to modernize enforcement?"}
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                {type === "citizen"
                  ? "Join Civix today. Every report brings us a step closer to a cleaner, safer city."
                  : "Deploy Civix across your municipality and turn citizens into your most valuable compliance asset."}
              </p>
              <div className="pt-2">
                <Link
                  to={primaryHref}
                  className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 shadow-[0_16px_50px_-12px_rgba(100,87,243,0.85)] transition-all hover:-translate-y-0.5"
                >
                  {type === "citizen" ? "Create Your First Report" : "Access Command Console"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

export default Home;
