import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Bell, 
  ChevronRight, 
  ChevronLeft,
  RotateCcw,
  Smile,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Imported generated child-friendly cartoon images
import kidsHeroMascotImg from '../assets/images/kids_hero_mascot_1785602262582.jpg';
import stepNeedHelpImg from '../assets/images/kids_step_need_help_1785602277646.jpg';
import stepPressSosImg from '../assets/images/kids_step_press_sos_1785602288293.jpg';
import stepHelpComingImg from '../assets/images/kids_step_help_coming_1785602300466.jpg';
import stepStaySafeImg from '../assets/images/kids_step_stay_safe_1785602311758.jpg';

interface KidsEmergencyGuideProps {
  onTriggerRealSOS?: () => void;
  onNavigateBack?: () => void;
}

export default function KidsEmergencyGuide({ onTriggerRealSOS, onNavigateBack }: KidsEmergencyGuideProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [practiceTriggered, setPracticeTriggered] = useState(false);
  const [stars, setStars] = useState<{ id: number; x: number; y: number }[]>([]);

  const steps = [
    {
      id: 1,
      title: '1. I Need Help',
      shortDesc: 'Recognize when you need assistance',
      narration: 'If you feel scared, lost, unwell, or in danger, remember that it is okay and safe to ask for help!',
      image: stepNeedHelpImg,
      bgColor: 'from-amber-500/20 to-orange-500/10',
      accentColor: 'text-amber-400',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: Smile,
      visualHighlight: 'Child raising hand calmly'
    },
    {
      id: 2,
      title: '2. Press ALERTNOW',
      shortDesc: 'Tap the big yellow emergency button',
      narration: 'Open ALERTNOW on the phone and tap the big yellow SOS button. It sends your location to your family and emergency helpers right away!',
      image: stepPressSosImg,
      bgColor: 'from-yellow-500/20 to-amber-500/10',
      accentColor: 'text-yellow-400',
      badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      icon: ShieldAlert,
      visualHighlight: 'Pulsing phone & SOS button'
    },
    {
      id: 3,
      title: '3. Help Is Coming',
      shortDesc: 'Friendly helpers receive your signal',
      narration: 'Super helper responders and your family get a notification on their map and move quickly to reach you!',
      image: stepHelpComingImg,
      bgColor: 'from-sky-500/20 to-blue-500/10',
      accentColor: 'text-sky-400',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      icon: MapPin,
      visualHighlight: 'Friendly doctor & map location pin'
    },
    {
      id: 4,
      title: '4. Stay Safe',
      shortDesc: 'Wait calmly in a safe spot',
      narration: 'Sit comfortably in a bright, safe spot while waiting. You are protected, and help will arrive very soon!',
      image: stepStaySafeImg,
      bgColor: 'from-emerald-500/20 to-teal-500/10',
      accentColor: 'text-emerald-400',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: ShieldCheck,
      visualHighlight: 'Safe room & happy protector'
    }
  ];

  const playStepNarration = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.1; // Friendly warm pitch for children
      utterance.rate = 0.95;  // Slightly relaxed speed
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePracticePress = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newStars = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 160,
      y: (Math.random() - 0.5) * 160
    }));
    setStars(newStars);

    setPracticeTriggered(true);
    playStepNarration("Awesome job! You pressed the ALERTNOW button. Asking for help is safe, easy, and smart!");
    
    setTimeout(() => {
      setStars([]);
    }, 1500);
  };

  const currentStepData = steps[activeStep];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Playful Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-primary/30 bg-gradient-to-r from-amber-950/40 via-surface-container-high to-emerald-950/40 p-6 md:p-8 shadow-2xl">
        {/* Animated Background Bubbles & Floating Stars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-3 left-10 w-24 h-24 rounded-full bg-primary/30 blur-xl animate-pulse" />
          <div className="absolute bottom-4 right-12 w-32 h-32 rounded-full bg-emerald-500/20 blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-1/2 left-1/3 w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
          <div className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-sky-300 animate-ping" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-primary shadow-lg shadow-primary/20 shrink-0 bg-black">
              <img 
                src={kidsHeroMascotImg} 
                alt="ALERTNOW Rescue Hero Mascot" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-1 right-1 bg-primary text-black text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                HERO PUP
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 bg-primary/20 border border-primary/40 px-3 py-1 rounded-full text-xs font-black text-primary uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" />
                CHILDREN'S REASSURING CARTOON GUIDE
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight uppercase">
                ALERTNOW Kids Safety Mascot
              </h1>
              <p className="text-xs md:text-sm text-on-surface-variant font-bold max-w-xl">
                Learn how asking for help is safe, easy, and fast! Follow our hero mascot through 4 simple cartoon steps.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            {onNavigateBack && (
              <button
                onClick={onNavigateBack}
                className="px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface/80 hover:bg-surface text-on-surface text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Return to Dashboard
              </button>
            )}

            <button
              onClick={() => playStepNarration("Welcome to ALERTNOW Kids Emergency Guide. If you ever feel scared or need urgent help, ALERTNOW helps you call for assistance!")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 border shadow-md transition-all ${
                isPlayingAudio 
                  ? 'bg-primary text-black border-primary animate-pulse' 
                  : 'bg-surface-container-highest hover:bg-surface-container-high text-primary border-primary/40'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-primary" />}
              <span>{isPlayingAudio ? 'Reading Aloud...' : 'Listen to Guide'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reassuring Core Message Banner */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-primary/10 to-sky-500/15 border border-emerald-500/30 rounded-xl p-4 text-center flex flex-col sm:flex-row items-center justify-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
          <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400/30 animate-pulse" />
        </div>
        <p className="text-xs md:text-sm text-on-surface font-extrabold tracking-wide">
          “If you are in danger or need urgent help, <strong className="text-primary font-black uppercase">ALERTNOW</strong> helps you call for assistance.”
        </p>
      </div>

      {/* Main Interactive Cartoon Storybook Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Step Navigation List */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-mono font-black text-primary uppercase tracking-widest px-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            4 EASY CARTOON STEPS FOR KIDS
          </h2>

          <div className="space-y-2.5">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setActiveStep(idx);
                    playStepNarration(`${step.title}. ${step.narration}`);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 relative overflow-hidden group ${
                    isActive
                      ? 'bg-surface-container-highest border-primary shadow-lg shadow-primary/10 scale-[1.02]'
                      : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container-high hover:border-outline-variant/60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${
                    isActive 
                      ? 'bg-primary text-black border-primary font-mono' 
                      : 'bg-surface-container text-on-surface-variant border-outline-variant/30'
                  }`}>
                    {step.id}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black uppercase tracking-tight truncate ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                        {step.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant font-semibold truncate mt-0.5">
                      {step.shortDesc}
                    </p>
                  </div>

                  <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? step.accentColor : 'text-zinc-500'}`} />
                </button>
              );
            })}
          </div>

          {/* Practice Button Box */}
          <div className="bg-surface-container-low border border-primary/30 rounded-xl p-5 space-y-4 text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-2">
              <Smile className="w-5 h-5 text-amber-400" />
              <h3 className="text-xs font-black text-on-surface uppercase tracking-wider">
                KIDS SAFE PRACTICE CORNER
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant font-semibold">
              Practice pressing the ALERTNOW SOS button below! This safe test button teaches kids without sending a real emergency dispatch.
            </p>

            <div className="relative inline-block">
              <button
                onClick={handlePracticePress}
                className="relative z-10 px-6 py-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:brightness-110 text-black font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl border-2 border-yellow-200 active:scale-95 transition-all flex items-center gap-2 mx-auto"
              >
                <ShieldAlert className="w-6 h-6 animate-pulse" />
                <span>PRACTICE ALERTNOW SOS</span>
              </button>

              {/* Burst Stars Animation */}
              {stars.map((star) => (
                <motion.div
                  key={star.id}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: 0, x: star.x, y: star.y, scale: 1.5 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 pointer-events-none text-yellow-300 z-20"
                >
                  <Sparkles className="w-5 h-5 fill-yellow-300" />
                </motion.div>
              ))}
            </div>

            {practiceTriggered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/20 border border-emerald-400/40 rounded-lg p-3 text-xs text-emerald-300 font-extrabold flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Great job! Asking for help with ALERTNOW is smart and easy!</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Active Cartoon Step Viewer */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepData.id}
              initial={{ opacity: 0, scale: 0.98, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98, x: -10 }}
              transition={{ duration: 0.25 }}
              className={`rounded-2xl border border-outline-variant/30 bg-gradient-to-b ${currentStepData.bgColor} p-6 space-y-5 shadow-2xl relative overflow-hidden`}
            >
              {/* Top Bar inside Card */}
              <div className="flex justify-between items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-black border uppercase tracking-wider ${currentStepData.badgeColor}`}>
                  STEP {currentStepData.id} OF 4
                </span>

                <button
                  onClick={() => playStepNarration(currentStepData.narration)}
                  className="px-3 py-1.5 rounded-lg bg-surface/80 hover:bg-surface border border-outline-variant/40 text-xs font-bold text-primary flex items-center gap-1.5 transition-all"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Hear Step Audio</span>
                </button>
              </div>

              {/* Main Illustration frame */}
              <div className="relative rounded-xl overflow-hidden border-2 border-primary/30 bg-black aspect-video shadow-xl group">
                <img 
                  src={currentStepData.image} 
                  alt={currentStepData.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Cartoon Overlay Indicators */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-2.5 flex items-center justify-between text-white text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                    <span>Visual Guide: {currentStepData.visualHighlight}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">ALERTNOW KIDS</span>
                </div>
              </div>

              {/* Step Title & Detailed Narration */}
              <div className="space-y-2">
                <h3 className={`text-xl font-black uppercase tracking-tight flex items-center gap-2 ${currentStepData.accentColor}`}>
                  {currentStepData.title}
                </h3>
                <p className="text-sm text-on-surface font-extrabold leading-relaxed bg-surface/60 border border-outline-variant/30 rounded-xl p-4">
                  {currentStepData.narration}
                </p>
              </div>

              {/* Visual Element Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                <div className="bg-surface-container-high/80 border border-outline-variant/30 rounded-lg p-2.5 flex items-center gap-2 text-xs font-extrabold text-on-surface">
                  <ShieldAlert className="w-4 h-4 text-yellow-400 animate-pulse" />
                  <span>Pulsing SOS Button</span>
                </div>
                <div className="bg-surface-container-high/80 border border-outline-variant/30 rounded-lg p-2.5 flex items-center gap-2 text-xs font-extrabold text-on-surface">
                  <MapPin className="w-4 h-4 text-sky-400" />
                  <span>Map Location Pin</span>
                </div>
                <div className="bg-surface-container-high/80 border border-outline-variant/30 rounded-lg p-2.5 flex items-center gap-2 text-xs font-extrabold text-on-surface">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span>Responder Alert</span>
                </div>
              </div>

              {/* Navigation Arrows for Step-by-Step */}
              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                <button
                  disabled={activeStep === 0}
                  onClick={() => {
                    const prev = Math.max(0, activeStep - 1);
                    setActiveStep(prev);
                    playStepNarration(`${steps[prev].title}. ${steps[prev].narration}`);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                    activeStep === 0 
                      ? 'opacity-40 cursor-not-allowed bg-zinc-800 text-zinc-500' 
                      : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant/40'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex gap-1.5">
                  {steps.map((_, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveStep(idx);
                        playStepNarration(`${steps[idx].title}. ${steps[idx].narration}`);
                      }}
                      className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                        activeStep === idx ? 'bg-primary w-6' : 'bg-outline-variant/50 hover:bg-outline-variant'
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={activeStep === steps.length - 1}
                  onClick={() => {
                    const next = Math.min(steps.length - 1, activeStep + 1);
                    setActiveStep(next);
                    playStepNarration(`${steps[next].title}. ${steps[next].narration}`);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                    activeStep === steps.length - 1 
                      ? 'opacity-40 cursor-not-allowed bg-zinc-800 text-zinc-500' 
                      : 'bg-primary text-black hover:brightness-110 shadow-md font-black'
                  }`}
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Real Emergency Trigger Callout for Parents / Guardians */}
      {onTriggerRealSOS && (
        <div className="bg-surface-container-low border border-error/30 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-mono font-black text-error uppercase tracking-widest block">
              REAL EMERGENCY OVERRIDE
            </span>
            <h4 className="text-sm font-black text-on-surface uppercase">
              Need Real Emergency Rescue Dispatch Now?
            </h4>
            <p className="text-xs text-on-surface-variant font-semibold">
              Tap to open the main high-priority ALERTNOW Emergency Dispatch screen immediately.
            </p>
          </div>

          <button
            onClick={onTriggerRealSOS}
            className="px-6 py-3 bg-error hover:bg-error/90 text-on-error font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 shrink-0 transition-all active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span>OPEN EMERGENCY SOS</span>
          </button>
        </div>
      )}
    </div>
  );
}
