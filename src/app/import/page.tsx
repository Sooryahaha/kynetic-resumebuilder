"use client";

import { motion } from "framer-motion";
import { GitBranch, Briefcase, ChevronRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ImportPage() {
  const router = useRouter();
  const [linkedinData, setLinkedinData] = useState<any>(null);
  const [githubData, setGithubData] = useState<any>(null);
  const [loadingType, setLoadingType] = useState<string | null>(null);

  const handleConnectLinkedin = async () => {
    setLoadingType('linkedin');
    try {
      const res = await fetch('/api/import/linkedin', { method: 'POST' });
      if (res.status === 401) { toast.error("Authenticate via LinkedIn first."); router.push("/api/auth/signin"); return; }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLinkedinData(data);
      localStorage.setItem("kynetic_linkedin", JSON.stringify(data));
      toast.success("LinkedIn Profile Synced!");
    } catch { toast.error("Error linking LinkedIn. Please authenticate via Login."); }
    finally { setLoadingType(null); }
  };

  const handleConnectGithub = async () => {
    setLoadingType('github');
    try {
      const res = await fetch('/api/import/github', { method: 'POST' });
      if (res.status === 401) { toast.error("Authenticate via GitHub first."); router.push("/api/auth/signin"); return; }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setGithubData(data);
      localStorage.setItem("kynetic_github", JSON.stringify(data));
      toast.success("GitHub Metrics Analyzed!");
    } catch { toast.error("Error linking GitHub. Ensure you are authenticated."); }
    finally { setLoadingType(null); }
  };

  const bothConnected = linkedinData && githubData;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px", width: "100%", height: "100%"
        }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, black 75%)" }} />
      </div>

      {/* Back link */}
      <a href="/" className="absolute top-8 left-8 z-20 text-xl font-bold text-white tracking-tight-apple hover:opacity-70 transition-opacity">kynetic.</a>

      {/* Step indicator */}
      <div className="relative z-10 flex items-center gap-3 mb-12">
        {["Connect", "Choose Role", "Build"].map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full ${i === 0 ? "bg-white text-black" : "border border-white/10 text-zinc-600"}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-black text-white" : "bg-white/5 text-zinc-600"}`}>{i + 1}</span>
              {s}
            </div>
            {i < 2 && <div className="w-8 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center mb-12 max-w-xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight-apple mb-4">Connect your professional identity.</h1>
        <p className="text-zinc-500 text-lg leading-relaxed">
          We read your data directly through secure OAuth tokens — no passwords, no scraping, no third-party services.
        </p>
      </motion.div>

      {/* Connection Cards */}
      <div className="relative z-10 w-full max-w-2xl space-y-4">

        {/* LinkedIn */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`relative rounded-2xl border transition-all overflow-hidden ${linkedinData ? "border-emerald-500/30 bg-emerald-500/[0.04]" : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"}`}
        >
          <div className="p-6 flex items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#0A66C2]/15 border border-[#0A66C2]/20 flex items-center justify-center flex-shrink-0">
                <Briefcase size={26} className="text-[#0A66C2]" />
              </div>
              <div>
                <div className="text-base font-semibold text-white mb-0.5">LinkedIn Profile</div>
                <div className="text-sm text-zinc-500">Professional identity · Work history · Skills</div>
              </div>
            </div>
            <button
              onClick={handleConnectLinkedin}
              disabled={!!linkedinData || loadingType === 'linkedin'}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                linkedinData
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default"
                  : "bg-white/[0.06] border border-white/[0.1] text-white hover:bg-white/[0.12]"
              }`}
            >
              {loadingType === 'linkedin' ? <><Loader2 size={14} className="animate-spin" /> Syncing</> 
               : linkedinData ? <><CheckCircle2 size={14} /> Connected</> 
               : "Authenticate"}
            </button>
          </div>
        </motion.div>

        {/* GitHub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`relative rounded-2xl border transition-all overflow-hidden ${githubData ? "border-emerald-500/30 bg-emerald-500/[0.04]" : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"}`}
        >
          <div className="p-6 flex items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                <GitBranch size={26} className="text-white" />
              </div>
              <div>
                <div className="text-base font-semibold text-white mb-0.5">GitHub Account</div>
                <div className="text-sm text-zinc-500">Repositories · Languages · Commit history</div>
              </div>
            </div>
            <button
              onClick={handleConnectGithub}
              disabled={!!githubData || loadingType === 'github'}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                githubData
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default"
                  : "bg-white/[0.06] border border-white/[0.1] text-white hover:bg-white/[0.12]"
              }`}
            >
              {loadingType === 'github' ? <><Loader2 size={14} className="animate-spin" /> Parsing</> 
               : githubData ? <><CheckCircle2 size={14} /> Connected</> 
               : "Authenticate"}
            </button>
          </div>
        </motion.div>

        {/* Info note */}
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-sm text-zinc-600">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-zinc-700" />
          LinkedIn OAuth provides name and identity only. You'll be able to add your full work experience in the editor.
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: bothConnected ? 1 : 0.35 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 mt-12"
      >
        <button
          onClick={() => bothConnected && router.push("/builder/career")}
          disabled={!bothConnected}
          className="btn-apple text-[15px] px-8 py-4 disabled:cursor-not-allowed group"
        >
          Infer Target Roles <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
        {!bothConnected && (
          <p className="text-zinc-700 text-xs text-center mt-3">Connect both accounts to continue</p>
        )}
      </motion.div>
    </div>
  );
}
