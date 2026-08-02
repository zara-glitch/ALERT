import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Phone, 
  MessageSquare, 
  Share2, 
  Copy, 
  Volume2, 
  VolumeX, 
  Camera, 
  Check, 
  Video, 
  Map, 
  Lock, 
  Zap, 
  RefreshCw,
  PhoneCall,
  Flame,
  User,
  HeartCrack,
  Mic,
  Radio,
  ExternalLink,
  XCircle,
  ShieldOff,
  QrCode,
  Mail,
  X,
  MapPin,
  CheckCircle2,
  FileText,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EmergencyContact, UserProfile } from '../types';
import { 
  EmergencyIncidentData, 
  generateIncidentRef, 
  generateEmergencyEmailHref, 
  generateEmergencyWhatsAppHref 
} from '../utils/emergencyReport';
import EmergencyBarcodeModal from './EmergencyBarcodeModal';
import EmergencyStatusTracker from './EmergencyStatusTracker';
import EmergencyEmailModal from './EmergencyEmailModal';

interface EmergencySOSProps {
  userProfile: UserProfile | null;
  contacts: EmergencyContact[];
  currentLocation: { lat: number; lng: number; address: string } | null;
  highContrast: boolean;
  colorBlind: boolean;
  isPowerSaver?: boolean;
  onOpenVoiceOutsideModal?: () => void;
  voiceSosEnabled?: boolean;
  onDeactivateSOS?: () => void;
  onNavigateHome?: () => void;
}

export default function EmergencySOS({
  userProfile,
  contacts,
  currentLocation,
  highContrast,
  colorBlind,
  isPowerSaver = false,
  onOpenVoiceOutsideModal,
  voiceSosEnabled,
  onDeactivateSOS,
  onNavigateHome
}: EmergencySOSProps) {
  // SOS Mode state: 'IDLE' (hold trigger deck) | 'CONFIRM' (Confirm Dispatch Screen) | 'TRACKING' (Live Status Lifecycle)
  const [sosState, setSosState] = useState<'IDLE' | 'CONFIRM' | 'TRACKING'>('IDLE');
  
  // Pending incident data for confirmation / dispatch
  const [incidentData, setIncidentData] = useState<EmergencyIncidentData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Medical Emergency');
  const [selectedService, setSelectedService] = useState<{ name: string; phone: string }>({
    name: '112 National Emergency Lifeline',
    phone: '112'
  });

  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isSOSTriggered, setIsSOSTriggered] = useState(false);
  const [isSirenOn, setIsSirenOn] = useState(false);
  const [photosCaptured, setPhotosCaptured] = useState<string[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const pressInterval = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sirenOsc1 = useRef<OscillatorNode | null>(null);
  const sirenOsc2 = useRef<OscillatorNode | null>(null);
  const sirenIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      silenceAllAudioAndTimers();
      stopCameraStream();
    };
  }, []);

  // Handle hold trigger
  useEffect(() => {
    if (isPressing && sosState === 'IDLE') {
      pressInterval.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            initiateConfirmDispatch('General Emergency', '112 National Emergency Helpline', '112');
            return 100;
          }
          return p + 3.33;
        });
      }, 100);
    } else {
      if (pressInterval.current) {
        clearInterval(pressInterval.current);
      }
      if (sosState === 'IDLE') {
        setProgress(0);
      }
    }

    return () => {
      if (pressInterval.current) clearInterval(pressInterval.current);
    };
  }, [isPressing, sosState]);

  // Master Silence & Clean Cancellation (Zero Beeps, Zero sirens, Zero residual tones)
  const silenceAllAudioAndTimers = () => {
    try {
      if (pressInterval.current) {
        clearInterval(pressInterval.current);
        pressInterval.current = null;
      }
      if (sirenIntervalRef.current) {
        clearInterval(sirenIntervalRef.current);
        sirenIntervalRef.current = null;
      }
      if (sirenOsc1.current) {
        try {
          sirenOsc1.current.stop();
          sirenOsc1.current.disconnect();
        } catch (e) {}
        sirenOsc1.current = null;
      }
      if (sirenOsc2.current) {
        try {
          sirenOsc2.current.stop();
          sirenOsc2.current.disconnect();
        } catch (e) {}
        sirenOsc2.current = null;
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
        audioCtxRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSirenOn(false);
    } catch (err) {
      console.error("Error silencing audio:", err);
    }
  };

  const startSirenAudio = () => {
    try {
      silenceAllAudioAndTimers();
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      sirenOsc1.current = osc1;
      sirenOsc2.current = osc2;

      let sweep = true;
      sirenIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          if (sirenIntervalRef.current) {
            clearInterval(sirenIntervalRef.current);
            sirenIntervalRef.current = null;
          }
          return;
        }
        try {
          const time = ctx.currentTime;
          if (sweep) {
            osc1.frequency.exponentialRampToValueAtTime(960, time + 0.4);
            osc2.frequency.exponentialRampToValueAtTime(770, time + 0.4);
          } else {
            osc1.frequency.exponentialRampToValueAtTime(650, time + 0.4);
            osc2.frequency.exponentialRampToValueAtTime(540, time + 0.4);
          }
          sweep = !sweep;
        } catch (err) {
          if (sirenIntervalRef.current) {
            clearInterval(sirenIntervalRef.current);
            sirenIntervalRef.current = null;
          }
        }
      }, 500);

      setIsSirenOn(true);
    } catch (e) {
      console.error("Audio Context Failed:", e);
    }
  };

  // Open Confirm Dispatch Screen
  const initiateConfirmDispatch = (category: string, serviceName: string, servicePhone: string) => {
    setIsPressing(false);
    setProgress(100);
    setSelectedCategory(category);
    setSelectedService({ name: serviceName, phone: servicePhone });

    const newIncident: EmergencyIncidentData = {
      incidentRef: generateIncidentRef(),
      emergencyType: category,
      timestamp: new Date().toLocaleString(),
      userName: userProfile?.name || 'AlertNow User',
      userPhone: userProfile?.medicalIdNumber ? `ID: ${userProfile.medicalIdNumber}` : '',
      medicalIdNumber: userProfile?.medicalIdNumber || 'AL-2026',
      bloodGroup: userProfile?.bloodGroup || 'Unspecified',
      allergies: userProfile?.allergies || [],
      state: currentLocation?.address?.includes('Lagos') ? 'Lagos' : 'Abuja FCT',
      emergencyService: serviceName,
      servicePhone: servicePhone,
      locationAddress: currentLocation?.address || 'Current Coordinates',
      latitude: currentLocation?.lat,
      longitude: currentLocation?.lng,
      shortDescription: `Immediate ${category} assistance requested via ALERTNOW 112 system.`
    };

    setIncidentData(newIncident);
    setSosState('CONFIRM');
    startSirenAudio();
  };

  // Complete Dispatch confirmation
  const handleConfirmAndDispatch = () => {
    setIsSOSTriggered(true);
    setSosState('TRACKING');
  };

  // Cancel Emergency Dispatch & Completely Silent Return Home
  const handleCancelEmergencyAndReturnHome = () => {
    // 1. Instantly silence siren, timers, speech
    silenceAllAudioAndTimers();

    // 2. Reset local SOS state
    setIsSOSTriggered(false);
    setIsPressing(false);
    setProgress(0);
    setSosState('IDLE');
    setIncidentData(null);

    // 3. Notify parent app if handlers are provided
    if (onDeactivateSOS) {
      onDeactivateSOS();
    }
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  // Camera helpers
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPhotosCaptured(prev => [dataUrl, ...prev]);
      }
    }
  };

  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const getSmsHref = (phone: string) => {
    const coords = currentLocation ? `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}` : 'Unknown GPS';
    const address = currentLocation?.address || 'Current Location';
    const name = userProfile?.name || 'AlertNow User';
    return `sms:${phone}?body=${encodeURIComponent(`URGENT! Emergency SOS triggered by ${name}. Location: ${address} (${coords}). Call 112!`)}`;
  };

  const getWhatsAppHref = (phone: string) => {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+/, '');
    const coords = currentLocation ? `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}` : 'Unknown GPS';
    const address = currentLocation?.address || 'Current Location';
    const name = userProfile?.name || 'AlertNow User';
    return `https://wa.me/${cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(`🚨 ALERTNOW EMERGENCY REPORT 🚨\nName: ${name}\nLocation: ${address}\nGPS: https://www.google.com/maps/search/?api=1&query=${currentLocation?.lat},${currentLocation?.lng}`)}`;
  };

  // IF IN TRACKING STATE -> Render Status Tracker
  if (sosState === 'TRACKING' && incidentData) {
    return (
      <EmergencyStatusTracker
        incidentData={incidentData}
        onCancelEmergency={handleCancelEmergencyAndReturnHome}
        onNavigateHome={handleCancelEmergencyAndReturnHome}
      />
    );
  }

  // IF IN CONFIRMATION STATE -> Render Confirm Emergency Dispatch Screen
  if (sosState === 'CONFIRM' && incidentData) {
    const emailHref = generateEmergencyEmailHref(incidentData);
    const whatsappHref = generateEmergencyWhatsAppHref(incidentData, incidentData.servicePhone);

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-surface-container border-2 border-primary/50 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Top Header with Prominent Cancel/X Button */}
          <div className="flex justify-between items-start border-b border-outline-variant/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 text-primary rounded-xl shrink-0">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-black text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/30 uppercase">
                  NATIONAL EMERGENCY ROUTE: 112
                </span>
                <h2 className="text-lg font-black text-on-surface uppercase tracking-wider mt-1">
                  CONFIRM EMERGENCY DISPATCH
                </h2>
              </div>
            </div>

            {/* Prominent Cancel / X Button (Instantly silences and returns home) */}
            <button
              onClick={handleCancelEmergencyAndReturnHome}
              className="p-2.5 bg-error/15 hover:bg-error/30 text-error border border-error/40 rounded-xl transition-all flex items-center gap-1 font-black text-xs uppercase"
              title="Cancel emergency dispatch and return home silently"
            >
              <X className="w-5 h-5" />
              <span className="hidden sm:inline">CANCEL / EXIT</span>
            </button>
          </div>

          {/* Incident Overview Card */}
          <div className="space-y-4">
            <div className="bg-surface p-4 rounded-xl border border-outline-variant/30 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-on-surface uppercase flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  INCIDENT DETAILS
                </span>
                <span className="text-[10px] font-mono text-primary font-bold">
                  REF: {incidentData.incidentRef}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-bold border-t border-outline-variant/10">
                <div>
                  <span className="text-[9px] text-on-surface-variant uppercase font-mono block">Emergency Category</span>
                  <span className="text-on-surface font-black uppercase text-sm">{incidentData.emergencyType}</span>
                </div>
                <div>
                  <span className="text-[9px] text-on-surface-variant uppercase font-mono block">Selected Responder</span>
                  <span className="text-on-surface font-black uppercase text-sm">{incidentData.emergencyService} ({incidentData.servicePhone})</span>
                </div>
                <div>
                  <span className="text-[9px] text-on-surface-variant uppercase font-mono block">Current Location</span>
                  <span className="text-on-surface font-black uppercase truncate block flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    {incidentData.locationAddress}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-on-surface-variant uppercase font-mono block">Patient Identifier</span>
                  <span className="text-on-surface font-black uppercase">{incidentData.userName} (Blood: {incidentData.bloodGroup})</span>
                </div>
              </div>
            </div>

            {/* Siren Control Toggle inside confirmation */}
            <div className="flex items-center justify-between p-3 bg-surface border border-outline-variant/30 rounded-xl">
              <span className="text-xs font-bold text-on-surface flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-primary" />
                Emergency Loud Siren Alarm
              </span>
              <button
                onClick={() => {
                  if (isSirenOn) silenceAllAudioAndTimers();
                  else startSirenAudio();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase ${
                  isSirenOn ? 'bg-error text-white' : 'bg-surface-container-high text-on-surface'
                }`}
              >
                {isSirenOn ? 'MUTE ALARM' : 'UNMUTE ALARM'}
              </button>
            </div>
          </div>

          {/* Barcode & Email Options */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsBarcodeModalOpen(true)}
              className="p-3 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 rounded-xl text-xs font-black uppercase text-on-surface flex items-center justify-center gap-2 transition-all"
            >
              <QrCode className="w-4 h-4 text-primary" />
              <span>Share Barcode / QR</span>
            </button>

            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="p-3 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 rounded-xl text-xs font-black uppercase text-sky-300 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Mail className="w-4 h-4 text-sky-400" />
              <span>Email Report</span>
            </button>
          </div>

          {/* Confirm & Execute Dispatch Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleConfirmAndDispatch}
              className="w-full py-4 bg-primary text-black font-black text-sm uppercase tracking-widest rounded-xl hover:brightness-110 shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <span>CONFIRM & EXECUTE DISPATCH TO 112</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleCancelEmergencyAndReturnHome}
              className="w-full py-3 bg-surface border border-outline-variant/40 hover:bg-surface-container-high text-error font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4 text-error" />
              <span>CANCEL COMMAND & RETURN TO HOME SCREEN (SILENT)</span>
            </button>
          </div>

        </div>

        {/* QR Code Modal */}
        <EmergencyBarcodeModal
          isOpen={isBarcodeModalOpen}
          onClose={() => setIsBarcodeModalOpen(false)}
          incidentData={incidentData}
        />

        {/* Emergency Email Dispatch Modal */}
        <EmergencyEmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          incidentData={incidentData}
        />
      </div>
    );
  }

  // STANDARD IDLE VIEW (Hold SOS button & shortcuts deck)
  return (
    <div className="space-y-6">
      {/* Upper Status Panel */}
      <div className={`p-4 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all
        ${isSOSTriggered 
          ? `bg-error-container/20 border-error ${isPowerSaver ? '' : 'animate-pulse'} text-error` 
          : 'bg-surface-container border-outline-variant/30 text-on-surface-variant'}`}
      >
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isSOSTriggered ? `bg-error ${isPowerSaver ? '' : 'animate-ping'}` : 'bg-primary'}`} />
            {isSOSTriggered ? '🚨 EMERGENCY ACTIVE DISPATCHING 🚨' : 'SYSTEM SENTINEL - STANDBY STATE'}
          </h2>
          <p className="text-xs mt-1 font-medium text-on-surface">
            {isSOSTriggered 
              ? 'Automatic alerts dispatched. Local alarm siren broadcasting. On-screen shortcuts unlocked.'
              : 'Hold down the pressure-SOS trigger or select immediate agency shortcuts below.'}
          </p>
        </div>

        {isSOSTriggered && (
          <button 
            onClick={handleCancelEmergencyAndReturnHome}
            className="px-4 py-2 bg-error text-white font-black text-xs uppercase tracking-widest rounded hover:bg-error/80 transition-all shadow-md active:scale-95"
          >
            CANCEL EMERGENCY STRIKE
          </button>
        )}
      </div>

      {/* Outside App Voice SOS Sentinel Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-primary/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shrink-0">
            <Radio className="w-5 h-5 animate-pulse text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-primary font-black uppercase tracking-wider">
                OUTSIDE-APP VOICE DISPATCH
              </span>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase ${
                voiceSosEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-surface text-zinc-400'
              }`}>
                {voiceSosEnabled ? 'SENTINEL ACTIVE' : 'TOUCH TO SET UP'}
              </span>
            </div>
            <p className="text-xs text-on-surface font-semibold mt-0.5">
              Hands-free Trigger: shout <strong className="text-primary font-bold">"Help Help"</strong> or <strong className="text-primary font-bold">"SOS"</strong> to activate. Say <strong className="text-emerald-400 font-bold">"Cancel SOS"</strong> or <strong className="text-emerald-400 font-bold">"Deactivate"</strong> to cancel and return to the home screen instantly!
            </p>
          </div>
        </div>

        {onOpenVoiceOutsideModal && (
          <button
            onClick={onOpenVoiceOutsideModal}
            className="px-4 py-2 bg-primary text-black rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:brightness-110 shrink-0 transition-all"
          >
            <Mic className="w-3.5 h-3.5" />
            Set Up Outside Voice SOS
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* HoldSOS Button Container (Span 5) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-surface-container border border-outline-variant/30 rounded-lg p-6 relative min-h-[400px]">
          <div className="flex flex-col items-center justify-center w-full space-y-6">
            <p className="text-xs font-black uppercase tracking-widest text-primary">
              {isPressing ? 'HOLD PRESSURE FOR 3 SECONDS...' : 'PRESS & HOLD TO TRIGGER DISPATCH'}
            </p>

            <div 
              onMouseDown={() => setIsPressing(true)}
              onMouseUp={() => setIsPressing(false)}
              onMouseLeave={() => setIsPressing(false)}
              onTouchStart={() => setIsPressing(true)}
              onTouchEnd={() => setIsPressing(false)}
              className="relative w-60 h-60 flex items-center justify-center cursor-pointer select-none"
            >
              <div className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${isPressing ? 'border-primary scale-105 opacity-80' : 'border-error/20 scale-100 opacity-30 animate-ping'}`} />
              <div className={`absolute inset-4 rounded-full border transition-all duration-300 ${isPressing ? 'border-primary/50 scale-105' : 'border-error/10 scale-100 opacity-20'}`} />

              <svg className="absolute w-full h-full transform -rotate-90">
                <circle 
                  cx="120" 
                  cy="120" 
                  r="105" 
                  stroke={highContrast ? '#fff' : '#f2ca50'} 
                  strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray="660" 
                  strokeDashoffset={660 - (660 * progress) / 100}
                  className="transition-all duration-75"
                />
              </svg>

              <div className={`w-44 h-44 rounded-full flex flex-col items-center justify-center text-center transition-all duration-200 shadow-2xl border
                ${isPressing 
                  ? 'bg-primary text-black border-primary scale-95' 
                  : 'bg-error text-white border-error/50 hover:brightness-110 active:scale-95'}`}
              >
                <ShieldAlert className="w-14 h-14 mb-1 animate-pulse" />
                <span className="text-lg font-black tracking-tighter">SOS</span>
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-80 mt-1">
                  {isPressing ? `${Math.floor(progress)}%` : 'HOLD'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-on-surface-variant font-bold uppercase bg-surface-container-high px-3 py-1.5 rounded-full border border-outline-variant/20">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>Accidental Protection Filter Active</span>
            </div>

            {/* Direct Cancel Button */}
            <button
              onClick={handleCancelEmergencyAndReturnHome}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 border border-outline-variant/40 shadow-md transition-all active:scale-95"
              title="Cancel command and return to Home Screen"
            >
              <X className="w-4 h-4 text-error" />
              <span>Cancel Command & Return Home</span>
            </button>
          </div>
        </div>

        {/* Action Center - Shortcuts deck (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm text-on-surface uppercase tracking-wider">
                PRIMARY DISPATCH SHORTCUTS
              </h3>
              <span className="text-[9px] font-mono text-primary font-bold uppercase bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                112 National Lifeline
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button 
                onClick={() => initiateConfirmDispatch('Crime / Police Emergency', 'Police Control Room 112', '112')}
                className="p-4 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 rounded-lg flex flex-col items-center justify-center text-center transition-all group active:scale-95"
              >
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-on-surface">POLICE NPF</span>
                <span className="text-[9px] text-on-surface-variant font-mono mt-1">112 NATIONAL</span>
              </button>

              <button 
                onClick={() => initiateConfirmDispatch('Fire & Rescue Emergency', 'Federal/State Fire Service', '112')}
                className="p-4 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 rounded-lg flex flex-col items-center justify-center text-center transition-all group active:scale-95"
              >
                <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400 mb-2 group-hover:scale-110 transition-transform">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-on-surface">FIRE SERVICE</span>
                <span className="text-[9px] text-on-surface-variant font-mono mt-1">112 / FFS</span>
              </button>

              <button 
                onClick={() => initiateConfirmDispatch('Road Accident / Rescue', 'FRSC Rescue Command 122', '122')}
                className="p-4 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 rounded-lg flex flex-col items-center justify-center text-center transition-all group active:scale-95"
              >
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                  <HeartCrack className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-on-surface">FRSC HIGHWAY</span>
                <span className="text-[9px] text-on-surface-variant font-mono mt-1">122 RESCUE</span>
              </button>

              <button 
                onClick={() => initiateConfirmDispatch('Medical Emergency', 'Ambulance & EMS Dispatch', '112')}
                className="p-4 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 rounded-lg flex flex-col items-center justify-center text-center transition-all group active:scale-95"
              >
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-on-surface">AMBULANCE</span>
                <span className="text-[9px] text-on-surface-variant font-mono mt-1">112 EMS</span>
              </button>
            </div>
          </div>

          {/* Camera and Scene Capture */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                <h3 className="font-black text-sm text-on-surface uppercase tracking-wider">INCIDENT SECURE PHOTO VAULT</h3>
              </div>
              <span className="text-[9px] text-primary font-mono font-bold bg-primary-container/10 px-2 py-0.5 rounded uppercase">
                OFFLINE VAULT
              </span>
            </div>

            {isCameraActive ? (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border border-outline-variant/30 bg-black aspect-video flex items-center justify-center">
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={capturePhoto}
                    className="flex-1 py-3 bg-primary text-black font-black text-xs uppercase tracking-wider rounded hover:bg-primary/80 transition-all active:scale-95"
                  >
                    TAKE WITNESS SNAPSHOT
                  </button>
                  <button 
                    onClick={stopCameraStream}
                    className="px-4 py-3 bg-surface border border-outline-variant/40 rounded text-xs font-bold text-on-surface"
                  >
                    CLOSE CAMERA
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-outline-variant/30 rounded-lg space-y-3">
                <p className="text-xs text-on-surface-variant font-bold">
                  Capture accidents, scene hazards, or injury snapshots securely.
                </p>
                <button 
                  onClick={startCamera}
                  className="px-5 py-2.5 bg-surface-container-high border border-outline-variant/30 hover:bg-surface-container-highest transition-colors rounded text-xs font-bold text-primary flex items-center justify-center gap-2 mx-auto"
                >
                  <Camera className="w-4 h-4" />
                  <span>ACTIVATE EMERGENCY CAMERA</span>
                </button>
              </div>
            )}

            {photosCaptured.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase">SECURED LOCAL WITNESS FILE ENTRIES</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {photosCaptured.map((photo, i) => (
                    <div key={i} className="relative w-16 h-16 rounded border border-outline-variant/30 overflow-hidden shrink-0">
                      <img src={photo} alt="witness snapshot" className="w-full h-full object-cover" />
                      <div className="absolute top-0 right-0 p-0.5 bg-emerald-500 text-black rounded-bl">
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Starred Contacts Fallback Actions */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
            <h3 className="font-black text-sm text-on-surface uppercase tracking-wider">STARRED CONTACT CRISIS ROUTERS</h3>
            
            <div className="space-y-3">
              {contacts.filter(c => c.priority).length > 0 ? (
                contacts.filter(c => c.priority).map((contact) => (
                  <div key={contact.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded bg-surface-container-high border border-outline-variant/20 gap-3">
                    <div>
                      <h4 className="text-xs font-black text-on-surface">{contact.name}</h4>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase">{contact.relationship} ({contact.phone})</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <a 
                        href={`tel:${contact.phone}`}
                        className="flex-1 sm:flex-initial px-3 py-2 bg-primary/25 text-primary rounded text-[11px] font-bold text-center hover:bg-primary/30 active:scale-95 transition-all"
                      >
                        CALL
                      </a>
                      <a 
                        href={getSmsHref(contact.phone)}
                        className="flex-1 sm:flex-initial px-3 py-2 bg-primary/25 text-primary rounded text-[11px] font-bold text-center hover:bg-primary/30 active:scale-95 transition-all"
                      >
                        SEND SMS
                      </a>
                      {contact.whatsappSupported && (
                        <a 
                          href={getWhatsAppHref(contact.phone)}
                          target="_blank" 
                          rel="noreferrer"
                          className="flex-1 sm:flex-initial px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded text-[11px] font-bold text-center hover:bg-emerald-500/35 active:scale-95 transition-all"
                        >
                          WHATSAPP
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-on-surface-variant text-center py-4">
                  Setup Starred Contacts in Emergency Contacts tab to populate quick dispatch tools.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
