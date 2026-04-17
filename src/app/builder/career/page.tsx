"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Sparkles, ChevronRight, Target, BrainCircuit, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
        toast.error("Missing structured data. Redirecting to import.");
        router.push("/import");
        return;
      }

      try {
        const res = await fetch("/api/ai/infer-roles", {
          method: "POST",
          body: JSON.stringify({
            linkedinData: JSON.parse(storedLi),
            githubData: JSON.parse(storedGh)
          })
        });

        if (!res.ok) throw new Error("AI Failed to deduce roles");
        const data = await res.json();
        setRoles(data.roles);
      } catch (e) {
        toast.error("AI Error. Please verify your OpenAI key.");
        // Fallback options
        setRoles(["Software Engineer", "Frontend Developer", "Full Stack Engineer"]);
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
          body: JSON.stringify({
            targetRole: selectedRole,
            linkedinData: JSON.parse(storedLi!),
            githubData: JSON.parse(storedGh!)
          })
        });

        if (!res.ok) throw new Error("Resume Generation Failed");
        const resumeData = await res.json();
        
        // Save to cache for the builder to load
        localStorage.setItem("kynetic_resume_draft", JSON.stringify(resumeData));
        router.push("/builder/new-draft"); 
    } catch (e) {
        toast.error("Error generating resume. Check OpenAI key limits.");
        setIsSynthesizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-apple-50 dark:bg-apple-900 flex flex-col items-center justify-center p-6 text-apple-900 dark:text-apple-50 transition-colors">
      <motion.div 
         initial={{ opacity: 0, y: 15 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
         className="w-full max-w-2xl text-center mb-12"
      >
         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-apple-900 text-white dark:bg-white dark:text-apple-900 text-sm font-medium mb-8">
            {loading ? <BrainCircuit size={16} className="animate-pulse" /> : <Target size={16} />}
            {loading ? "Neural Mapping Active" : "Targets Acquired"}
         </div>
         
         <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4 tracking-tight-apple">
            {loading ? "Analyzing trajectory..." : "Select your target trajectory."}
         </h1>
         <p className="text-apple-500 dark:text-apple-400 text-lg md:text-xl font-normal max-w-xl mx-auto">
            {loading 
              ? "We are cross-referencing your GitHub repositories and LinkedIn history against standard industry roles." 
              : "Based on your technical footprint and past experience, we have identified these highly-probable career paths."}
         </p>
      </motion.div>

      <div className="w-full max-w-2xl flex flex-col gap-4">
        {loading ? (
           Array(3).fill(0).map((_, i) => (
             <Card key={i} className="p-6 h-24 bg-white/50 dark:bg-apple-800/50 border border-black/5 dark:border-white/5 animate-pulse" />
           ))
        ) : (
           roles.map((role, i) => (
             <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelectedRole(role)}
             >
                <Card className={`p-6 flex items-center justify-between cursor-pointer transition-all border-2 
                   ${selectedRole === role 
                     ? "border-apple-900 dark:border-white bg-apple-50 dark:bg-apple-800 shadow-apple-glass scale-[1.02]" 
                     : "border-transparent bg-white dark:bg-apple-800 hover:border-black/5 dark:hover:border-white/10"
                   }`}
                >
                   <span className="text-xl font-semibold tracking-tight-apple">{role}</span>
                   {selectedRole === role && <CheckCircle2 size={24} className="text-apple-900 dark:text-white" />}
                </Card>
             </motion.div>
           ))
        )}
      </div>

      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: selectedRole && !loading ? 1 : 0 }}
         className="mt-16 text-center"
      >
         <button 
           onClick={handleSynthesize}
           disabled={!selectedRole || isSynthesizing}
           className="btn-apple text-lg px-8 py-4 group flex items-center gap-2"
         >
            {isSynthesizing ? (
               <>Synthesizing... <Sparkles size={20} className="animate-spin" /></>
            ) : (
               <>Generate Resume <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
            )}
         </button>
      </motion.div>
    </div>
  );
}
