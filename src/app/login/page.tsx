"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Code, Briefcase, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-kynetic-950 flex flex-col items-center justify-center p-6 relative overflow-hidden text-white noise">
       
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-kynetic-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <Link href="/" className="absolute top-8 left-8 z-20">
         <Image
            src="/kynetic-logo.png"
            alt="Kynetic Logo"
            width={120}
            height={40}
            className="brightness-0 invert object-contain"
         />
      </Link>

      <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.5 }}
         className="relative z-10 w-full max-w-md"
      >
         <Card variant="glass" className="p-8 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-kynetic-500/5 to-transparent pointer-events-none" />
            
            <div className="text-center mb-8 relative z-10">
               <h1 className="text-3xl font-display font-medium mb-2">Welcome Back</h1>
               <p className="text-dark-300">Sign in to continue to Kynetic</p>
            </div>

            <div className="space-y-4 relative z-10">
               <Button 
                  onClick={() => signIn("linkedin", { callbackUrl: "/import" })}
                  className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white shadow-glow-sm shadow-blue-500/30 h-12 flex justify-between px-6"
               >
                  <span className="flex items-center gap-2">
                     <Briefcase size={20} /> Continue with LinkedIn
                  </span>
                  <ArrowRight size={18} className="opacity-50" />
               </Button>
               
               <Button 
                  onClick={() => signIn("github", { callbackUrl: "/import" })}
                  className="w-full bg-[#24292F] hover:bg-[#1b1f23] text-white shadow-glow-sm shadow-dark-500/30 h-12 border border-dark-600 flex justify-between px-6"
               >
                  <span className="flex items-center gap-2">
                     <Code size={20} /> Continue with GitHub
                  </span>
                  <ArrowRight size={18} className="opacity-50" />
               </Button>
            </div>

            <div className="mt-8 text-center text-sm text-dark-400 relative z-10">
               By continuing, you agree to our <a href="#" className="text-kynetic-400 hover:underline">Terms of Service</a> and <a href="#" className="text-kynetic-400 hover:underline">Privacy Policy</a>.
            </div>
         </Card>
      </motion.div>
    </div>
  );
}
