import { useState } from 'react';
import { 
  Search, 
  ChevronRight, 
  Check, 
  AlertTriangle, 
  Clock, 
  Volume2,
  ListTodo,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { firstAidGuides } from '../data/firstAidGuides';
import { FirstAidGuide } from '../types';

interface FirstAidGuidesProps {
  highContrast: boolean;
}

export default function FirstAidGuides({ highContrast }: FirstAidGuidesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<FirstAidGuide | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Life Support', 'Neurological', 'Cardiovascular', 'Trauma'];

  const handleToggleStep = (stepIdx: number) => {
    if (!selectedGuide) return;
    const key = `${selectedGuide.id}-${stepIdx}`;
    setCheckedSteps(prev => ({ ...prev, [key]: !prev[key] }));

    // Optional subtle voice confirmation
    if ('speechSynthesis' in window && !checkedSteps[key]) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Step ${stepIdx + 1} completed`));
    }
  };

  const filteredGuides = firstAidGuides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          guide.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || guide.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      <AnimatePresence mode="wait">
        {!selectedGuide ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Filter Search Header */}
            <div className="flex flex-col md:flex-row justify-between gap-4 bg-surface-container border border-outline-variant/30 p-4 rounded-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-3.5" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search offline first aid topics..."
                  className="w-full bg-surface border border-outline-variant/40 rounded pl-10 pr-4 py-2.5 text-xs text-on-surface font-bold focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-[10px] font-black rounded tracking-wider uppercase transition-all
                      ${activeCategory === cat 
                        ? 'bg-primary text-black' 
                        : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Guides Cards List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGuides.map(guide => (
                <div 
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className="bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 hover:border-primary/50 transition-all p-5 rounded-lg cursor-pointer group active:scale-98 flex flex-col justify-between h-48"
                >
                  <div className="space-y-2">
                    <span className="text-[9px] text-primary font-mono font-bold uppercase tracking-widest bg-primary-container/10 px-2 py-0.5 rounded border border-primary/20">
                      {guide.category}
                    </span>
                    <h3 className="text-sm font-black text-on-surface group-hover:text-primary transition-colors leading-tight mt-1">
                      {guide.title}
                    </h3>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-outline-variant/10">
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                      {guide.steps.length} ACTION CHECKPOINTS
                    </span>
                    <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform group-hover:text-primary" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-6"
          >
            {/* Header control bar */}
            <div className="flex justify-between items-center">
              <button 
                onClick={() => {
                  setSelectedGuide(null);
                  setCheckedSteps({});
                }}
                className="px-4 py-2 bg-surface-container-high border border-outline-variant/30 text-xs font-bold text-primary rounded hover:bg-surface-container-highest transition-colors active:scale-95"
              >
                ← BACK TO LIST
              </button>
              <span className="text-[10px] text-on-surface-variant font-mono font-bold uppercase tracking-wider bg-surface-container px-3 py-1.5 border border-outline-variant/20 rounded">
                CATEGORY: {selectedGuide.category.toUpperCase()}
              </span>
            </div>

            {/* Guide Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Side steps checklist (Span 7) */}
              <div className="lg:col-span-7 bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
                <h2 className="text-base font-black text-on-surface uppercase tracking-tight border-b border-outline-variant/20 pb-3">
                  {selectedGuide.title}
                </h2>

                <div className="space-y-2.5">
                  {selectedGuide.steps.map((step, idx) => {
                    const isChecked = checkedSteps[`${selectedGuide.id}-${idx}`];
                    return (
                      <div 
                        key={idx}
                        onClick={() => handleToggleStep(idx)}
                        className={`p-4 border rounded-lg flex gap-3 cursor-pointer select-none transition-all duration-150 active:scale-99
                          ${isChecked 
                            ? 'bg-emerald-500/10 border-emerald-500/50 opacity-70' 
                            : 'bg-surface border-outline-variant/30 hover:border-outline-variant/60'}`}
                      >
                        <div className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center shrink-0 text-xs font-black
                          ${isChecked ? 'bg-emerald-500 text-black border-emerald-500' : 'border-outline-variant/60 bg-surface-container-high text-on-surface-variant'}`}
                        >
                          {isChecked ? '✓' : idx + 1}
                        </div>
                        <p className={`text-xs leading-relaxed font-bold ${isChecked ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right side coaching advice & disclaimer (Span 5) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Visual Coaching Tips */}
                <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
                  <h3 className="font-black text-sm text-on-surface uppercase tracking-wider flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-primary" />
                    COACHING CHEATSHEET
                  </h3>
                  <div className="space-y-3">
                    {selectedGuide.tips.map((tip, idx) => (
                      <div key={idx} className="p-3 bg-surface border border-outline-variant/20 rounded-md flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs font-bold text-on-surface-variant leading-relaxed">
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secure safety card */}
                <div className="bg-error-container/15 border border-error/30 p-4 rounded-lg flex items-start gap-3 text-error">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h4 className="text-[10px] font-black tracking-wider uppercase">PROCEDURAL EMERGENCY EXCEPTION</h4>
                    <p className="text-[10px] text-on-surface mt-1 font-bold leading-relaxed">
                      {selectedGuide.disclaimer}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
