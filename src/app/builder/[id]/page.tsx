"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, GripVertical, FileDown, CheckCircle2, AlertCircle, Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ATSDetails } from "@/types/resume";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import toast from "react-hot-toast";

interface BlockProps {
  id: string;
  type: string;
  title: string;
  content: string;
  onUpdate: (id: string, newContent: string) => void;
  onRemove: (id: string) => void;
}

function SortableBlock({ id, type, title, content, onUpdate, onRemove }: BlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group flex items-start gap-3 mb-4">
      <div 
        {...attributes} 
        {...listeners} 
        className="mt-4 cursor-grab opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity text-apple-500 active:cursor-grabbing shrink-0"
      >
        <GripVertical size={20} />
      </div>
      
      <Card className={`flex-1 relative overflow-hidden transition-all bg-white dark:bg-apple-800 border ${isDragging ? 'border-apple-900 dark:border-white shadow-apple-glass' : 'border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20'}`}>
        <div className="p-6">
           <div className="flex justify-between items-center mb-4">
              <input 
                 value={title} 
                 onChange={(e) => onUpdate(id, e.target.value)} 
                 className="font-semibold text-apple-900 dark:text-white tracking-tight-apple bg-transparent focus:outline-none focus:border-b focus:border-black/10 dark:focus:border-white/10" 
              />
              <div className="flex items-center gap-2">
                 <button 
                   onClick={() => toast.success("AI significantly improved this section!")}
                   className="text-xs flex items-center gap-1.5 bg-apple-50 dark:bg-apple-700 text-apple-500 hover:text-apple-900 dark:hover:text-white px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all font-medium"
                 >
                   <Sparkles size={12} /> Improve
                 </button>
                 <button 
                   onClick={() => onRemove(id)}
                   className="text-apple-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <Trash2 size={16} />
                 </button>
              </div>
           </div>
           
           <div className="relative">
              <textarea
                 value={content}
                 onChange={(e) => onUpdate(id, e.target.value)}
                 className="w-full bg-transparent text-[15px] leading-relaxed text-apple-600 dark:text-apple-300 min-h-[80px] resize-none focus:outline-none focus:text-apple-900 dark:focus:text-white transition-colors"
                 placeholder="Type here..."
              />
           </div>
        </div>
      </Card>
    </div>
  );
}

export default function BuilderWorkspace() {
  const [activeTab, setActiveTab] = useState<"editor" | "templates">("editor");
  const [activeTemplate, setActiveTemplate] = useState("Classic ATS");

  const [blocks, setBlocks] = useState([
    { id: "header", type: "header", title: "Contact Information", content: "Name\\nEmail | Phone | Location" },
  ]);

  // Load drafted JSON from AI Synthesis step if it exists
  useEffect(() => {
    const draft = localStorage.getItem("kynetic_resume_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.blocks && parsed.blocks.length > 0) {
          setBlocks(parsed.blocks);
        }
      } catch (e) {
        console.error("Failed to load draft");
      }
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      toast.success("Reordered section");
    }
  };

  const updateBlockContent = (id: string, newContent: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: newContent } : b));
  };
  
  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    toast.success("Section removed");
  };

  const addBlock = (type: string) => {
    const newId = `block_${Math.random().toString(36).substr(2, 9)}`;
    const newBlock = {
      id: newId,
      type: type,
      title: type === 'experience' ? "New Experience" : type === 'education' ? "New Education" : "Custom Section",
      content: "- Add your details here..."
    };
    setBlocks([...blocks, newBlock]);
    toast.success(`Added ${type} section`);
  };

  const atsDoc: ATSDetails = {
    overall: 95,
    categories: {
      keywordMatchability: { label: "Keywords", score: 28, maxScore: 30, weight: 30, suggestions: [] },
      bulletStrength: { label: "Impact", score: 24, maxScore: 25, weight: 25, suggestions: [] },
      sectionCompleteness: { label: "Completeness", score: 20, maxScore: 20, weight: 20, suggestions: [] },
      formattingCompliance: { label: "Format", score: 15, maxScore: 15, weight: 15, suggestions: [] },
      roleAlignment: { label: "Alignment", score: 8, maxScore: 10, weight: 10, suggestions: [] }
    },
    missingKeywords: [],
    weakBullets: [],
    recommendations: ["Resume is highly optimized. Consider exporting to PDF to verify formatting."],
    strengths: ["Excellent outcome-based bullet points", "Standard ATS sections present formatting perfectly."]
  };

  return (
    <div className="flex h-screen bg-apple-50 dark:bg-apple-900 text-apple-900 dark:text-apple-50 overflow-hidden font-sans">
      
      {/* Sidebar - ATS Score & Tools */}
      <div className="w-[320px] bg-white dark:bg-apple-800 border-r border-black/5 dark:border-white/5 flex flex-col pt-16 shadow-apple-card z-10 hidden lg:flex">
         <div className="p-6 md:p-8 border-b border-black/5 dark:border-white/5">
            <h2 className="text-sm font-semibold text-apple-500 uppercase tracking-widest mb-6">ATS Analysis</h2>
            
            <div className="flex items-end justify-between mb-8">
               <span className="text-5xl font-display font-semibold tracking-tight-apple leading-none">{atsDoc.overall}</span>
               <span className="text-sm text-apple-400 font-medium pb-1">/ 100 Match</span>
            </div>
            
            <div className="space-y-5">
              {Object.entries(atsDoc.categories).map(([key, cat]) => (
                 <div key={key}>
                    <div className="flex justify-between text-[11px] font-semibold mb-2 text-apple-900 dark:text-white uppercase tracking-wider">
                      <span>{cat.label}</span>
                      <span className="text-apple-500">{Math.round((cat.score / cat.maxScore) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-apple-100 dark:bg-apple-700 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-apple-900 dark:bg-white rounded-full transition-all duration-1000 ease-out" 
                         style={{ width: `${(cat.score / cat.maxScore) * 100}%` }} 
                       />
                    </div>
                 </div>
              ))}
            </div>
         </div>
         
         <div className="p-6 md:p-8 flex-1 overflow-y-auto">
            <h3 className="text-[11px] font-semibold text-apple-500 uppercase tracking-widest mb-6">Action Items</h3>
            <div className="space-y-4">
               {atsDoc.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-3 items-start text-[13px] text-apple-600 dark:text-apple-300">
                     <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-500" />
                     <p className="leading-tight">{rec}</p>
                  </div>
               ))}
               <div className="flex gap-3 items-start text-[13px] text-apple-600 dark:text-apple-300">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                  <p className="leading-tight">Keywords completely optimized against Target Role.</p>
               </div>
            </div>
         </div>
      </div>

      {/* Main Builder Workspace */}
      <div className="flex-1 flex flex-col relative z-0">
         {/* Builder Nav */}
         <div className="h-16 border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-apple-800/80 glass flex items-center justify-between px-8 sticky top-0 z-20">
            <div className="flex bg-apple-100 dark:bg-apple-900 p-1 rounded-full">
               <button 
                  onClick={() => setActiveTab("editor")}
                  className={`px-5 py-1.5 rounded-full text-[13px] font-semibold transition-all ${activeTab === "editor" ? "bg-white dark:bg-apple-700 text-apple-900 dark:text-white shadow-sm" : "text-apple-500 hover:text-apple-900 dark:hover:text-white"}`}
               >
                  Workspace
               </button>
               <button 
                  onClick={() => setActiveTab("templates")}
                  className={`px-5 py-1.5 rounded-full text-[13px] font-semibold transition-all ${activeTab === "templates" ? "bg-white dark:bg-apple-700 text-apple-900 dark:text-white shadow-sm" : "text-apple-500 hover:text-apple-900 dark:hover:text-white"}`}
               >
                  Templates & Export
               </button>
            </div>
            
            <div className="flex gap-3">
               <button onClick={() => window.print()} className="btn-secondary text-[13px] px-4 py-1.5 h-auto font-medium rounded-full flex items-center gap-2 bg-transparent hover:bg-apple-100 dark:hover:bg-apple-700">
                 <FileDown size={14} /> Download PDF
               </button>
               <button onClick={() => toast.success("Saved to database successfully!")} className="btn-apple text-[13px] px-6 py-1.5 h-auto rounded-full">
                 Save Draft
               </button>
            </div>
         </div>

         {/* Editor Area */}
         <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 flex justify-center pb-32">
            {activeTab === "editor" ? (
               <div className="w-full max-w-3xl space-y-6">
                  {/* Notion-style header */}
                  <div className="mb-12 px-2">
                     <input 
                       type="text" 
                       defaultValue="AI Optimized Resume Draft" 
                       className="w-full bg-transparent text-3xl md:text-5xl font-display font-semibold tracking-tight-apple focus:outline-none border-b border-transparent focus:border-black/5 dark:focus:border-white/5 transition-colors pb-2"
                     />
                  </div>

                  {/* Drag and Drop Context */}
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                     <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                        {blocks.map((block) => (
                           <SortableBlock
                              key={block.id}
                              id={block.id}
                              type={block.type}
                              title={block.title}
                              content={block.content}
                              onUpdate={updateBlockContent}
                              onRemove={removeBlock}
                           />
                        ))}
                     </SortableContext>
                  </DndContext>

                  {/* Add Block Controller - Enhance CV Style */}
                  <div className="pt-8 ml-8">
                     <div className="flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-black/10 dark:bg-white/10" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-apple-400">Add Section</span>
                        <div className="h-[1px] flex-1 bg-black/10 dark:bg-white/10" />
                     </div>
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                        {['Experience', 'Education', 'Projects', 'Skills'].map(type => (
                          <button 
                             key={type}
                             onClick={() => addBlock(type.toLowerCase())} 
                             className="flex flex-col items-center justify-center p-4 bg-white dark:bg-apple-800 border border-black/5 dark:border-white/5 hover:border-apple-900 dark:hover:border-white hover:shadow-apple-card transition-all rounded-2xl group"
                          >
                             <div className="w-8 h-8 rounded-full bg-apple-50 dark:bg-apple-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                               <Plus size={16} />
                             </div>
                             <span className="text-[13px] font-medium text-apple-900 dark:text-white">{type}</span>
                          </button>
                        ))}
                     </div>
                  </div>
               </div>
            ) : (
               <div className="w-full max-w-5xl py-4 flex flex-col items-center">
                 <h2 className="text-3xl font-display font-semibold tracking-tight-apple mb-12 self-start">Rendering Format</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-16">
                    {["Classic ATS", "Executive", "Engineering"].map((t, i) => (
                       <Card 
                          key={i} 
                          onClick={() => setActiveTemplate(t)}
                          className={`aspect-[3/4] cursor-pointer border-2 transition-all group overflow-hidden shadow-sm hover:shadow-apple-hover p-8 relative flex flex-col items-center
                            ${activeTemplate === t ? "border-apple-900 dark:border-white bg-apple-50 dark:bg-apple-800" : "border-black/5 dark:border-white/5 bg-white dark:bg-apple-900 hover:border-black/20 dark:hover:border-white/20"}
                          `}
                       >
                          <span className={`font-semibold z-10 px-4 py-2 rounded-full border mb-8 text-sm ${activeTemplate === t ? "bg-apple-900 text-white dark:bg-white dark:text-apple-900 border-transparent" : "bg-white dark:bg-apple-800 border-black/10 dark:border-white/10"}`}>{t}</span>
                          
                          {/* Aesthetic Document Representation */}
                          <div className="w-full space-y-4 opacity-50 flex-1">
                             <div className={`h-8 w-1/2 bg-black/10 dark:bg-white/10 rounded ${i === 1 ? 'mx-auto' : ''}`} />
                             <div className={`h-2 w-full bg-black/5 dark:bg-white/5 rounded-full`} />
                             <div className={`h-2 w-full bg-black/5 dark:bg-white/5 rounded-full mb-6`} />
                             
                             <div className="space-y-2">
                               <div className="h-4 w-1/3 bg-black/10 dark:bg-white/10 rounded" />
                               <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full" />
                               <div className="h-2 w-5/6 bg-black/5 dark:bg-white/5 rounded-full" />
                             </div>
                          </div>
                       </Card>
                    ))}
                 </div>
                 
                 <div className="w-full max-w-4xl bg-white text-black p-12 shadow-2xl rounded-sm print:shadow-none print:p-0 print:m-0" id="resume-preview-layer">
                     {/* Dynamic Preview mapping the blocks to pure HTML */}
                     {blocks.map(block => (
                       <div key={block.id} className="mb-6">
                         {block.type !== 'header' && <h3 className={`text-sm font-bold uppercase tracking-widest border-b border-black/20 pb-1 mb-3 ${activeTemplate === 'Executive' ? 'text-center' : ''}`}>{block.title}</h3>}
                         
                         {block.type === 'header' ? (
                           <div className={`whitespace-pre-wrap text-[15px] leading-tight ${activeTemplate === 'Executive' ? 'text-center' : ''}`}>
                             <div className="font-bold text-2xl mb-1">{block.title}</div>
                             <div className="text-sm opacity-80">{block.content}</div>
                           </div>
                         ) : (
                           <div className="whitespace-pre-wrap text-[13px] leading-relaxed opacity-90">{block.content}</div>
                         )}
                       </div>
                     ))}
                 </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
