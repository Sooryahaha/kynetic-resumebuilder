"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Code, Briefcase, ChevronRight, CheckCircle2 } from "lucide-react";
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
      const res = await fetch('/api/import/linkedin', {
        method: 'POST',
      });
      if (res.status === 401) {
         toast.error("Please log in with LinkedIn to authorize.");
         router.push("/api/auth/signin");
         return;
      }
      if (!res.ok) throw new Error("Failed to fetch LinkedIn data.");
      
      const data = await res.json();
      setLinkedinData(data);
      localStorage.setItem("kynetic_linkedin", JSON.stringify(data));
      toast.success("LinkedIn Identity Initialized.");
    } catch (e) {
      toast.error("Error linking LinkedIn. Please authenticate via Login.");
    } finally {
      setLoadingType(null);
    }
  };

  const handleConnectGithub = async () => {
    setLoadingType('github');
    try {
      const res = await fetch('/api/import/github', {
        method: 'POST',
      });
      if (res.status === 401) {
         toast.error("Please log in with GitHub to authorize.");
         router.push("/api/auth/signin");
         return;
      }
      if (!res.ok) throw new Error("Failed to fetch GitHub data.");
      
      const data = await res.json();
      setGithubData(data);
      localStorage.setItem("kynetic_github", JSON.stringify(data));
      toast.success("GitHub Code Metrics Synchronized.");
    } catch (e) {
      toast.error("Error lining GitHub. Ensure you are Authenticated.");
    } finally {
      setLoadingType(null);
    }
  };

  const handleContinue = () => {
    if (linkedinData && githubData) {
      router.push("/builder/career");
    }
  };

  return (
    <div className="min-h-screen bg-apple-50 dark:bg-apple-900 flex flex-col items-center justify-center p-6 text-apple-900 dark:text-apple-50 transition-colors">
       
      <motion.div 
         initial={{ opacity: 0, y: 15 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
         className="w-full max-w-2xl text-center mb-16"
      >
         <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4 tracking-tight-apple">Connect your professional identity.</h1>
         <p className="text-apple-500 dark:text-apple-400 text-lg md:text-xl font-normal max-w-lg mx-auto">
            Authorize structural extraction directly via official Microsoft and GitHub OAuth tokens. No keys required.
         </p>
      </motion.div>

      <div className="w-full max-w-3xl flex flex-col gap-6">
         {/* LinkedIn Card */}
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
         >
            <Card variant="glass" className="p-6 md:p-8 flex flex-col gap-6 hover:shadow-apple-hover transition-shadow bg-white dark:bg-apple-800 border dark:border-apple-700">
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#0A66C2]/10 flex items-center justify-center shrink-0">
                       <Briefcase size={32} className="text-[#0A66C2]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1 tracking-tight-apple">LinkedIn Profile</h3>
                      <p className="text-apple-500 dark:text-apple-400 text-sm">Authenticates base identity constraints using NextAuth Microsoft architecture.</p>
                    </div>
                 </div>
                 
                 <div className="flex gap-3 w-full md:w-auto">
                    <button 
                       onClick={handleConnectLinkedin} 
                       disabled={!!linkedinData || loadingType === 'linkedin'}
                       className={`shrink-0 px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                         linkedinData 
                           ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default" 
                           : "bg-apple-100 dark:bg-apple-700 hover:bg-apple-200 dark:hover:bg-apple-600 text-apple-900 dark:text-white"
                       }`}
                    >
                       {loadingType === 'linkedin' ? "Authorizing..." : linkedinData ? <><CheckCircle2 size={18}/> Connected</> : "Authenticate"}
                    </button>
                 </div>
               </div>
            </Card>
         </motion.div>

         {/* GitHub Card */}
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
         >
            <Card variant="glass" className="p-6 md:p-8 flex flex-col gap-6 hover:shadow-apple-hover transition-shadow bg-white dark:bg-apple-800 border dark:border-apple-700">
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-apple-900 dark:bg-apple-600 flex items-center justify-center shrink-0">
                       <Code size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1 tracking-tight-apple">GitHub Account</h3>
                      <p className="text-apple-500 dark:text-apple-400 text-sm">Validates code frequency, repository stars, and language telemetry securely.</p>
                    </div>
                 </div>
                 
                 <div className="flex gap-3 w-full md:w-auto">
                    <button 
                       onClick={handleConnectGithub} 
                       disabled={!!githubData || loadingType === 'github'}
                       className={`shrink-0 px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                         githubData 
                           ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default" 
                           : "bg-apple-100 dark:bg-apple-700 hover:bg-apple-200 dark:hover:bg-apple-600 text-apple-900 dark:text-white"
                       }`}
                    >
                       {loadingType === 'github' ? "Parsing Tokens..." : githubData ? <><CheckCircle2 size={18}/> Connected</> : "Authenticate"}
                    </button>
                 </div>
               </div>
            </Card>
         </motion.div>
      </div>

      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: linkedinData && githubData ? 1 : 0.4 }}
         transition={{ duration: 0.4 }}
         className="mt-16 text-center"
      >
         <button 
           onClick={handleContinue}
           disabled={!linkedinData || !githubData}
           className="btn-apple text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center gap-2"
         >
            Infer Target Roles
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
         </button>
      </motion.div>

    </div>
  );
}
