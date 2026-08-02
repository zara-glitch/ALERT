import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  ShieldAlert, 
  Radio, 
  Bell, 
  Zap, 
  Volume2, 
  Layers, 
  ArrowRight,
  Sparkles,
  Command,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceSosOutsideModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceSosEnabled: boolean;
  setVoiceSosEnabled: (v: boolean) => void;
  onTestTrigger: () => void;
}

export default function VoiceSosOutsideModal({
  isOpen,
  onClose,
  voiceSosEnabled,
  setVoiceSosEnabled,
  onTestTrigger
}: VoiceSosOutsideModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'siri' | 'google' | 'pwa' | 'background'>('siri');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<string>('default');

  const [showUrlDetails, setShowUrlDetails] = useState(false);

  // Detect origin & construct direct voice launch URL
  const launcherUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?trigger=voice`
    : 'https://app.alertnowcare.com/?trigger=voice';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('Notification' in window) {
        setNotificationStatus(Notification.permission);
      }
      
      const handleBeforeInstallPrompt = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const copyLauncherUrl = () => {
    navigator.clipboard.writeText(launcherUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotificationStatus(perm);
      if (perm === 'granted') {
        new Notification('AlertNow Voice SOS Sentinel Active', {
          body: "Listening in background for emergency phrases: 'Help Help', 'SOS SOS', or 'Emergency'.",
          icon: '/icon.png',
          tag: 'alertnow-voicesos'
        });
      }
    }
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert("To install AlertNow to your home screen on iOS:\n1. Tap the Share button in Safari.\n2. Tap 'Add to Home Screen'.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-surface border border-outline-variant/40 rounded-xl max-w-2xl w-full text-on-surface shadow-2xl overflow-hidden my-auto"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-outline-variant/30 p-5 relative">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shrink-0">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] font-mono text-primary font-black uppercase tracking-widest block">
                  OUTSIDE-APP HANDS-FREE ACTIVATION
                </span>
                <h2 className="text-base font-black text-on-surface uppercase tracking-wide">
                  Outside App Voice SOS Sentinel
                </h2>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant font-semibold mt-2 leading-relaxed">
              Trigger instant hands-free rescue dispatches even when your screen is locked or you are outside the browser tab using Siri, Google Assistant, or physical phone shortcuts.
            </p>
          </div>

          {/* Direct URL-Free Voice Sentinel Activation Card */}
          <div className="p-5 space-y-5">
            <div className={`border rounded-lg p-5 space-y-4 transition-all ${
              voiceSosEnabled 
                ? 'bg-primary/10 border-primary shadow-lg shadow-primary/5' 
                : 'bg-surface-container-low border-outline-variant/40'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                    voiceSosEnabled 
                      ? 'bg-primary text-black border-primary animate-pulse' 
                      : 'bg-surface-container-high text-on-surface-variant border-outline-variant/30'
                  }`}>
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-primary font-black uppercase tracking-wider block">
                      URL-FREE DIRECT VOICE ACTIVATION
                    </span>
                    <h3 className="text-sm font-black text-on-surface uppercase">
                      {voiceSosEnabled ? 'Voice SOS Sentinel Active & Listening' : 'Enable Direct Microphone Voice SOS'}
                    </h3>
                    <p className="text-xs text-on-surface-variant font-semibold mt-0.5">
                      No URLs needed! Just turn this on to enable automatic speech recognition across your device.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setVoiceSosEnabled(!voiceSosEnabled)}
                  className={`w-full sm:w-auto px-5 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shrink-0 ${
                    voiceSosEnabled 
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-md' 
                      : 'bg-primary text-black hover:brightness-110 shadow-md'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {voiceSosEnabled ? 'Voice SOS Enabled' : 'Turn On Voice SOS Now'}
                </button>
              </div>

              {/* Status bar */}
              <div className="bg-surface/80 border border-outline-variant/30 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${voiceSosEnabled ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'}`} />
                  <span className="text-on-surface font-mono font-bold">
                    TRIGGER PHRASES: <span className="text-error font-mono font-black">"Help Help"</span> | <span className="text-error font-mono font-black">"SOS"</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-on-surface font-mono font-bold">
                    CANCEL PHRASES: <span className="text-emerald-400 font-mono font-black">"Cancel SOS"</span> | <span className="text-emerald-400 font-mono font-black">"Deactivate"</span>
                  </span>
                </div>
              </div>
            </div>

            {/* URL-Free Methods & Shortcuts */}
            <div className="border-b border-outline-variant/30 flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('background')}
                className={`px-3 py-2 rounded-t-lg text-xs font-black uppercase transition-all flex items-center gap-1.5 shrink-0 border-b-2 ${
                  activeTab === 'background'
                    ? 'border-primary text-primary bg-surface-container-high'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                BACKGROUND MIC SENTINEL
              </button>

              <button
                onClick={() => setActiveTab('pwa')}
                className={`px-3 py-2 rounded-t-lg text-xs font-black uppercase transition-all flex items-center gap-1.5 shrink-0 border-b-2 ${
                  activeTab === 'pwa'
                    ? 'border-primary text-primary bg-surface-container-high'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                DIRECT HOME SCREEN APP
              </button>

              <button
                onClick={() => setActiveTab('siri')}
                className={`px-3 py-2 rounded-t-lg text-xs font-black uppercase transition-all flex items-center gap-1.5 shrink-0 border-b-2 ${
                  activeTab === 'siri'
                    ? 'border-primary text-primary bg-surface-container-high'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Command className="w-3.5 h-3.5" />
                iOS / SIRI
              </button>

              <button
                onClick={() => setActiveTab('google')}
                className={`px-3 py-2 rounded-t-lg text-xs font-black uppercase transition-all flex items-center gap-1.5 shrink-0 border-b-2 ${
                  activeTab === 'google'
                    ? 'border-primary text-primary bg-surface-container-high'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                GOOGLE ASSISTANT
              </button>
            </div>

            {/* Tab Content 1: Siri Shortcuts */}
            {activeTab === 'siri' && (
              <div className="space-y-4">
                <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/30 space-y-3">
                  <h4 className="text-xs font-black text-on-surface uppercase flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-mono">1</span>
                    Set up "Hey Siri, Voice SOS" (iPhone / iPad)
                  </h4>

                  <ol className="text-xs text-on-surface-variant space-y-2.5 font-semibold list-decimal pl-4 leading-relaxed">
                    <li>
                      Copy your direct trigger URL using the <strong className="text-primary font-bold">"COPY LINK"</strong> button above.
                    </li>
                    <li>
                      Open the <strong className="text-on-surface">Shortcuts App</strong> on your iPhone.
                    </li>
                    <li>
                      Tap the <strong className="text-on-surface font-bold text-primary">+</strong> icon, name the shortcut <strong className="text-primary font-mono">"Voice SOS"</strong> or <strong className="text-primary font-mono font-bold">"Emergency Alert"</strong>.
                    </li>
                    <li>
                      Add Action: Search for <strong className="text-on-surface font-bold">"Open URLs"</strong> and paste your copied AlertNow trigger link.
                    </li>
                    <li>
                      <strong className="text-emerald-400 font-bold">All Set!</strong> Now say <strong className="text-primary font-black">"Hey Siri, Voice SOS"</strong> anytime—even when your screen is locked—to trigger immediate Voice SOS!
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* Tab Content 2: Google Assistant */}
            {activeTab === 'google' && (
              <div className="space-y-4">
                <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/30 space-y-3">
                  <h4 className="text-xs font-black text-on-surface uppercase flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-mono">2</span>
                    Set up "OK Google, AlertNow SOS" (Android)
                  </h4>

                  <ol className="text-xs text-on-surface-variant space-y-2.5 font-semibold list-decimal pl-4 leading-relaxed">
                    <li>
                      Open <strong className="text-on-surface">Google Assistant Settings</strong> on your Android phone and select <strong className="text-on-surface">Routines</strong>.
                    </li>
                    <li>
                      Tap <strong className="text-primary font-bold">New Routine</strong> and add Starter: <strong className="text-primary font-mono">"When I say OK Google, Emergency SOS"</strong>.
                    </li>
                    <li>
                      Add Action: <strong className="text-on-surface font-bold">Open Web Link</strong> &rarr; paste your copied AlertNow trigger URL.
                    </li>
                    <li>
                      Optional: Map your phone's power button double-press to launch the AlertNow shortcut directly!
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* Tab Content 3: Background Listener */}
            {activeTab === 'background' && (
              <div className="space-y-4">
                <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/30 space-y-3">
                  <h4 className="text-xs font-black text-on-surface uppercase flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    Background Voice Microphone & Notification Keep-Alive
                  </h4>
                  <p className="text-xs text-on-surface-variant font-semibold leading-relaxed">
                    When Voice SOS Sentinel is toggled ON, AlertNow holds a low-power audio speech session and sends a persistent notification so speech recognition stays alive even when minimizing the browser window.
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-outline-variant/20">
                    <div>
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase block">Browser Notification Permission</span>
                      <span className={`text-xs font-mono font-black uppercase ${
                        notificationStatus === 'granted' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        STATUS: {notificationStatus.toUpperCase()}
                      </span>
                    </div>

                    {notificationStatus !== 'granted' && (
                      <button
                        onClick={requestNotificationPermission}
                        className="px-3 py-1.5 bg-primary text-black rounded text-xs font-black uppercase hover:brightness-110"
                      >
                        Grant Notification Permission
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content 4: PWA Home Screen */}
            {activeTab === 'pwa' && (
              <div className="space-y-4">
                <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/30 space-y-3">
                  <h4 className="text-xs font-black text-on-surface uppercase flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-primary" />
                    Install Standalone Phone Lockscreen Shortcut
                  </h4>
                  <p className="text-xs text-on-surface-variant font-semibold leading-relaxed">
                    Installing AlertNow as a standalone Progressive Web App (PWA) adds 1-tap lockscreen emergency shortcuts directly to your phone.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={handleInstallPWA}
                      className="w-full py-2.5 bg-primary text-black rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      {isInstalled ? 'App Installed on Home Screen' : 'Install AlertNow to Phone Home Screen'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Master Toggle Bar */}
            <div className="bg-surface-container-high border border-outline-variant/30 rounded-lg p-4 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-on-surface uppercase">
                  BACKGROUND VOICE SOS SENTINEL
                </h4>
                <p className="text-[10px] text-on-surface-variant font-semibold">
                  Listens for emergency trigger phrases ("Help Help", "SOS") and cancellation phrases ("Cancel SOS", "Deactivate").
                </p>
              </div>

              <button
                onClick={() => setVoiceSosEnabled(!voiceSosEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  voiceSosEnabled ? 'bg-primary' : 'bg-surface-container-highest'
                }`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    voiceSosEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} 
                />
              </button>
            </div>

            {/* Optional Collapsible URL Section for System Routines */}
            <div className="border border-outline-variant/20 rounded-lg p-3 bg-surface/50">
              <button
                onClick={() => setShowUrlDetails(!showUrlDetails)}
                className="w-full text-left text-[11px] font-mono text-on-surface-variant hover:text-on-surface flex justify-between items-center font-bold uppercase"
              >
                <span>Optional: Advanced System Deep Link URL</span>
                <span className="text-primary">{showUrlDetails ? '[-] HIDE' : '[+] SHOW'}</span>
              </button>

              {showUrlDetails && (
                <div className="mt-3 space-y-2 pt-2 border-t border-outline-variant/20">
                  <p className="text-[10px] text-on-surface-variant font-semibold">
                    If you prefer configuring Siri or Tasker with a custom webhook URL:
                  </p>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={launcherUrl}
                      className="w-full bg-surface border border-outline-variant/40 rounded px-2.5 py-1.5 text-[11px] font-mono text-primary font-bold focus:outline-none select-all"
                    />
                    <button
                      onClick={copyLauncherUrl}
                      className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 transition-all ${
                        copied ? 'bg-emerald-600 text-white' : 'bg-primary text-black hover:brightness-110'
                      }`}
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer controls */}
          <div className="bg-surface-container-low border-t border-outline-variant/30 p-4 flex justify-between items-center">
            <button
              onClick={onTestTrigger}
              className="px-4 py-2 bg-error/10 border border-error/30 text-error rounded-lg text-xs font-black uppercase hover:bg-error hover:text-white transition-all flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              Simulate Outside SOS Launch
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-primary text-black rounded-lg text-xs font-black uppercase tracking-wider hover:brightness-110"
            >
              Done / Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
