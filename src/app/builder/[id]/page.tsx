"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GripVertical, FileDown, Trash2, Plus, Sparkles,
  CheckCircle2, AlertCircle, ChevronRight, Save
} from "lucide-react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import toast from "react-hot-toast";

interface Block { id: string; type: string; title: string; content: string; }

const ATS_CATEGORIES = [
  { label: "Keywords", score: 28, max: 30 },
  { label: "Impact", score: 24, max: 25 },
  { label: "Format", score: 15, max: 15 },
  { label: "Complete", score: 20, max: 20 },
  { label: "Alignment", score: 8, max: 10 },
];

function SortableBlock({ id, type, title, content, onUpdate, onRemove }: Block & {
  onUpdate: (id: string, field: "title" | "content", val: string) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`group flex items-start gap-3 transition-opacity ${isDragging ? "opacity-80" : ""}`}>
      {/* Drag handle */}
      <div
        {...attributes} {...listeners}
        className="mt-4 cursor-grab opacity-0 group-hover:opacity-30 hover:!opacity-60 active:cursor-grabbing text-zinc-500 transition-opacity flex-shrink-0 pt-0.5"
      >
        <GripVertical size={16} />
      </div>

      {/* Block card */}
      <div className={`flex-1 rounded-2xl border bg-white/[0.02] transition-all ${isDragging ? "border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]" : "border-white/[0.06] hover:border-white/[0.12]"}`}>
        <div className="p-5">
          {/* Block header */}
          <div className="flex items-center justify-between mb-3">
            <input
              value={title}
              onChange={e => onUpdate(id, "title", e.target.value)}
              className="text-sm font-semibold text-white bg-transparent focus:outline-none border-b border-transparent focus:border-white/10 transition-colors tracking-tight pb-0.5 w-full mr-4"
            />
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                onClick={() => toast.success("Section improved by AI!")}
                className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-all border border-white/[0.06]"
              >
                <Sparkles size={10} /> AI Improve
              </button>
              <button onClick={() => onRemove(id)} className="text-zinc-700 hover:text-red-400 transition-colors p-1">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Content textarea */}
          <textarea
            value={content}
            onChange={e => onUpdate(id, "content", e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-400 leading-relaxed resize-none focus:outline-none focus:text-zinc-200 transition-colors min-h-[70px]"
            placeholder="Describe your experience, skills, or accomplishments..."
          />
        </div>
      </div>
    </div>
  );
}

const TEMPLATES = [
  { id: "classic", name: "Classic ATS", desc: "Maximum parsing compatibility" },
  { id: "executive", name: "Executive", desc: "Senior and leadership roles" },
  { id: "engineering", name: "Engineering", desc: "Technical roles & IC tracks" },
];

const ADD_SECTIONS = ["Experience", "Education", "Projects", "Skills", "Certifications", "Awards"];

const DEFAULT_BLOCKS: Block[] = [
  { id: "header", type: "header", title: "Contact Information", content: "Your Name\nyour@email.com · (555) 000-0000 · LinkedIn · GitHub\nCity, State" },
  { id: "summary", type: "summary", title: "Professional Summary", content: "Results-driven professional with expertise in..." },
];

export default function BuilderWorkspace() {
  const [blocks, setBlocks] = useState<Block[]>(DEFAULT_BLOCKS);
  const [activeTab, setActiveTab] = useState<"editor" | "templates">("editor");
  const [activeTemplate, setActiveTemplate] = useState("classic");
  const [resumeTitle, setResumeTitle] = useState("AI Optimized Resume");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem("kynetic_resume_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.blocks?.length > 0) setBlocks(parsed.blocks);
      } catch {}
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setBlocks(items => {
        const oi = items.findIndex(i => i.id === active.id);
        const ni = items.findIndex(i => i.id === over?.id);
        return arrayMove(items, oi, ni);
      });
    }
  };

  const updateBlock = (id: string, field: "title" | "content", val: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: val } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    toast.success("Section removed");
  };

  const addBlock = (type: string) => {
    const newBlock: Block = {
      id: `block_${Date.now()}`,
      type: type.toLowerCase(),
      title: type === "Experience" ? "Job Title · Company Name" : type === "Education" ? "Degree · University" : type,
      content: "- Add your details here..."
    };
    setBlocks(prev => [...prev, newBlock]);
    toast.success(`${type} section added`);
  };

  const handleSave = () => {
    localStorage.setItem("kynetic_resume_draft", JSON.stringify({ blocks }));
    setSaved(true);
    toast.success("Draft saved!");
    setTimeout(() => setSaved(false), 2000);
  };

  const atsTotal = Math.round((ATS_CATEGORIES.reduce((a, c) => a + c.score, 0) / ATS_CATEGORIES.reduce((a, c) => a + c.max, 0)) * 100);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">

      {/* ─── LEFT SIDEBAR: ATS Panel ─── */}
      <div className="w-[280px] bg-black border-r border-white/[0.06] flex flex-col hidden lg:flex flex-shrink-0">
        
        {/* Logo */}
        <div className="h-14 border-b border-white/[0.05] flex items-center px-6">
          <span className="text-base font-bold tracking-tight-apple">kynetic.</span>
        </div>

        {/* ATS Score */}
        <div className="p-6 border-b border-white/[0.05]">
          <div className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest mb-5">ATS Score</div>
          
          <div className="flex items-end gap-2 mb-6">
            <span className="text-6xl font-bold tracking-tight text-white">{atsTotal}</span>
            <span className="text-zinc-600 text-sm mb-1.5">/ 100</span>
          </div>

          <div className="space-y-4">
            {ATS_CATEGORIES.map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-zinc-500">{cat.label}</span>
                  <span className="text-zinc-600">{Math.round((cat.score / cat.max) * 100)}%</span>
                </div>
                <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.score / cat.max) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: "easeOut" }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest mb-5">Insights</div>
          <div className="space-y-3">
            <div className="flex gap-3 items-start text-xs text-zinc-500">
              <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              Keywords fully optimized for target role
            </div>
            <div className="flex gap-3 items-start text-xs text-zinc-500">
              <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              Bullet points use strong action verbs
            </div>
            <div className="flex gap-3 items-start text-xs text-zinc-500">
              <AlertCircle size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
              Add quantified metrics to experience bullets
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN AREA ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Nav */}
        <div className="h-14 bg-black border-b border-white/[0.06] flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-20">
          {/* Tab switcher */}
          <div className="flex bg-white/[0.04] p-1 rounded-full border border-white/[0.06] gap-1">
            {(["editor", "templates"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${activeTab === tab ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
              >
                {tab === "editor" ? "Workspace" : "Templates & Export"}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-all"
            >
              <FileDown size={13} /> Export PDF
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition-all ${saved ? "bg-emerald-500 text-white" : "bg-white text-black hover:bg-zinc-100"}`}
            >
              {saved ? <><CheckCircle2 size={13} /> Saved</> : <><Save size={13} /> Save</>}
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === "editor" ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="max-w-3xl mx-auto px-6 py-10 pb-40"
              >
                {/* Resume title */}
                <div className="mb-10">
                  <input
                    value={resumeTitle}
                    onChange={e => setResumeTitle(e.target.value)}
                    className="text-4xl md:text-5xl font-bold tracking-tight-apple bg-transparent text-white focus:outline-none w-full border-b border-transparent focus:border-white/10 transition-colors pb-2"
                  />
                  <p className="text-zinc-600 text-sm mt-2">Drag to reorder · Click to edit · Hover for controls</p>
                </div>

                {/* Blocks */}
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {blocks.map(block => (
                        <SortableBlock
                          key={block.id}
                          {...block}
                          onUpdate={updateBlock}
                          onRemove={removeBlock}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                {/* Add Section */}
                <div className="mt-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-px flex-1 bg-white/[0.06]" />
                    <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Add Section</span>
                    <div className="h-px flex-1 bg-white/[0.06]" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {ADD_SECTIONS.map(type => (
                      <button
                        key={type}
                        onClick={() => addBlock(type)}
                        className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.05] transition-all group text-sm font-medium text-zinc-500 hover:text-white"
                      >
                        <Plus size={14} className="text-zinc-700 group-hover:text-white transition-colors" />
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="templates"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="max-w-5xl mx-auto px-6 py-10"
              >
                {/* Template selector */}
                <div className="mb-10">
                  <h2 className="text-3xl font-bold tracking-tight-apple mb-2">Choose a Template</h2>
                  <p className="text-zinc-500 text-sm">All templates are fully ATS-compatible and optimized for major applicant tracking systems.</p>
                </div>

                <div className="grid grid-cols-3 gap-5 mb-16">
                  {TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTemplate(t.id)}
                      className={`relative text-left p-5 rounded-2xl border transition-all ${activeTemplate === t.id ? "border-white/30 bg-white/[0.06]" : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.15]"}`}
                    >
                      {/* Paper preview mockup */}
                      <div className={`aspect-[3/4] rounded-lg mb-4 overflow-hidden border border-white/[0.04] flex flex-col p-3 gap-2 ${activeTemplate === t.id ? "bg-white/[0.06]" : "bg-white/[0.02]"}`}>
                        <div className={`h-5 rounded ${t.id === "executive" ? "w-full bg-white/20 mx-auto" : "w-1/2 bg-white/20"}`} />
                        <div className="h-px bg-white/5 w-full" />
                        <div className="space-y-1.5">
                          {Array(5).fill(0).map((_, i) => (
                            <div key={i} className={`h-1.5 rounded-full bg-white/[0.07] ${i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-4/5" : "w-2/3"}`} />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-white mb-0.5">{t.name}</div>
                      <div className="text-xs text-zinc-600">{t.desc}</div>
                      {activeTemplate === t.id && (
                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                          <CheckCircle2 size={12} className="text-black" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Live Preview */}
                <div className="border-t border-white/[0.06] pt-10">
                  <h3 className="text-xl font-bold tracking-tight-apple mb-6">Live Preview</h3>
                  <div
                    id="resume-preview"
                    className="bg-white text-black rounded-2xl p-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] text-[13px] leading-relaxed print:shadow-none print:rounded-none"
                  >
                    {blocks.map(block => (
                      <div key={block.id} className="mb-6">
                        {block.type === "header" ? (
                          <div className={activeTemplate === "executive" ? "text-center mb-6" : "mb-6"}>
                            <div className="text-2xl font-bold mb-1">{block.title}</div>
                            <div className="text-gray-600 text-sm whitespace-pre-line">{block.content}</div>
                          </div>
                        ) : (
                          <>
                            <h3 className={`text-[11px] font-black uppercase tracking-widest text-black border-b border-black/20 pb-1 mb-3 ${activeTemplate === "executive" ? "text-center" : ""}`}>
                              {block.title}
                            </h3>
                            <div className="whitespace-pre-wrap text-[13px] text-gray-700 leading-relaxed">{block.content}</div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
