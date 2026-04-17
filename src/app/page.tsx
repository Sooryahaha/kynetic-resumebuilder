"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, FileText, Bot, GitBranch, Briefcase, Star, Zap, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: "95%", label: "ATS Pass Rate" },
  { value: "2min", label: "Time to Resume" },
  { value: "50+", label: "Target Roles" },
  { value: "10k+", label: "Resumes Built" },
];

const FEATURES = [
  {
    icon: GitBranch,
    title: "GitHub Intelligence",
    description: "Analyzes your commit history, repositories, and code contributions to quantify your technical depth automatically.",
    tag: "Live"
  },
  {
    icon: Briefcase,
    title: "LinkedIn Sync",
    description: "Authenticates directly via OAuth to extract your professional identity, without any manual copy-paste.",
    tag: "OAuth"
  },
  {
    icon: Bot,
    title: "LLaMA-3 Synthesis",
    description: "Groq-powered LLaMA-3 rewrites every bullet point to maximize ATS keyword density for your exact target role.",
    tag: "70B"
  },
  {
    icon: Zap,
    title: "Career Path Engine",
    description: "AI infers 3–5 highly specific roles you are most suited for, based on your cross-platform professional footprint.",
    tag: "New"
  },
  {
    icon: FileText,
    title: "ATS-First Templates",
    description: "Three distinct resume architectures built to survive Workday, Lever, and Greenhouse parsing engines flawlessly.",
    tag: "3 Templates"
  },
  {
    icon: Shield,
    title: "Enhance CV Editor",
    description: "Drag-and-drop workspace with real-time block management — add, remove, and reorder sections intuitively.",
    tag: "Interactive"
  },
];

const STEPS = [
  { num: "01", title: "Connect Accounts", desc: "Sign in with GitHub and LinkedIn. We fetch your data directly through secure OAuth tokens — no passwords stored." },
  { num: "02", title: "Choose Your Target", desc: "Our AI analyzes your footprint and presents 3–5 role trajectories you are most optimized for." },
  { num: "03", title: "Generate & Refine", desc: "LLaMA-3 synthesizes your perfect resume in seconds. Edit any block, swap templates, or let AI improve sections." },
];

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBlurred = scrollY > 40;

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ─── NAV ──────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        navBlurred ? "bg-black/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight-apple text-white">kynetic.</span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors font-medium px-4 py-2">
              Sign In
            </Link>
            <Link href="/login">
              <button className="btn-apple text-sm px-5 py-2.5 h-auto">
                Get Started <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 overflow-hidden">

        {/* Background glow blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/[0.03] blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-3xl" />
          {/* Subtle grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px"
          }} />
          {/* Radial fade over grid */}
          <div className="absolute inset-0 bg-radial-gradient" style={{
            background: "radial-gradient(ellipse at center, transparent 40%, black 80%)"
          }} />
        </div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.05] text-xs font-medium text-zinc-400 mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Powered by LLaMA-3 on Groq · Free Forever
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-6xl md:text-8xl font-bold tracking-tight-apple leading-[1.02] mb-6 max-w-5xl"
        >
          The resume,<br />
          <span className="text-gradient">reimagined.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-lg md:text-xl text-zinc-400 font-normal max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Connect GitHub and LinkedIn. Our AI extracts your entire professional
          footprint and synthesizes a perfectly ATS-optimized resume in under 2 minutes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="relative z-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/login">
            <button className="btn-apple text-[15px] px-8 py-4">
              Build My Resume <ArrowRight size={16} />
            </button>
          </Link>
          <button className="btn-secondary text-[15px] px-8 py-4">
            See How It Works
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative z-10 mt-20 flex flex-wrap items-center justify-center gap-12"
        >
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-white tracking-tight-apple">{s.value}</div>
              <div className="text-sm text-zinc-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Hero visual: mock builder UI */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mt-24 w-full max-w-5xl"
        >
          {/* Outer glow */}
          <div className="absolute -inset-4 bg-white/[0.03] rounded-[40px] blur-xl" />
          
          {/* The mock UI card */}
          <div className="relative rounded-3xl border border-white/10 overflow-hidden bg-[#0d0d0d] shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
            
            {/* Title bar */}
            <div className="h-11 bg-[#161616] border-b border-white/5 flex items-center gap-2 px-4">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="mx-auto flex items-center gap-2 text-xs text-zinc-600 bg-black/30 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                kynetic-resumeos.vercel.app/builder
              </div>
            </div>

            {/* Builder layout mock */}
            <div className="flex h-[380px] md:h-[480px]">
              {/* Left sidebar */}
              <div className="w-72 bg-[#0d0d0d] border-r border-white/5 p-6 hidden md:flex flex-col gap-5">
                <div className="text-xs text-zinc-600 uppercase tracking-widest font-medium mb-2">ATS Analysis</div>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-5xl font-bold text-white tracking-tight">95</span>
                  <span className="text-zinc-600 text-sm mb-1.5">/ 100</span>
                </div>
                {["Keywords", "Impact", "Format", "Completeness"].map((label, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs text-zinc-600 mb-1.5">
                      <span>{label}</span>
                      <span>{[94, 88, 100, 96][i]}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${[94, 88, 100, 96][i]}%` }}
                        transition={{ delay: 0.8 + i * 0.1, duration: 1, ease: "easeOut" }}
                        className="h-full bg-white rounded-full"
                      />
                    </div>
                  </div>
                ))}
                <div className="mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle size={12} />
                    Fully ATS optimized
                  </div>
                </div>
              </div>

              {/* Main content area */}
              <div className="flex-1 p-8 md:p-10 overflow-hidden">
                <div className="mb-8 flex items-center justify-between">
                  <div className="h-7 w-48 bg-white/[0.07] rounded-lg animate-pulse" />
                  <div className="flex gap-2">
                    <div className="px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/5 text-xs text-zinc-500">Workspace</div>
                    <div className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-medium">Templates</div>
                  </div>
                </div>

                {[
                  { label: "Professional Summary", w: "full" },
                  { label: "Software Engineer · Kynetic Labs", w: "2/3" },
                  { label: "Education · Stanford University", w: "1/2" },
                ].map((block, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.15, duration: 0.6 }}
                    className="mb-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] group hover:border-white/10 transition-colors"
                  >
                    <div className="text-xs text-zinc-500 mb-2">{block.label}</div>
                    <div className="space-y-1.5">
                      <div className={`h-2 w-${block.w} bg-white/[0.06] rounded-full`} />
                      <div className="h-2 w-4/5 bg-white/[0.04] rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </motion.div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────── */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-xs text-zinc-500 mb-6">
            Simple · Fast · Powerful
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight-apple mb-4">Three steps.<br />One killer resume.</h2>
          <p className="text-zinc-500 text-lg max-w-lg mx-auto">No templates to fill. No copy-paste. Just connect and let intelligence do the work.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8 relative overflow-hidden"
            >
              <div className="text-6xl font-bold text-white/[0.04] absolute -top-2 -right-2 tracking-tighter select-none">{step.num}</div>
              <div className="text-sm font-bold text-white/30 mb-4 font-mono">{step.num}</div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight-apple">{step.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES GRID ────────────────────────────── */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-white/[0.05]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight-apple mb-4">Intelligence in every detail.</h2>
          <p className="text-zinc-500 text-lg max-w-md mx-auto">Built from first principles. Precision-engineered for the modern job market.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="glass-card p-8"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.06] flex items-center justify-center border border-white/[0.06]">
                  <feat.icon size={22} className="text-white" />
                </div>
                <span className="text-[11px] font-semibold text-zinc-500 bg-white/[0.04] border border-white/[0.06] px-2 py-1 rounded-full uppercase tracking-widest">
                  {feat.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight-apple">{feat.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA SECTION ─────────────────────────────── */}
      <section className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center relative"
        >
          <div className="absolute inset-0 rounded-3xl bg-white/[0.02] blur-3xl" />
          <div className="relative glass-card px-12 py-20 border-white/[0.08]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] text-xs text-zinc-400 mb-8">
              <Sparkles size={12} />
              Join 10,000+ job seekers who landed offers
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight-apple mb-6">
              Your next offer<br />starts here.
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto">
              Connect once. Let our AI build the resume that gets you interviews.
            </p>
            <Link href="/login">
              <button className="btn-apple px-10 py-5 text-[17px]">
                Build My Resume — It's Free <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-bold text-white tracking-tight-apple">kynetic.</span>
          <p className="text-zinc-600 text-sm">AI-powered resume builder. Built for the modern job market.</p>
          <p className="text-zinc-700 text-xs">© 2026 Kynetic Resume OS</p>
        </div>
      </footer>
    </div>
  );
}
