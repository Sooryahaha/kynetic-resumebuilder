"use client";

import { motion } from "framer-motion";
import { GitBranch, Briefcase, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          width: "100%",
          height: "100%"
        }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 20%, black 80%)" }} />
        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      {/* Logo */}
      <Link href="/" className="absolute top-8 left-8 z-20 text-xl font-bold text-white tracking-tight-apple hover:opacity-70 transition-opacity">
        kynetic.
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl overflow-hidden p-8">
          {/* Inner top highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-xs text-zinc-500 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Secure OAuth — No passwords stored
            </div>
            <h1 className="text-3xl font-bold tracking-tight-apple text-white mb-2">Sign in to Kynetic</h1>
            <p className="text-zinc-500 text-sm">Connect your accounts to build your AI-powered resume</p>
          </div>

          {/* Auth Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => signIn("linkedin", { callbackUrl: "/import" })}
              className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/20 hover:border-[#0A66C2]/40 text-white transition-all group"
            >
              <span className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0A66C2] flex items-center justify-center flex-shrink-0">
                  <Briefcase size={16} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold">Continue with LinkedIn</div>
                  <div className="text-xs text-zinc-500">Sync your professional profile</div>
                </div>
              </span>
              <ArrowRight size={16} className="text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => signIn("github", { callbackUrl: "/import" })}
              className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-white transition-all group"
            >
              <span className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <GitBranch size={16} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold">Continue with GitHub</div>
                  <div className="text-xs text-zinc-500">Analyze your code contributions</div>
                </div>
              </span>
              <ArrowRight size={16} className="text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          {/* Trust row */}
          <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center justify-center gap-2 text-xs text-zinc-600">
            <Shield size={12} />
            <span>Encrypted · No data sold · Delete anytime</span>
          </div>

          <p className="text-center text-xs text-zinc-700 mt-4">
            By continuing, you agree to our{" "}
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Terms</a>
            {" "}and{" "}
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
