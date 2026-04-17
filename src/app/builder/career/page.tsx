"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, ChevronRight, CheckCircle2, Sparkles, Target, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ROLE_ICONS: Record<string, string> = {
  "Software": "⚡",
  "Frontend": "🎨",
  "Backend": "⚙️",
  "Full": "🔧",
  "Data": "📊",
  "ML": "🤖",
  "AI": "🤖",
  "Product": "🚀",
  "DevOps": "🔩",
  "Cloud": "☁️",
  "Mobile": "📱",
  "Security": "🔐",
};

function getRoleIcon(role: string) {
  for (const [key, icon] of Object.entries(ROLE_ICONS)) {
    if (role.includes(key)) return icon;
  }
  return "💼";
}

export default function CareerInferencePage() {
  const router = useRouter();
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      const storedLi = localStorage.getItem("kynetic_linkedin");
      const storedGh = localStorage.getItem("kynetic_github");

      if (!storedLi || !storedGh) {
        toast.error("Missing profile data. Please connect your accounts first.");
        router.push("/import");
        return;
      }

      try {
        const res = await fetch("/api/ai/infer-roles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ linkedinData: JSON.parse(storedLi), githubData: JSON.parse(storedGh) })
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setRoles(data.roles || []);
      } catch {
        toast.error("AI inference failed. Using smart fallback.");
        setRoles(["Senior Software Engineer", "Full Stack Developer", "Frontend Engineer"]);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, [router]);

  const handleSynthesize = async () => {
    if (!selectedRole) return;
    setIsSynthesizing(true);

    const storedLi = localStorage.getItem("kynetic_linkedin");
    const storedGh = localStorage.getItem("kynetic_github");

    try {
      const res = await fetch("/api/ai/synthesize-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: selectedRole,
          linkedinData: JSON.parse(storedLi!),
          githubData: JSON.parse(storedGh!)
        })
      });
      if (!res.ok) throw new Error();
      const resumeData = await res.json();
      localStorage.setItem("kynetic_resume_draft", JSON.stringify(resumeData));
      router.push("/builder/new-draft");
    } catch {
      toast.error("Resume generation failed. Please check your API key.");
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "60px 60px", width: "100%", height: "100%"
        }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, black 75%)" }} />
        {/* Animated glow */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white blur-3xl"
        />
      </div>

      {/* Logo */}
      <a href="/" className="absolute top-8 left-8 z-20 text-xl font-bold text-white tracking-tight-apple hover:opacity-70 transition-opacity">kynetic.</a>

      {/* Step indicator */}
      <div className="relative z-10 flex items-center gap-3 mb-14">
        {["Connect", "Choose Role", "Build"].map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full ${i === 1 ? "bg-white text-black" : i === 0 ? "border border-white/10 text-zinc-500 line-through" : "border border-white/10 text-zinc-600"}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 1 ? "bg-black text-white" : "bg-white/5 text-zinc-600"}`}>
                {i === 0 ? <CheckCircle2 size={10} /> : i + 1}
              </span>
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
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center mb-12 max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] text-xs text-zinc-400 mb-6 backdrop-blur-sm">
          {loading
            ? <><BrainCircuit size={13} className="animate-pulse text-white" /> Neural mapping in progress...</>
            : <><Target size={13} className="text-white" /> AI identified your optimal trajectories</>
          }
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight-apple mb-4">
          {loading ? "Analyzing your footprint..." : "Choose your target role."}
        </h1>
        <p className="text-zinc-500 text-lg leading-relaxed max-w-lg mx-auto">
          {loading
            ? "Cross-referencing your GitHub repositories and LinkedIn history against industry role taxonomies."
            : "Your entire resume will be rewritten specifically for this role. Bullet points, keywords, and formatting — all optimized."}
        </p>
      </motion.div>

      {/* Role Cards */}
      <div className="relative z-10 w-full max-w-2xl space-y-3">
        <AnimatePresence>
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="h-20 rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse"
              />
            ))
          ) : (
            roles.map((role, i) => {
              const isSelected = selectedRole === role;
              return (
                <motion.button
                  key={role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border text-left transition-all duration-200 group ${
                    isSelected
                      ? "border-white/30 bg-white/[0.08] shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl flex-shrink-0">{getRoleIcon(role)}</span>
                    <div>
                      <div className="text-base font-semibold text-white tracking-tight">{role}</div>
                      <div className="text-xs text-zinc-600 mt-0.5">Resume fully optimized for this trajectory</div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected ? "border-white bg-white" : "border-white/20"
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                </motion.button>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Generate CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedRole && !loading ? 1 : 0.3 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 mt-12 flex flex-col items-center gap-3"
      >
        <button
          onClick={handleSynthesize}
          disabled={!selectedRole || isSynthesizing || loading}
          className="btn-apple text-[15px] px-8 py-4 group disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSynthesizing ? (
            <><Loader2 size={16} className="animate-spin" /> Synthesizing Resume...</>
          ) : (
            <>Generate Resume <Sparkles size={15} /></>
          )}
        </button>
        {selectedRole && !isSynthesizing && (
          <p className="text-xs text-zinc-600">LLaMA-3 will rewrite every line for {selectedRole}</p>
        )}
      </motion.div>
    </div>
  );
}
