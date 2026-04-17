"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TARGET_ROLES } from "@/types/resume";
import { Search, Sparkles, Bot, Clock, CheckCircle2 } from "lucide-react";

export default function RoleTargetingPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const filteredRoles = TARGET_ROLES.filter(role => 
    role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerate = () => {
    if (!selectedRole) return;
    
    setIsGenerating(true);
    
    // Simulate AI Generation Sequence
    const steps = [
      "Extracting skills from imported data...",
      "Inferring career trajectory and seniority...",
      "Ranking projects by relevance to " + selectedRole + "...",
      "Rewriting bullets with action verbs and impact metrics...",
      "Optimizing keyword density for ATS scanners...",
      "Formatting blocks..."
    ];
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setGenerationStep(currentStep);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          router.push("/builder/demo-resume-id");
        }, 800);
      }
    }, 1200);
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-kynetic-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden noise">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-kynetic-600/10 rounded-full blur-[100px] pointer-events-none" />
         
         <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-lg text-center"
         >
            <div className="mb-8 relative flex justify-center">
               <div className="w-24 h-24 rounded-full border-4 border-kynetic-500/20 border-t-kynetic-500 animate-spin" />
               <Bot size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-kynetic-400" />
            </div>
            
            <h2 className="text-3xl font-display font-medium mb-8">AI Agent Working</h2>
            
            <div className="space-y-4 text-left max-w-md mx-auto">
               {[
                  "Extracting skills from imported data...",
                  "Inferring career trajectory and seniority...",
                  "Ranking projects by relevance to " + selectedRole + "...",
                  "Rewriting bullets with action verbs and impact metrics...",
                  "Optimizing keyword density for ATS scanners...",
                  "Formatting blocks..."
               ].map((step, idx) => (
                  <motion.div 
                     key={idx}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ 
                       opacity: generationStep >= idx ? 1 : 0.3, 
                       x: generationStep >= idx ? 0 : -10 
                     }}
                     className="flex items-center gap-3 text-sm"
                  >
                     {generationStep > idx ? (
                        <CheckCircle2 size={18} className="text-emerald-400" />
                     ) : generationStep === idx ? (
                        <Clock size={18} className="text-kynetic-400 animate-pulse" />
                     ) : (
                        <div className="w-[18px] h-[18px] rounded-full border border-dark-600" />
                     )}
                     <span className={generationStep >= idx ? "text-white" : "text-dark-500"}>{step}</span>
                  </motion.div>
               ))}
            </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kynetic-950 flex flex-col items-center justify-center p-6 relative overflow-hidden text-white noise">
       <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
       </div>

       <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-2xl"
       >
          <div className="text-center mb-10">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-kynetic-500/30 bg-kynetic-500/10 text-kynetic-300 text-sm font-medium mb-4">
               <Sparkles size={16} /> Target Role AI
             </div>
             <h1 className="text-4xl md:text-5xl font-display font-medium mb-4">What role are you targeting?</h1>
             <p className="text-dark-300 text-lg">
                Our AI will restructure your experience, prioritize relevant skills, and rewrite your impact statements to perfectly match the role.
             </p>
          </div>

          <Card variant="glass" className="p-6 md:p-8 backdrop-blur-2xl">
             <div className="relative mb-6">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder="Search roles (e.g. Frontend Developer, Product Manager)" 
                   className="w-full bg-dark-900 border border-dark-700 focus:border-kynetic-500 rounded-xl py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-dark-500"
                />
             </div>

             <div className="flex flex-wrap gap-3 mb-8 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredRoles.map(role => (
                   <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                         selectedRole === role 
                            ? "bg-kynetic-600 border-kynetic-500 text-white shadow-glow-sm shadow-kynetic-500/40" 
                            : "bg-dark-800 border-dark-700 text-dark-300 hover:border-dark-500 hover:text-white"
                      }`}
                   >
                      {role}
                   </button>
                ))}
                {filteredRoles.length === 0 && (
                   <div className="w-full text-center py-8 text-dark-500 text-sm">
                      No matching roles found. You can type a custom one.
                   </div>
                )}
             </div>

             <Button 
                onClick={handleGenerate}
                disabled={!selectedRole}
                size="lg"
                className="w-full h-14 text-lg bg-white text-kynetic-950 hover:bg-slate-200"
             >
                Generate Resume with AI <Sparkles size={18} className="ml-2" />
             </Button>
          </Card>
       </motion.div>
    </div>
  );
}
