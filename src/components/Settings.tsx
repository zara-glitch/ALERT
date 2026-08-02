import { useState } from 'react';
import { 
  Settings, 
  Eye, 
  Trash2, 
  Volume2, 
  Sparkles, 
  ShieldCheck, 
  Heart,
  RefreshCw,
  Info,
  LogOut,
  Palette,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsProps {
  appTheme: 'dark' | 'executive';
  setAppTheme: (v: 'dark' | 'executive') => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  colorBlind: boolean;
  setColorBlind: (v: boolean) => void;
  speechEnabled: boolean;
  setSpeechEnabled: (v: boolean) => void;
  voiceSosEnabled: boolean;
  setVoiceSosEnabled: (v: boolean) => void;
  onLogout: () => void;
  onResetApp: () => void;
  userEmail?: string;
  onOpenVoiceOutsideModal?: () => void;
}

export default function SettingsView({
  appTheme,
  setAppTheme,
  highContrast,
  setHighContrast,
  colorBlind,
  setColorBlind,
  speechEnabled,
  setSpeechEnabled,
  voiceSosEnabled,
  setVoiceSosEnabled,
  onLogout,
  onResetApp,
  userEmail,
  onOpenVoiceOutsideModal
}: SettingsProps) {
  const [resetConfirm, setResetConfirm] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Settings Profile Header */}
      <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center font-black text-primary text-xl">
            {userEmail ? userEmail[0].toUpperCase() : 'C'}
          </div>
          <div>
            <h2 className="text-sm font-black text-on-surface uppercase tracking-wider">COMMAND CENTER PRESETS</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">{userEmail || 'Guest Commander Offline Profile'}</p>
          </div>
        </div>
      </div>

      {/* Visual Color Theme Selection (Preserving original theme + adding official executive theme) */}
      <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
        <h3 className="font-black text-xs text-on-surface uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          COLOR THEME & VISUAL ARCHETYPE
        </h3>
        <p className="text-[10px] text-on-surface-variant font-bold uppercase leading-relaxed">
          Select your preferred visual environment. Both presets preserve full emergency dispatch capability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Preset 1: Original Dark Sentinel */}
          <button
            onClick={() => setAppTheme('dark')}
            className={`p-4 rounded-lg border text-left transition-all relative flex flex-col justify-between group ${
              appTheme === 'dark' 
                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5 ring-1 ring-primary/40' 
                : 'border-outline-variant/30 bg-surface hover:border-outline-variant/60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black border border-amber-500/40 text-amber-400">
                  ORIGINAL THEME
                </span>
                {appTheme === 'dark' && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </div>
              <h4 className="text-xs font-black text-on-surface uppercase tracking-wide">
                DARK SENTINEL
              </h4>
              <p className="text-[10px] text-on-surface-variant leading-relaxed font-semibold">
                Original deep obsidian canvas (`#0A0A0A`) with high-contrast gold indicators (`#D4AF37`) tailored for night operations.
              </p>
            </div>

            {/* Visual Color Swatches Preview */}
            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-outline-variant/20">
              <span className="w-4 h-4 rounded-full bg-[#0A0A0A] border border-zinc-700" title="Canvas #0A0A0A" />
              <span className="w-4 h-4 rounded-full bg-[#161616] border border-zinc-700" title="Surface #161616" />
              <span className="w-4 h-4 rounded-full bg-[#D4AF37]" title="Gold Accent #D4AF37" />
              <span className="w-4 h-4 rounded-full bg-white" title="White Text" />
            </div>
          </button>

          {/* Preset 2: Official AlertNow Executive Gold & Ivory (From Uploaded Flyer) */}
          <button
            onClick={() => setAppTheme('executive')}
            className={`p-4 rounded-lg border text-left transition-all relative flex flex-col justify-between group ${
              appTheme === 'executive' 
                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5 ring-1 ring-primary/40' 
                : 'border-outline-variant/30 bg-surface hover:border-outline-variant/60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#0D0D0D] border border-[#D4AF37] text-[#D4AF37]">
                  OFFICIAL FLYER THEME
                </span>
                {appTheme === 'executive' && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </div>
              <h4 className="text-xs font-black text-on-surface uppercase tracking-wide">
                EXECUTIVE GOLD & IVORY
              </h4>
              <p className="text-[10px] text-on-surface-variant leading-relaxed font-semibold">
                Official corporate letterhead palette with obsidian header, light ivory document canvas (`#FAF9F5`), crisp white cards (`#FFFFFF`), and gold detailing.
              </p>
            </div>

            {/* Visual Color Swatches Preview */}
            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-outline-variant/20">
              <span className="w-4 h-4 rounded-full bg-[#0D0D0D] border border-zinc-800" title="Obsidian Header #0D0D0D" />
              <span className="w-4 h-4 rounded-full bg-[#FAF9F5] border border-amber-900/20" title="Ivory Canvas #FAF9F5" />
              <span className="w-4 h-4 rounded-full bg-[#FFFFFF] border border-zinc-300" title="White Card #FFFFFF" />
              <span className="w-4 h-4 rounded-full bg-[#B8860B]" title="Metallic Gold #B8860B" />
            </div>
          </button>
        </div>
      </div>

      {/* Accessibility Overrides */}
      <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
        <h3 className="font-black text-xs text-on-surface uppercase tracking-wider flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          ACCESSIBILITY ADAPTIVE FILTERS
        </h3>
        <p className="text-[10px] text-on-surface-variant font-bold uppercase leading-relaxed">
          Configure physical viewport overrides for low-visibility, high-glare, or high-stress environments.
        </p>

        <div className="space-y-3">
          {/* High Contrast */}
          <div className="flex items-center justify-between p-3.5 rounded bg-surface border border-outline-variant/20">
            <div>
              <h4 className="text-xs font-black text-on-surface uppercase">Pure High Contrast Mode</h4>
              <p className="text-[10px] text-on-surface-variant mt-0.5">Locks viewport colors to maximum brightness values (Black/White).</p>
            </div>
            <button 
              onClick={() => setHighContrast(!highContrast)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${highContrast ? 'bg-primary' : 'bg-surface-container-highest'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Color Blind */}
          <div className="flex items-center justify-between p-3.5 rounded bg-surface border border-outline-variant/20">
            <div>
              <h4 className="text-xs font-black text-on-surface uppercase">Protanopia / Deuteranopia Assist</h4>
              <p className="text-[10px] text-on-surface-variant mt-0.5">Remaps toxic red/green hazard warnings to high-intensity golden patterns.</p>
            </div>
            <button 
              onClick={() => setColorBlind(!colorBlind)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${colorBlind ? 'bg-primary' : 'bg-surface-container-highest'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${colorBlind ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Voice Speech Assistant */}
          <div className="flex items-center justify-between p-3.5 rounded bg-surface border border-outline-variant/20">
            <div>
              <h4 className="text-xs font-black text-on-surface uppercase">Voice Speech-to-Text Synthesizer</h4>
              <p className="text-[10px] text-on-surface-variant mt-0.5">Synthesize automatic verbal directions of step first-aid checklists aloud.</p>
            </div>
            <button 
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${speechEnabled ? 'bg-primary' : 'bg-surface-container-highest'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${speechEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Voice SOS (Hands-Free Verbal Activation) */}
          <div className="flex flex-col gap-3 p-3.5 rounded bg-surface border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-on-surface uppercase flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  Vocal Hands-Free Trigger (Voice SOS)
                </h4>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                  Continuously listen for vocal triggers like <strong className="text-primary font-mono bg-primary-container/20 px-1 rounded">"Help Help"</strong> or <strong className="text-primary font-mono bg-primary-container/20 px-1 rounded">"SOS SOS"</strong> to auto-trigger sirens & alerts.
                </p>
              </div>
              <button 
                onClick={() => setVoiceSosEnabled(!voiceSosEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors shrink-0 ${voiceSosEnabled ? 'bg-error' : 'bg-surface-container-highest'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${voiceSosEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            {voiceSosEnabled && (
              <div className="flex items-center gap-2 bg-neutral-900 border border-error/20 rounded p-2.5 mt-1.5">
                <span className="w-2 h-2 rounded-full bg-error animate-ping shrink-0" />
                <span className="text-[9px] font-mono font-bold text-error uppercase tracking-wider">
                  Active Listener: Say "Help Help", "SOS SOS" or "Danger Danger" to initiate dispatch
                </span>
                <div className="flex gap-0.5 h-3 items-end ml-auto">
                  {[4, 8, 3, 7, 5, 9, 2].map((v, i) => (
                    <span 
                      key={i} 
                      className="w-0.5 bg-error animate-pulse rounded-t-sm" 
                      style={{ height: `${v * 10}%`, animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {onOpenVoiceOutsideModal && (
              <div className="pt-2 border-t border-outline-variant/20 flex justify-between items-center">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                  Available Outside App / Lockscreen
                </span>
                <button
                  onClick={onOpenVoiceOutsideModal}
                  className="px-3 py-1.5 bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
                >
                  Configure Siri / Google Hands-Free Setup
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Safety System Hard-Reset */}
      <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
        <h3 className="font-black text-xs text-error uppercase tracking-wider flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-error" />
          HARD RECOVERY MATRIX
        </h3>
        <p className="text-[10px] text-on-surface-variant font-bold uppercase leading-relaxed">
          PURGE ALL CACHED DATABASES AND RETURN DEVICE CONFIGURATIONS TO ABSOLUTE MANUFACTURER STATE.
        </p>

        <div className="p-4 bg-error-container/10 border border-error/20 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-xs font-black text-on-surface uppercase text-error">Warning: Destructive Reset Action</h4>
            <p className="text-[10px] text-on-surface-variant mt-0.5">This destroys your offline IndexedDB and clears all user records.</p>
          </div>

          {!resetConfirm ? (
            <button 
              onClick={() => setResetConfirm(true)}
              className="px-4 py-2 bg-error text-white font-black text-xs uppercase tracking-wider rounded hover:bg-error/80 transition-colors active:scale-95"
            >
              PURGE DEVICE STORAGE
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={onResetApp}
                className="px-3 py-1.5 bg-error text-white font-black text-xs rounded hover:bg-error/80 transition-colors active:scale-95"
              >
                CONFIRM DESTRUCTION
              </button>
              <button 
                onClick={() => setResetConfirm(false)}
                className="px-3 py-1.5 bg-surface border border-outline-variant/40 text-on-surface text-xs font-bold rounded"
              >
                CANCEL
              </button>
            </div>
          )}
        </div>
      </div>

      {/* App version parameters */}
      <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-3">
        <h4 className="text-[10px] text-primary font-black uppercase tracking-wider">PLATFORM TELEMETRY INFORMATION</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] font-mono text-on-surface-variant font-bold uppercase">
          <div>
            <p className="text-[9px] text-neutral-500">BUILD VERSION</p>
            <p className="text-on-surface mt-0.5">ALERTNOW V2.5.0</p>
          </div>
          <div>
            <p className="text-[9px] text-neutral-500">DEVELOPER BRAND</p>
            <p className="text-on-surface mt-0.5 text-primary">AI STUDIO AGENTIC</p>
          </div>
          <div>
            <p className="text-[9px] text-neutral-500">TAGLINE PRINCIPLE</p>
            <p className="text-on-surface mt-0.5">SWIFT LOCAL RESILIENT</p>
          </div>
          <div>
            <p className="text-[9px] text-neutral-500">OFFLINE SYNC STATE</p>
            <p className="text-on-surface mt-0.5">INDEXEDDB ACTIVE</p>
          </div>
        </div>
      </div>

    </div>
  );
}
