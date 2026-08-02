import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  ShieldAlert, 
  Sparkles, 
  Camera, 
  Trash2, 
  AlertTriangle,
  Play,
  CheckCircle2,
  PhoneCall,
  User,
  HeartCrack,
  Activity,
  ArrowRight,
  Info,
  X,
  Building2,
  Wifi,
  WifiOff,
  Stethoscope,
  SendHorizontal,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message, UserProfile } from '../types';
import { generateIncidentRef } from '../utils/emergencyReport';

interface AIAssistantProps {
  messages: Message[];
  onSendMessage: (text: string, imageUrl?: string) => void;
  onClearHistory: () => void;
  userMedicalContext: UserProfile | null;
  highContrast: boolean;
  onTriggerSOS?: () => void;
}

const PRESETS = [
  { label: '🔥 Fire Evacuation Protocol', query: 'Show me the official Fire Emergency protocol steps.' },
  { label: '🚗 Road Crash Protocol', query: 'Show me the Road Traffic Accident emergency protocol.' },
  { label: '🩸 Severe Bleeding Protocol', query: 'What is the ALERTNOW protocol for stopping severe bleeding?' },
  { label: '🔥 Burn Emergency Protocol', query: 'Show me the Burn Emergency first aid protocol.' },
  { label: '🫁 Choking Emergency Protocol', query: 'Show me the step-by-step Choking Emergency protocol.' },
  { label: '🐍 Snakebite Protocol', query: 'What is the ALERTNOW protocol for snakebite emergency?' }
];

export default function AIAssistant({
  messages,
  onSendMessage,
  onClearHistory,
  userMedicalContext,
  highContrast,
  onTriggerSOS
}: AIAssistantProps) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadImg, setUploadImg] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [handoffStatus, setHandoffStatus] = useState<'IDLE' | 'TRANSMITTING' | 'HANDED_OFF'>('IDLE');
  const [handoffRef, setHandoffRef] = useState<string | null>(null);

  // Live Camera states
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setShowCamera(true);
    setCameraError(null);
    setTimeout(async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera API is not supported on this browser.");
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        setCameraError(err.message || "Failed to prompt device media permissions.");
      }
    }, 100);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const captureSnapshot = () => {
    if (videoRef.current) {
      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          setUploadImg(dataUrl);
        }
        stopCamera();
      } catch (err: any) {
        setCameraError("Capture failed: " + err.message);
      }
    }
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const txt = inputText.trim();
    if (txt || uploadImg) {
      setLoading(true);
      onSendMessage(txt || "Analyzed injury attachment.", uploadImg || undefined);
      setInputText('');
      setUploadImg(null);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  const handlePresetClick = (query: string) => {
    setLoading(true);
    onSendMessage(query);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const handleInitiateClinicalHandoff = () => {
    const ref = generateIncidentRef();
    setHandoffRef(ref);
    setHandoffStatus('TRANSMITTING');

    setTimeout(() => {
      setHandoffStatus('HANDED_OFF');
    }, 2500);
  };

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)]">
      
      {/* Visual Pipeline Indicator */}
      <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-3 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-mono font-black text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-primary" />
            TRIAGE & DISPATCH WORKFLOW PIPELINE
          </span>
          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
            isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isOnline ? 'ONLINE' : 'OFFLINE MODE (LOCAL AI CACHE)'}
          </span>
        </div>

        {/* 3-Stage Pipeline */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-black uppercase">
          <div className="p-2 bg-primary/10 border border-primary/30 text-primary rounded-lg">
            1. AI Triage Guidance
          </div>
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg">
            2. 112 Dispatch Call
          </div>
          <div className="p-2 bg-sky-500/10 border border-sky-500/30 text-sky-400 rounded-lg">
            3. Clinical Command Center
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 bg-surface-container border border-outline-variant/30 rounded-xl flex flex-col overflow-hidden min-h-0 relative">
        
        {/* Real Live Camera Viewport Overlay */}
        <AnimatePresence>
          {showCamera && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute inset-0 bg-zinc-950/95 z-20 flex flex-col justify-between p-4 rounded-xl"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-black tracking-widest text-primary uppercase">LIVE GUARDIAN CAMERA SYSTEM</span>
                </div>
                <button 
                  type="button"
                  onClick={stopCamera}
                  className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 my-4 bg-black border border-zinc-900 rounded-lg overflow-hidden relative flex items-center justify-center min-h-0">
                {cameraError ? (
                  <div className="p-4 text-center space-y-3 max-w-sm">
                    <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto animate-pulse" />
                    <p className="text-xs font-black text-white uppercase tracking-wider">Camera API Unavailable</p>
                    <p className="text-[10px] text-zinc-400 leading-relaxed font-bold">{cameraError}</p>
                  </div>
                ) : (
                  <>
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted
                      className="w-full h-full object-cover transform -scale-x-100" 
                    />
                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/80 border border-primary/20 rounded text-[9px] text-primary font-mono tracking-widest uppercase">
                      SECURE LIVE FEED
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 py-2 shrink-0 border-t border-zinc-800">
                {!cameraError && (
                  <button
                    type="button"
                    onClick={captureSnapshot}
                    className="px-6 py-3 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-full hover:brightness-110 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <Camera className="w-4.5 h-4.5" />
                    <span>CAP FRAME</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all"
                >
                  Close Stream
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Header Bar */}
        <div className="px-4 py-3 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-high shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-black text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                ALERTNOW AI CLINICAL ASSISTANT
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </h3>
              <p className="text-[9px] text-on-surface-variant font-bold uppercase">Broad Emergency & First Aid Guidance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInitiateClinicalHandoff}
              className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all"
            >
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Clinical Handoff</span>
            </button>

            <button 
              onClick={onClearHistory}
              className="p-1.5 hover:bg-error-container/10 hover:text-error rounded transition-colors text-on-surface-variant"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clinical Command Center Handoff Status Box */}
        {handoffStatus !== 'IDLE' && (
          <div className="p-3 bg-sky-500/10 border-b border-sky-500/30 text-xs font-bold text-sky-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-400 animate-pulse" />
              <div>
                <span className="font-black uppercase block">
                  {handoffStatus === 'TRANSMITTING' ? 'Transmitting Triage Payload to Clinical Command Center...' : 'Handoff Transmitted Successfully'}
                </span>
                <span className="text-[10px] font-mono text-sky-300">
                  Incident Ref: {handoffRef} • Direct 112 Helpline available
                </span>
              </div>
            </div>

            <button
              onClick={() => setHandoffStatus('IDLE')}
              className="text-sky-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Message Bubble list stream */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-surface-container/30"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-5 px-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary animate-bounce">
                <Bot className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-on-surface uppercase tracking-wider">ALERTNOW BROAD EMERGENCY ASSISTANT</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed font-bold">
                  Ask any question regarding medical emergencies, trauma triage, security threats, or disaster protocols.
                </p>
              </div>

              {/* Preset Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetClick(p.query)}
                    className="p-2.5 bg-surface border border-outline-variant/30 hover:border-primary rounded-lg text-left transition-all hover:bg-surface-container-high group active:scale-95 flex items-center justify-between"
                  >
                    <span className="text-[11px] font-bold text-on-surface group-hover:text-primary transition-colors">{p.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0
                  ${msg.sender === 'user' 
                    ? 'bg-primary/15 border-primary/30 text-primary' 
                    : 'bg-zinc-800 border-zinc-700 text-white'}`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-1.5">
                  <div className={`p-3.5 rounded-xl border text-xs leading-relaxed font-bold shadow-sm whitespace-pre-wrap
                    ${msg.sender === 'user'
                      ? (highContrast ? 'bg-zinc-800 border-white text-white' : 'bg-surface-container-highest border-outline-variant/40 text-on-surface')
                      : (highContrast ? 'bg-black border-white text-zinc-300' : 'bg-surface-container-low border-outline-variant/20 text-on-surface')}`}
                  >
                    {msg.imageUrl && (
                      <div className="mb-2 max-w-xs rounded overflow-hidden border border-outline-variant/40">
                        <img src={msg.imageUrl} alt="Wound capture attachment" className="w-full h-auto object-cover" />
                      </div>
                    )}
                    {msg.text}
                  </div>
                  
                  <p className="text-[9px] text-on-surface-variant font-mono font-bold uppercase tracking-wider text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-3 mr-auto max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center shrink-0 animate-bounce">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 bg-surface-container-low border border-outline-variant/20 rounded-xl text-xs font-mono font-bold text-primary flex items-center gap-2">
                <Activity className="w-4 h-4 animate-spin text-primary" />
                <span>PROCESSING CLINICAL EMERGENCY ADVICE...</span>
              </div>
            </div>
          )}
        </div>

        {/* Form input controls */}
        <div className="p-3 bg-surface-container-high border-t border-outline-variant/20 shrink-0">
          <form onSubmit={handleSubmit} className="space-y-2">
            
            {uploadImg && (
              <div className="flex items-center justify-between p-2 rounded bg-surface border border-outline-variant/30 max-w-sm">
                <div className="flex items-center gap-2">
                  <img src={uploadImg} alt="Thumbnail preview" className="w-10 h-10 object-cover rounded border border-outline-variant/40" />
                  <span className="text-[10px] text-primary font-mono font-bold uppercase">PHOTO STAGED</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setUploadImg(null)}
                  className="text-xs text-error font-bold hover:underline"
                >
                  REMOVE
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <button 
                type="button"
                onClick={startCamera}
                className="p-3 bg-surface hover:bg-surface-container-highest border border-outline-variant/40 text-primary rounded-xl transition-colors active:scale-95"
                title="Capture injury picture"
              >
                <Camera className="w-5 h-5" />
              </button>

              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Guardian AI regarding any medical or emergency situation..."
                className="flex-1 bg-surface border border-outline-variant/40 rounded-xl px-4 py-3 text-xs text-on-surface font-bold focus:border-primary focus:outline-none"
              />

              <button 
                type="submit"
                disabled={!inputText.trim() && !uploadImg}
                className="p-3 bg-primary text-black hover:bg-primary/80 disabled:opacity-50 disabled:hover:bg-primary rounded-xl transition-all active:scale-95 shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
