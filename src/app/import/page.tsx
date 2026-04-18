"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2, Loader2, GitBranch, Briefcase,
  AlertCircle, ChevronRight, ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";

type Status = "idle" | "loading" | "done" | "error";

interface ProviderState {
  linked: boolean;
  status: Status;
  data: any | null;
}

export default function ImportPage() {
  const { data: session, status: sessionStatus, update } = useSession();
  const router = useRouter();

  const [github, setGithub] = useState<ProviderState>({ linked: false, status: "idle", data: null });
  const [linkedin, setLinkedin] = useState<ProviderState>({ linked: false, status: "idle", data: null });

  // Derive connected providers from session
  const providers: string[] = (session as any)?.connectedProviders ?? [];
  const isGithubLinked = providers.includes("github");
  const isLinkedinLinked = providers.includes("linkedin");

  // Auto-fetch GitHub data once we know it's linked
  useEffect(() => {
    if (isGithubLinked && github.status === "idle") {
      fetchGithub();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGithubLinked]);

  // Auto-fetch LinkedIn data once linked
  useEffect(() => {
    if (isLinkedinLinked && linkedin.status === "idle") {
      fetchLinkedin();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLinkedinLinked]);

  // Auto-advance once both are done
  useEffect(() => {
    if (github.data && linkedin.data) {
      const t = setTimeout(() => router.push("/builder/career"), 1200);
      return () => clearTimeout(t);
    }
  }, [github.data, linkedin.data, router]);

  const fetchGithub = async () => {
    setGithub(s => ({ ...s, status: "loading" }));
    try {
      const res = await fetch("/api/import/github", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      localStorage.setItem("kynetic_github", JSON.stringify(data));
      setGithub({ linked: true, status: "done", data });
    } catch {
      setGithub(s => ({ ...s, status: "error" }));
      toast.error("Couldn't fetch GitHub data. Please reconnect.");
    }
  };

  const fetchLinkedin = async () => {
    setLinkedin(s => ({ ...s, status: "loading" }));
    try {
      const res = await fetch("/api/import/linkedin", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      localStorage.setItem("kynetic_linkedin", JSON.stringify(data));
      setLinkedin({ linked: true, status: "done", data });
    } catch {
      setLinkedin(s => ({ ...s, status: "error" }));
      toast.error("Couldn't fetch LinkedIn data. Please reconnect.");
    }
  };

  const connectGithub = () => signIn("github", { callbackUrl: "/import" });
  const connectLinkedin = () => signIn("linkedin", { callbackUrl: "/import" });

  const bothDone = github.data && linkedin.data;

  // Loading session
  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={24} className="text-zinc-600 animate-spin" />
      </div>
    );
  }

  // Not signed in at all
  if (sessionStatus === "unauthenticated") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 p-6 text-white">
        <h1 className="text-3xl font-bold tracking-tight">Sign in to get started</h1>
        <p className="text-zinc-500 text-center max-w-xs">Connect at least one account, then we'll walk you through linking the other.</p>
        <button onClick={connectGithub} className="btn-apple px-8 py-4 text-[15px]">
          Sign in with GitHub <ArrowRight size={16} />
        </button>
        <button onClick={connectLinkedin} className="btn-secondary px-8 py-4 text-[15px]">
          Sign in with LinkedIn
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 30%, black 75%)" }} />

      {/* Logo */}
      <a href="/" className="absolute top-8 left-8 z-20 text-xl font-bold tracking-tight-apple hover:opacity-70 transition-opacity">kynetic.</a>

      {/* Step indicator */}
      <div className="relative z-10 flex items-center gap-3 mb-14">
        {["Connect", "Choose Role", "Build"].map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
              i === 0 ? "bg-white text-black" : "border border-white/10 text-zinc-600"
            }`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                i === 0 ? "bg-black text-white" : "bg-white/5 text-zinc-600"
              }`}>{i + 1}</span>
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
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center mb-10 max-w-xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight-apple mb-3">
          {bothDone ? "All set — heading to AI analysis." : "Connect your accounts."}
        </h1>
        <p className="text-zinc-500 text-base leading-relaxed">
          Both accounts are read via secure OAuth tokens. We never store passwords or credentials.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="relative z-10 w-full max-w-lg space-y-4">

        {/* GitHub Card */}
        <ProviderCard
          icon={<GitBranch size={22} className="text-white" />}
          iconBg="bg-zinc-800 border border-white/10"
          name="GitHub"
          description="Repositories · Languages · Stars · Commit history"
          isLinked={isGithubLinked}
          status={github.status}
          data={github.data}
          onConnect={connectGithub}
          connectLabel="Connect GitHub"
        />

        {/* LinkedIn Card */}
        <ProviderCard
          icon={<Briefcase size={22} className="text-[#0A66C2]" />}
          iconBg="bg-[#0A66C2]/15 border border-[#0A66C2]/20"
          name="LinkedIn"
          description="Professional identity · Headline · Location"
          isLinked={isLinkedinLinked}
          status={linkedin.status}
          data={linkedin.data}
          onConnect={connectLinkedin}
          connectLabel="Connect LinkedIn"
        />

      </div>

      {/* Caveats */}
      <div className="relative z-10 flex items-start gap-2.5 max-w-lg mt-6 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-zinc-600">
        <AlertCircle size={13} className="flex-shrink-0 mt-0.5 text-zinc-700" />
        LinkedIn's consumer OAuth only provides your name and location. You can add full work history directly in the resume editor.
      </div>

      {/* Manual continue (appears if auto-redirect didn't fire) */}
      <AnimatePresence>
        {bothDone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 mt-10 flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-3">
              <CheckCircle2 size={16} /> Both accounts connected
            </div>
            <button
              onClick={() => router.push("/builder/career")}
              className="btn-apple text-[15px] px-8 py-4 group"
            >
              Analyze My Profile <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Not both done — show partial continue option */}
      {!bothDone && (github.data || linkedin.data) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 mt-8 text-center"
        >
          <button
            onClick={() => router.push("/builder/career")}
            className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors underline underline-offset-4"
          >
            Continue with one account →
          </button>
          <p className="text-zinc-700 text-xs mt-1">Results will be less accurate without both connected</p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Reusable Provider Card ────────────────────────────
function ProviderCard({
  icon, iconBg, name, description,
  isLinked, status, data, onConnect, connectLabel
}: {
  icon: React.ReactNode;
  iconBg: string;
  name: string;
  description: string;
  isLinked: boolean;
  status: Status;
  data: any;
  onConnect: () => void;
  connectLabel: string;
}) {
  const isDone = status === "done" && data;
  const isLoading = status === "loading" || (isLinked && status === "idle");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-2xl border p-5 transition-all ${
        isDone
          ? "border-emerald-500/25 bg-emerald-500/[0.04]"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14]"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
            {icon}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{name}</div>
            <div className="text-xs text-zinc-600 mt-0.5">{description}</div>
            {isDone && data && name === "GitHub" && (
              <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                <span>{Object.keys(data.topLanguages || {}).slice(0, 3).join(" · ") || "Data fetched"}</span>
                {data.totalStars > 0 && <span>★ {data.totalStars}</span>}
              </div>
            )}
            {isDone && data && name === "LinkedIn" && (
              <div className="text-xs text-zinc-500 mt-2">{data.name || "Profile fetched"}</div>
            )}
          </div>
        </div>

        {/* Action / status */}
        {isDone ? (
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium flex-shrink-0">
            <CheckCircle2 size={15} /> Connected
          </div>
        ) : isLoading ? (
          <div className="flex items-center gap-2 text-zinc-600 text-xs flex-shrink-0">
            <Loader2 size={14} className="animate-spin" /> Syncing…
          </div>
        ) : (
          <button
            onClick={onConnect}
            className="flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full bg-white text-black hover:bg-zinc-100 transition-all"
          >
            {connectLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
}
