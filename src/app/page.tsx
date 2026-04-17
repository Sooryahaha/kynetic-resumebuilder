"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, FileText, Bot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-apple-50 dark:bg-apple-900 text-apple-900 dark:text-apple-50 selection:bg-black/10 dark:selection:bg-white/20 transition-colors duration-500">
      
      {/* Dynamic Blur Nav */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent ${scrolled ? "glass dark:border-white/10" : "bg-transparent py-4"}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Image
            src="/kynetic-logo.png"
            alt="Kynetic Logo"
            width={100}
            height={32}
            className="dark:invert object-contain transition-all"
          />
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-apple-500 transition-colors">Sign In</Link>
            <Link href="/login">
               <button className="btn-apple text-sm px-5 py-2">Get Started</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative flex flex-col items-center text-center overflow-hidden">
        
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="relative z-10 max-w-4xl pt-10 md:pt-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium mb-8">
            <Sparkles size={14} /> Intelligence Re-engineered.
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-semibold tracking-tight-apple leading-[1.05] mb-6">
            The resume, <br /> reimagined.
          </h1>
          
          <p className="text-lg md:text-2xl text-apple-500 dark:text-apple-400 font-normal max-w-2xl mx-auto mb-10 tracking-tight-apple">
            Connect LinkedIn and GitHub. Our underlying artificial intelligence extracts, synthesizes, and outputs a perfectly optimized ATS-compliant structure designed specifically for your target role.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link href="/login">
               <button className="btn-apple px-8 py-4 text-base">
                 Build Your Resume <ArrowRight size={18} className="ml-2" />
               </button>
             </Link>
             <Link href="/demo">
               <button className="btn-secondary px-8 py-4 text-base">
                 Watch Film
               </button>
             </Link>
          </div>
        </motion.div>

        {/* Abstract Interface Graphic */}
        <motion.div
           initial={{ opacity: 0, y: 50, scale: 0.95 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className="mt-20 relative w-full max-w-5xl aspect-[16/9] rounded-2xl md:rounded-[40px] border border-black/10 dark:border-white/10 glass-light overflow-hidden shadow-2xl flex items-center justify-center p-8 bg-apple-100/50 dark:bg-black/50"
        >
           {/* Mock Builder Window Representation */}
           <div className="w-full h-full bg-white dark:bg-apple-800 rounded-xl md:rounded-3xl shadow-apple-glass flex overflow-hidden border border-black/5 dark:border-white/5">
              <div className="w-64 bg-apple-50 dark:bg-apple-900 border-r border-black/5 dark:border-white/5 p-6 hidden md:block">
                 <div className="h-4 w-20 bg-black/10 dark:bg-white/10 rounded-full mb-8" />
                 <div className="space-y-4">
                   <div className="h-2 w-full bg-emerald-500/80 rounded-full" />
                   <div className="h-2 w-3/4 bg-emerald-500/80 rounded-full" />
                   <div className="h-2 w-5/6 bg-emerald-500/80 rounded-full" />
                 </div>
              </div>
              <div className="flex-1 p-8 md:p-12 space-y-6">
                 <div className="h-8 w-1/3 bg-black/5 dark:bg-white/5 rounded-md mb-10" />
                 
                 <div className="space-y-3">
                   <div className="h-3 w-full bg-black/10 dark:bg-white/10 rounded-sm" />
                   <div className="h-3 w-5/6 bg-black/10 dark:bg-white/10 rounded-sm" />
                   <div className="h-3 w-4/5 bg-black/10 dark:bg-white/10 rounded-sm" />
                 </div>
                 
                 <div className="space-y-3 pt-6">
                   <div className="h-3 w-full bg-black/10 dark:bg-white/10 rounded-sm" />
                   <div className="h-3 w-3/4 bg-black/10 dark:bg-white/10 rounded-sm" />
                 </div>
              </div>
           </div>
           
           <div className="absolute inset-0 bg-gradient-to-t from-apple-50 dark:from-apple-900 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </main>
      
      {/* Features Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-black/5 dark:border-white/5">
        <h2 className="text-3xl md:text-4xl font-display font-semibold mb-12 text-center tracking-tight-apple">Intelligence in every detail.</h2>
        <div className="grid md:grid-cols-3 gap-8">
           <div className="p-8 rounded-3xl bg-white dark:bg-apple-800 shadow-apple-card border border-black/5 dark:border-white/5">
              <Bot size={32} className="text-apple-900 dark:text-white mb-6" />
              <h3 className="text-xl font-semibold mb-3 tracking-tight-apple">Neural Parsing</h3>
              <p className="text-apple-500 dark:text-apple-400">Understands the context of your engineering contributions directly from your GitHub commit graph.</p>
           </div>
           <div className="p-8 rounded-3xl bg-white dark:bg-apple-800 shadow-apple-card border border-black/5 dark:border-white/5">
              <FileText size={32} className="text-apple-900 dark:text-white mb-6" />
              <h3 className="text-xl font-semibold mb-3 tracking-tight-apple">ATS Compliant</h3>
              <p className="text-apple-500 dark:text-apple-400">Strict formatting compliance guarantees your resume will parse perfectly through Workday, Lever, and Greenhouse.</p>
           </div>
           <div className="p-8 rounded-3xl bg-white dark:bg-apple-800 shadow-apple-card border border-black/5 dark:border-white/5">
              <Sparkles size={32} className="text-apple-900 dark:text-white mb-6" />
              <h3 className="text-xl font-semibold mb-3 tracking-tight-apple">Impact Rewriting</h3>
              <p className="text-apple-500 dark:text-apple-400">Actively restructures bullet points to prioritize measurable outcomes and optimal keyword density.</p>
           </div>
        </div>
      </section>
    </div>
  );
}
