import { 
  Info, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  MapPin, 
  Compass, 
  Play, 
  Volume2, 
  CheckCircle,
  HelpCircle,
  HeartPulse,
  Flame,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import AlertNowLogo from './AlertNowLogo';

interface AboutProps {
  onNavigateToView: (view: string) => void;
  onAskAI: (query: string) => void;
  highContrast: boolean;
}

export default function About({ onNavigateToView, onAskAI, highContrast }: AboutProps) {
  const launchPrompt = (num: number, title: string, query: string) => {
    onNavigateToView('ai');
    onAskAI(query);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Brand Header Card */}
      <div className={`p-6 rounded-lg border flex flex-col md:flex-row items-center gap-6 transition-all
        ${highContrast 
          ? 'bg-black border-white text-white' 
          : 'bg-gradient-to-br from-surface-container via-surface-container-high to-surface border-outline-variant/30 text-on-surface'}`}
      >
        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#D4AF37]/30 bg-[#0D0D0D] flex items-center justify-center shrink-0 shadow-lg shadow-primary/10">
          <AlertNowLogo className="w-full h-full" variant="icon" />
        </div>
        <div className="text-center md:text-left space-y-1.5">
          <span className="text-[10px] text-primary font-black uppercase tracking-widest bg-primary-container/10 px-2.5 py-1 rounded border border-primary/20">
            PLATFORM DOSSIER & SYSTEM INFORMATION
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-1">ALERTNOW</h2>
          <p className="text-sm font-bold text-primary font-mono tracking-wide uppercase">
            "INSTANT CONNECTION. ULTIMATE PROTECTION."
          </p>
        </div>
      </div>

      {/* Main Core Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Vision & Mission, Specifications (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Vision Statement */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-3">
            <h3 className="font-black text-xs text-primary uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              OUR SYSTEM VISION
            </h3>
            <p className="text-xs text-on-surface leading-relaxed font-bold">
              To provide every individual in Nigeria with zero-latency, offline-resilient access to emergency services, localized hotlines, medical identity profiles, and first-aid triage workflows—regardless of cellular network availability or server downtime.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-3">
            <h3 className="font-black text-xs text-primary uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              OUR PLATFORM MISSION
            </h3>
            <p className="text-xs text-on-surface leading-relaxed font-bold">
              Empowering citizens through high-performance client-side data persistence, rapid multi-channel emergency routing, real-time reverse-geocoded GPS coordinates telemetry, and reliable state-by-state control center directories.
            </p>
          </div>

          {/* Specifications Table */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
            <h3 className="font-black text-xs text-on-surface uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              TECHNICAL SPECIFICATIONS & METADATA
            </h3>
            
            <div className="divide-y divide-outline-variant/10 text-xs">
              <div className="py-2.5 flex justify-between items-center gap-4">
                <span className="text-on-surface-variant font-bold uppercase">App Tagline</span>
                <span className="font-bold text-on-surface text-right">Instant Connection. Ultimate Protection.</span>
              </div>
              <div className="py-2.5 flex justify-between items-center gap-4">
                <span className="text-on-surface-variant font-bold uppercase">Build Version</span>
                <span className="font-mono font-black text-primary bg-primary-container/10 px-2 py-0.5 rounded border border-primary/20">v2.5.0 (Offline-First Sentinel)</span>
              </div>
              <div className="py-2.5 flex justify-between items-center gap-4">
                <span className="text-on-surface-variant font-bold uppercase">Core Developer</span>
                <span className="font-bold text-on-surface text-right">AI Studio Agentic Workspace Engine</span>
              </div>
              <div className="py-2.5 flex justify-between items-center gap-4">
                <span className="text-on-surface-variant font-bold uppercase">Offline Database</span>
                <span className="font-bold text-on-surface font-mono">IndexedDB / LocalStorage</span>
              </div>
              <div className="py-2.5 flex justify-between items-center gap-4">
                <span className="text-on-surface-variant font-bold uppercase">Cloud Database Sync</span>
                <span className="font-bold text-on-surface font-mono">Firebase Firestore (Secure Bypass)</span>
              </div>
              <div className="py-2.5 flex justify-between items-center gap-4">
                <span className="text-on-surface-variant font-bold uppercase">Interactive Voice SOS</span>
                <span className="font-bold text-primary font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  ENABLED
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Prompt Shortcuts (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Prompt Hub */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] text-primary font-mono font-black uppercase tracking-wider block">QUICK LAUNCH SHORTCUTS</span>
              <h3 className="font-black text-xs text-on-surface uppercase tracking-wider">
                CLINICAL AI DIRECTIVES
              </h3>
            </div>
            
            <p className="text-[11px] text-on-surface-variant leading-relaxed font-bold">
              Select one of the validated emergency prompts below to instantly feed them to our Guardian AI assistant:
            </p>

            <div className="space-y-3.5">
              {/* Prompt No 1 */}
              <button 
                onClick={() => launchPrompt(1, "CPR Protocol", "Show me step-by-step CPR guide right now")}
                className="w-full text-left p-3 rounded bg-surface hover:bg-surface-container-highest border border-outline-variant/20 hover:border-primary/50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded bg-primary-container/10 text-primary shrink-0 group-hover:scale-105 transition-transform">
                  <HeartPulse className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black font-mono text-primary bg-primary/10 px-1 rounded">PROMPT #1</span>
                    <span className="text-xs font-black text-on-surface">CPR Resuscitation</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-mono mt-1 italic truncate max-w-xs">
                    "Show me step-by-step CPR guide..."
                  </p>
                </div>
              </button>

              {/* Prompt No 3 */}
              <button 
                onClick={() => launchPrompt(3, "Severe Bleeding Control", "How do I stop severe bleeding on an open wound?")}
                className="w-full text-left p-3 rounded bg-surface hover:bg-surface-container-highest border border-outline-variant/20 hover:border-primary/50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded bg-primary-container/10 text-primary shrink-0 group-hover:scale-105 transition-transform">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black font-mono text-primary bg-primary/10 px-1 rounded">PROMPT #3</span>
                    <span className="text-xs font-black text-on-surface">Bleeding Control</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-mono mt-1 italic truncate max-w-xs">
                    "How do I stop severe bleeding on an..."
                  </p>
                </div>
              </button>

              {/* Prompt No 4 */}
              <button 
                onClick={() => launchPrompt(4, "Severe Burn Treatment", "How should I treat a second-degree heat burn?")}
                className="w-full text-left p-3 rounded bg-surface hover:bg-surface-container-highest border border-outline-variant/20 hover:border-primary/50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded bg-primary-container/10 text-primary shrink-0 group-hover:scale-105 transition-transform">
                  <Flame className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black font-mono text-primary bg-primary/10 px-1 rounded">PROMPT #4</span>
                    <span className="text-xs font-black text-on-surface">Burn Treatment</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-mono mt-1 italic truncate max-w-xs">
                    "How should I treat a second-degree..."
                  </p>
                </div>
              </button>

              {/* Prompt No 10 */}
              <button 
                onClick={() => {
                  onNavigateToView('about');
                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.speak(new SpeechSynthesisUtterance("AlertNow Version 2.5.0 dossier loaded. Instant Connection, Ultimate Protection. Developed by AI Studio Agentic Workspace."));
                  }
                }}
                className="w-full text-left p-3 rounded bg-surface hover:bg-surface-container-highest border border-outline-variant/20 hover:border-primary/50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded bg-primary-container/10 text-primary shrink-0 group-hover:scale-105 transition-transform">
                  <Info className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black font-mono text-primary bg-primary/10 px-1 rounded">PROMPT #10</span>
                    <span className="text-xs font-black text-on-surface">System Dossier</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-mono mt-1 italic truncate max-w-xs">
                    "Tagline, version, developer, vision, mission, about..."
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Voice Activation Indicator Card */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-3">
            <h3 className="font-black text-xs text-on-surface uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" />
              VOICE SOS CHANNELS
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed font-bold">
              Shout <span className="text-error font-mono font-black bg-error/10 px-1 rounded">"Help Help"</span>, <span className="text-error font-mono font-black bg-error/10 px-1 rounded">"SOS SOS"</span>, or <span className="text-error font-mono font-black bg-error/10 px-1 rounded">"Danger Danger"</span> to activate direct rescue dispatches! Shout <span className="text-emerald-400 font-mono font-black bg-emerald-500/10 px-1 rounded">"Cancel SOS"</span>, <span className="text-emerald-400 font-mono font-black bg-emerald-500/10 px-1 rounded">"Deactivate"</span>, or <span className="text-emerald-400 font-mono font-black bg-emerald-500/10 px-1 rounded">"Safe Safe"</span> to cancel and return to the home screen instantly.
            </p>
            <button 
              onClick={() => onNavigateToView('settings')}
              className="w-full py-2 bg-primary/10 hover:bg-primary/25 border border-primary/20 text-primary font-black text-[10px] uppercase tracking-wider rounded transition-all text-center"
            >
              CONFIGURE VOICE SOS IN SETTINGS
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
