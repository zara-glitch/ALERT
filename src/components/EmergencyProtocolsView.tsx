import { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  PhoneCall, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  HeartPulse, 
  Car, 
  ShieldCheck, 
  Activity,
  ChevronRight,
  Info,
  Lock,
  Building,
  Zap,
  Droplets,
  Skull
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { emergencyProtocols, getProtocolForCategory } from '../data/emergencyProtocols';
import { EmergencyProtocol } from '../types';

interface EmergencyProtocolsViewProps {
  highContrast: boolean;
  onTriggerSOS?: () => void;
  onLaunchSOSForCategory?: (category: string) => void;
  onOpenEmailReportModal?: (category: string, phone: string) => void;
}

export default function EmergencyProtocolsView({
  highContrast,
  onLaunchSOSForCategory,
  onOpenEmailReportModal
}: EmergencyProtocolsViewProps) {
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>(emergencyProtocols[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const activeProtocol: EmergencyProtocol = emergencyProtocols.find(p => p.id === selectedProtocolId) || emergencyProtocols[0];

  const handleToggleStep = (stepId: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Fire Emergency': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Road Traffic Accident': return <Car className="w-5 h-5 text-sky-400" />;
      case 'Severe Bleeding': return <HeartPulse className="w-5 h-5 text-rose-400" />;
      case 'Burn Emergency': return <Flame className="w-5 h-5 text-amber-500" />;
      case 'Choking': return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'Unconscious Person': return <Activity className="w-5 h-5 text-rose-500" />;
      case 'Allergic Reaction': return <HeartPulse className="w-5 h-5 text-purple-400" />;
      case 'Building Collapse': return <Building className="w-5 h-5 text-orange-400" />;
      case 'Armed Robbery': return <ShieldCheck className="w-5 h-5 text-red-500" />;
      case 'Abduction / Kidnapping': return <Lock className="w-5 h-5 text-red-400" />;
      case 'Snake Bite & Poisoning': return <Skull className="w-5 h-5 text-emerald-400" />;
      case 'Severe Asthma Attack': return <Activity className="w-5 h-5 text-sky-300" />;
      case 'Electric Shock': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Flooding & Disaster': return <Droplets className="w-5 h-5 text-cyan-400" />;
      default: return <ShieldAlert className="w-5 h-5 text-primary" />;
    }
  };

  const filteredProtocols = emergencyProtocols.filter(p => {
    const matchesSeverity = selectedSeverity === 'All' || p.severity === selectedSeverity;
    if (!matchesSeverity) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.category.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.dosAndDonts.do.some(d => d.toLowerCase().includes(q)) ||
      p.steps.some(s => s.text.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-surface-container to-surface border border-amber-500/30 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider rounded">
              VERIFIED SYSTEM PROTOCOLS
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% PREDEFINED SAFETY ENGINE
            </span>
          </div>
          <h2 className="text-lg font-black text-on-surface uppercase tracking-tight mt-1">
            ALERTNOW Predefined Emergency Protocol Library
          </h2>
          <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed max-w-2xl">
            Select an emergency situation below. ALERTNOW instantly provides the official, step-by-step safety guidance and connects directly to emergency responders.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface border border-outline-variant/30 px-3 py-2 rounded-xl text-xs font-mono font-bold text-amber-400 shrink-0">
          <Lock className="w-4 h-4" />
          <span>USER PROTOCOL CREATION DISABLED</span>
        </div>
      </div>

      {/* Main Grid: Catalog Selector (Left) & Active Protocol Stepper (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Predefined Emergency Search & Selector (Span 4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Search & Severity Filter Bar */}
          <div className="bg-surface-container border border-outline-variant/30 p-4 rounded-xl space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3.5" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search emergency (Fire, Bleeding, Crash, Robbery...)"
                className="w-full bg-surface border border-outline-variant/40 rounded-xl pl-10 pr-4 py-2 text-xs text-on-surface font-bold focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono font-black text-on-surface-variant uppercase pt-1 border-t border-outline-variant/10">
              <span>Filter Priority:</span>
              <div className="flex gap-1">
                {['All', 'Critical', 'High'].map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      selectedSeverity === sev 
                        ? 'bg-amber-400 text-black' 
                        : 'bg-surface hover:bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Protocols List */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-3 space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredProtocols.length > 0 ? (
              filteredProtocols.map(p => {
                const isActive = p.id === selectedProtocolId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProtocolId(p.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3
                      ${isActive 
                        ? 'bg-primary-container/15 border-amber-400 shadow-md ring-1 ring-amber-400/40' 
                        : 'bg-surface border-outline-variant/20 hover:border-outline-variant/50 text-on-surface-variant'}`}
                  >
                    <div className="p-2 bg-surface-container-high rounded-lg shrink-0 border border-outline-variant/20">
                      {getCategoryIcon(p.category)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider truncate">
                          {p.category}
                        </span>
                        <span className={`text-[8px] font-mono font-black px-1.5 py-0.5 rounded uppercase ${
                          p.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {p.severity}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-on-surface truncate mt-0.5">{p.title}</h4>
                      <p className="text-[10px] text-on-surface-variant truncate mt-0.5">{p.summary}</p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-6 text-center text-on-surface-variant text-xs font-bold">
                No matching predefined protocols found. Try searching "Fire", "Accident", or "Bleeding".
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Problem-Specific Protocol Viewer (Span 8) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeProtocol.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6 space-y-6 shadow-xl"
            >
              
              {/* Protocol Title & Actions Header */}
              <div className="border-b border-outline-variant/20 pb-5 space-y-3">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-400/10 border border-amber-400/30 rounded-xl">
                      {getCategoryIcon(activeProtocol.category)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest">
                        {activeProtocol.category.toUpperCase()} PROTOCOL
                      </span>
                      <h3 className="text-base font-black text-on-surface uppercase tracking-tight">
                        {activeProtocol.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${activeProtocol.agencyToCall}`}
                      className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-black rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>DIAL {activeProtocol.agencyToCall}</span>
                    </a>

                    {onLaunchSOSForCategory && (
                      <button
                        onClick={() => onLaunchSOSForCategory(activeProtocol.category)}
                        className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow animate-pulse"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>LAUNCH SOS</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant font-medium leading-relaxed bg-surface/60 p-3 rounded-xl border border-outline-variant/20">
                  ⚡ <strong>Emergency Directives:</strong> {activeProtocol.summary}
                </p>
              </div>

              {/* Step-by-Step Action Checkpoints */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-xs text-on-surface uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    STEP-BY-STEP ACTION PROTOCOL
                  </h4>
                  <span className="text-[10px] font-mono text-on-surface-variant">
                    {activeProtocol.steps.length} Step Sequence
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeProtocol.steps.map((step) => {
                    const isDone = !!completedSteps[step.id];
                    return (
                      <div 
                        key={step.id}
                        onClick={() => handleToggleStep(step.id)}
                        className={`p-4 border rounded-xl flex items-start gap-3.5 cursor-pointer select-none transition-all duration-150 active:scale-99
                          ${isDone 
                            ? 'bg-emerald-500/10 border-emerald-500/40 opacity-75' 
                            : 'bg-surface border-outline-variant/30 hover:border-outline-variant/60 shadow-sm'}`}
                      >
                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 text-xs font-black transition-colors mt-0.5
                          ${isDone ? 'bg-emerald-500 text-black border-emerald-500' : 'border-outline-variant/50 bg-surface-container-high text-on-surface'}`}
                        >
                          {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
                        </div>

                        <div className="space-y-1">
                          <h5 className={`text-xs font-black leading-snug ${isDone ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
                            {step.text}
                          </h5>
                          {step.detail && (
                            <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed">
                              {step.detail}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Do's & Don'ts Predefined Safety Guidance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* DO's */}
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                  <h5 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    WHAT YOU MUST DO
                  </h5>
                  <ul className="space-y-1.5">
                    {activeProtocol.dosAndDonts.do.map((item, i) => (
                      <li key={i} className="text-[11px] font-bold text-on-surface flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* DONT's */}
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-2">
                  <h5 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    WHAT YOU MUST NEVER DO
                  </h5>
                  <ul className="space-y-1.5">
                    {activeProtocol.dosAndDonts.dont.map((item, i) => (
                      <li key={i} className="text-[11px] font-bold text-on-surface flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Emergency Email Dispatch Action Footer */}
              <div className="pt-4 border-t border-outline-variant/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-bold uppercase">
                    ✓ Verified Protocol Standard
                  </span>
                </div>

                {onOpenEmailReportModal && (
                  <button
                    onClick={() => onOpenEmailReportModal(activeProtocol.category, activeProtocol.agencyToCall)}
                    className="px-4 py-2 bg-sky-500/20 text-sky-300 border border-sky-400/40 hover:bg-sky-500/30 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all"
                  >
                    <span>Generate Official Email Report</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
