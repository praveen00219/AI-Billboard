import {
  Shield,
  Eye,
  Users,
  MapPin,
  Camera,
  AlertTriangle,
  ArrowRight,
  Lock,
  ScanLine,
  Image as ImageIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Reveal, { fadeUp, staggerContainer } from "../component/motion/Reveal";
import Counter from "../component/motion/Counter";
import ScrollProgress from "../component/motion/ScrollProgress";

const steps = [
  { n: "01", icon: <Camera className="h-6 w-6" />, tint: "text-brand-300", title: "Citizen Reporting", desc: "Citizens report suspected violations in seconds by uploading photos or video through a friendly, mobile-first flow." },
  { n: "02", icon: <ScanLine className="h-6 w-6" />, tint: "text-accent-400", title: "AI Analysis", desc: "Computer-vision models analyze every submission to detect billboards and classify violations automatically." },
  { n: "03", icon: <Users className="h-6 w-6" />, tint: "text-emerald-400", title: "Authority Review", desc: "Local authorities verify, action, and track reported violations from one comprehensive dashboard." },
  { n: "04", icon: <MapPin className="h-6 w-6" />, tint: "text-rose-400", title: "Public Transparency", desc: "Public heatmaps and statistics keep violation patterns and enforcement actions open and accountable." },
];

const violations = [
  { icon: <AlertTriangle className="h-5 w-5" />, tint: "text-amber-400", title: "Size Violations", desc: "Oversized billboards" },
  { icon: <MapPin className="h-5 w-5" />, tint: "text-rose-400", title: "Placement Issues", desc: "Improper positioning" },
  { icon: <Eye className="h-5 w-5" />, tint: "text-accent-400", title: "Content Violations", desc: "Inappropriate content" },
  { icon: <Shield className="h-5 w-5" />, tint: "text-emerald-400", title: "Safety Hazards", desc: "Dangerous installations" },
  { icon: <Users className="h-5 w-5" />, tint: "text-brand-300", title: "Permit Issues", desc: "Unauthorized billboards" },
  { icon: <Camera className="h-5 w-5" />, tint: "text-purple-400", title: "Other Violations", desc: "Custom categories" },
];

const privacy = [
  { icon: <ImageIcon className="h-5 w-5" />, title: "Image Processing", desc: "All uploaded images are processed by secure AI — we analyze billboard content, size and placement while respecting privacy." },
  { icon: <MapPin className="h-5 w-5" />, title: "Location Data", desc: "GPS coordinates are used solely for mapping and enforcement. Location data is anonymized in public displays." },
  { icon: <Lock className="h-5 w-5" />, title: "Data Security", desc: "All data is encrypted and stored securely. We comply with privacy regulations and never share personal data without consent." },
];

const stats = [
  { to: 6, suffix: "", label: "Violation categories" },
  { to: 98, suffix: "%", label: "Detection accuracy" },
  { to: 100, suffix: "%", label: "Encrypted data" },
  { value: "24/7", label: "Live monitoring" },
];

function About() {
  return (
    <div className="relative min-h-screen bg-ink-950 text-gray-100 overflow-hidden">
      <ScrollProgress />

      {/* ───────────── HERO ───────────── */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-[0.1] [mask-image:radial-gradient(ellipse_55%_50%_at_50%_30%,#000_30%,transparent_75%)] pointer-events-none" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 -z-10 w-[55%] h-[40%] rounded-full bg-brand-600/20 blur-[150px] animate-aurora pointer-events-none" />

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="show"
          className="container mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp} className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-mono uppercase tracking-[0.18em] text-gray-400">
              <Shield className="w-4 h-4 text-brand-300" /> About Civix
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="mt-7 text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
            Cleaner cities, <span className="text-gradient">powered by AI</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 text-lg sm:text-xl text-gray-400 leading-relaxed">
            Civix empowers communities through AI-powered billboard compliance monitoring — pairing
            computer vision with citizen reporting to keep urban spaces safe, legal and beautiful.
          </motion.p>
        </motion.div>
      </section>

      {/* ───────────── STATS ───────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
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

      {/* ───────────── MISSION ───────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
          <Reveal>
            <span className="inline-block px-3 py-1 rounded-full border border-white/10 text-xs font-mono uppercase tracking-widest text-gray-400 mb-5">
              Our Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Technology in the service of the public realm
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative rounded-3xl glass ring-hairline p-8">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <p className="text-lg text-gray-300 leading-relaxed">
                Civix is dedicated to creating cleaner, safer and more compliant urban environments
                through innovative technology and community engagement.
              </p>
              <p className="mt-4 text-gray-400 leading-relaxed">
                By combining artificial intelligence with citizen reporting, we monitor and enforce
                billboard regulations while maintaining full transparency and accountability —
                turning everyday residents into a powerful force for civic good.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            How <span className="text-gradient">Civix</span> works
          </h2>
          <p className="mt-4 text-lg text-gray-400">A continuous loop from citizen report to public accountability.</p>
        </Reveal>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {steps.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group relative p-6 rounded-2xl glass ring-hairline transition-all duration-300 hover:-translate-y-1 hover:border-white/15"
            >
              <span className="absolute top-5 right-5 font-display text-2xl font-bold text-white/10 group-hover:text-white/20 transition-colors">
                {s.n}
              </span>
              <div className={`mb-5 inline-flex p-3 rounded-xl bg-white/[0.04] border border-white/10 ${s.tint}`}>
                {s.icon}
              </div>
              <h3 className="font-display text-lg font-semibold text-white tracking-tight mb-2">{s.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ───────────── VIOLATION TYPES ───────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Violations we <span className="text-gradient">detect</span>
          </h2>
          <p className="mt-4 text-gray-400">Six categories, classified automatically with a confidence score.</p>
        </Reveal>

        <motion.div
          variants={staggerContainer(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {violations.map((v, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group flex items-center gap-4 p-5 rounded-2xl glass ring-hairline transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15"
            >
              <div className={`p-3 rounded-xl bg-white/[0.04] border border-white/10 ${v.tint} group-hover:scale-110 transition-transform`}>
                {v.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ───────────── PRIVACY ───────────── */}
      <section className="relative py-20 border-y border-white/[0.06] bg-ink-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-4">
              <Lock className="w-3.5 h-3.5" /> Privacy first
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Privacy & data handling</h2>
          </Reveal>

          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {privacy.map((p, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl glass ring-hairline p-6">
                <div className="mb-4 inline-flex p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  {p.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-white tracking-tight mb-2">{p.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────── GET INVOLVED ───────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">Get involved</h2>
          <p className="mt-4 text-lg text-gray-400">
            Join a community of citizens and authorities working together to keep cities compliant.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <Reveal>
            <div className="group h-full rounded-3xl glass ring-hairline p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/15">
              <div className="mb-5 inline-flex p-3 rounded-xl bg-white/[0.04] border border-white/10 text-brand-300">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white tracking-tight">For Citizens</h3>
              <p className="mt-2 text-gray-400">Start reporting violations in your area and help shape your city.</p>
              <Link to="/signup" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-brand-200 transition-colors">
                Create an account <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="group h-full rounded-3xl glass ring-hairline p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/15">
              <div className="mb-5 inline-flex p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white tracking-tight">For Authorities</h3>
              <p className="mt-2 text-gray-400">Access the enforcement dashboard and modernize compliance operations.</p>
              <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-brand-200 transition-colors">
                Access dashboard <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default About;
