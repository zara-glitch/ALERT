import { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  CloudCheck, 
  MapPin, 
  Copy, 
  Share2, 
  PhoneCall, 
  ShieldAlert, 
  Heart, 
  Clock, 
  ExternalLink,
  Plus,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Activity,
  Watch,
  Globe,
  CheckCircle,
  Phone,
  Sparkles,
  Smile
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile, EmergencyContact } from '../types';
import AlertNowLogo from './AlertNowLogo';

interface DashboardProps {
  userProfile: UserProfile | null;
  contacts: EmergencyContact[];
  currentLocation: { lat: number; lng: number; address: string } | null;
  isOnline: boolean;
  onCopyLocation: () => void;
  onShareLocation: () => void;
  onOpenSOS: () => void;
  onNavigateToView: (view: string) => void;
  isPowerSaver?: boolean;
}

export default function Dashboard({
  userProfile,
  contacts,
  currentLocation,
  isOnline,
  onCopyLocation,
  onShareLocation,
  onOpenSOS,
  onNavigateToView,
  isPowerSaver = false
}: DashboardProps) {
  const [stats, setStats] = useState({
    totalIncidentsReported: 0,
    heartRateSimulated: 72,
    syncStatus: 'Up to Date'
  });

  // Simulated live sensor heartbeat to give the Aureus Sentinel modern terminal aesthetic
  useEffect(() => {
    if (isPowerSaver) {
      // Pause updates during Power Saver Mode to conserve device calculations
      return;
    }
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        heartRateSimulated: Math.floor(Math.random() * (85 - 68 + 1) + 68)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [isPowerSaver]);

  const starContacts = contacts.filter(c => c.priority);

  return (
    <div className="space-y-6">
      {/* Brand Name & Logo Header */}
      <div id="dashboard-brand-header" className="flex items-center gap-4 bg-surface-container border border-outline-variant/30 rounded-lg p-5">
        <div id="dashboard-logo" className="w-16 h-16 rounded-xl overflow-hidden shadow-lg shadow-primary/15 shrink-0 border border-[#D4AF37]/30 bg-[#0D0D0D]">
          <AlertNowLogo className="w-full h-full" variant="icon" />
        </div>
        <div>
          <h1 id="dashboard-brand-name" className="text-2xl font-black text-primary tracking-tighter uppercase leading-none">ALERTNOW V2</h1>
          <p id="dashboard-brand-subtitle" className="text-[10px] tracking-widest text-[#D4AF37] font-bold uppercase mt-1.5">INSTANT CONNECTION. ULTIMATE PROTECTION.</p>
        </div>
      </div>

      {/* Top Banner Alert Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Connection status card */}
        <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${isOnline ? 'bg-primary-container/20 text-primary' : 'bg-error-container/20 text-error'}`}>
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className={`w-5 h-5 ${isPowerSaver ? '' : 'animate-bounce'}`} />}
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">SYSTEM CONNECTIVITY</p>
              <h3 className="text-sm font-black text-on-surface">
                {isOnline ? 'Online / Real-time Secure' : 'Offline / Local Sentinel Mode'}
              </h3>
            </div>
          </div>
          <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? `bg-primary ${isPowerSaver ? '' : 'animate-pulse'}` : 'bg-error'}`} />
        </div>

        {/* Database sync status card */}
        <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary-container/20 text-primary">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">DATABASE CACHE STATE</p>
              <h3 className="text-sm font-black text-on-surface">
                {isOnline ? 'Cloud Synced (Firestore)' : 'Offline LocalPersistence Active'}
              </h3>
            </div>
          </div>
          <p className="text-[10px] text-primary font-mono font-bold uppercase tracking-widest bg-primary-container/10 px-2 py-0.5 rounded">
            SECURE
          </p>
        </div>

        {/* Health Hub indicator */}
        <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary-container/20 text-primary">
              <Heart className={`w-5 h-5 text-primary ${isPowerSaver ? '' : 'animate-pulse'}`} />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">BIOMETRIC SIMULATION</p>
              <h3 className="text-sm font-black text-on-surface">
                {isPowerSaver ? '72 BPM' : `${stats.heartRateSimulated} BPM`} <span className="text-[10px] text-on-surface-variant font-normal">{isPowerSaver ? '(Paused)' : '(Pulse)'}</span>
              </h3>
            </div>
          </div>
          <div className="h-6 w-12 flex items-end gap-0.5">
            {[3, 6, 4, 8, 5, 9, 3].map((val, i) => (
              <span 
                key={i} 
                className={`bg-primary/75 rounded-t-sm flex-1 ${isPowerSaver ? '' : 'transition-all duration-300'}`} 
                style={{ height: `${val * 10}%` }} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Left column (GPS/Quick Action) & Right column (Medical/Contacts Brief) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Interactive Column (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Giant Urgent SOS Banner */}
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-error/90 via-error-container to-surface border border-error/40 p-6 shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
              <ShieldAlert className="w-48 h-48" />
            </div>
            <div className="relative z-10 space-y-4">
              <span className="bg-white/20 text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full">
                CRITICAL EVENT UTILITY
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
                IN IMMEDIATE DANGER OR MEDICAL CRISIS?
              </h2>
              <p className="text-xs text-white/80 max-w-lg leading-relaxed font-bold">
                Activating the SOS button immediately alerts emergency contacts via automatic notifications, loads medical profiles, and dials local Nigerian rescue agencies instantly.
              </p>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={onOpenSOS}
                  className="bg-white text-error font-black text-xs tracking-wider uppercase px-5 py-3 rounded-md hover:bg-neutral-100 transition-all shadow-md active:scale-95"
                >
                  TRIGGER SOS OVERLAY
                </button>
                <button 
                  onClick={() => onNavigateToView('ai')}
                  className="bg-black/30 text-white border border-white/20 hover:bg-black/50 transition-all font-black text-xs tracking-wider uppercase px-5 py-3 rounded-md"
                >
                  ASK GUARDIAN AI FOR CPR
                </button>
              </div>
            </div>
          </div>

          {/* 36 States Emergency Helplines Quick-Access */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="p-1 text-sm bg-primary/15 text-primary rounded-md">📍</span>
                <h3 className="font-black text-xs text-on-surface uppercase tracking-wider">36 STATES EMERGENCY DIRECTORY</h3>
              </div>
              <button 
                onClick={() => onNavigateToView('contacts')}
                className="text-[10px] font-black text-primary hover:underline flex items-center gap-1 uppercase"
              >
                <span>OPEN FULL MAP</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed font-bold">
              Instantly lookup and dial dedicated police control rooms and state emergency management agencies (SEMA) for any of the 36 Nigerian states.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => onNavigateToView('contacts')}
                className="p-3 bg-surface border border-outline-variant/25 rounded hover:border-primary/50 transition-all text-left group"
              >
                <span className="text-[9px] text-primary font-black uppercase block mb-1">LAGOS DISPATCH ROOM</span>
                <span className="text-xs font-black text-on-surface font-mono group-hover:text-primary">0806 515 4338</span>
              </button>
              <button
                onClick={() => onNavigateToView('contacts')}
                className="p-3 bg-surface border border-outline-variant/25 rounded hover:border-primary/50 transition-all text-left group"
              >
                <span className="text-[9px] text-primary font-black uppercase block mb-1">ABUJA (FCT) COMMAND</span>
                <span className="text-xs font-black text-on-surface font-mono group-hover:text-primary">0705 733 7653</span>
              </button>
            </div>
            <button
              onClick={() => onNavigateToView('contacts')}
              className="w-full py-2.5 bg-primary text-black font-black text-[10px] uppercase tracking-wider rounded hover:bg-primary/80 transition-all text-center shadow-lg"
            >
              BROWSE ALL 36 NIGERIAN STATES DIRECTORY
            </button>
          </div>

        </div>

        {/* Right Information Column (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Medical Identity Card Preview */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-error" />
                <h3 className="font-black text-sm text-on-surface uppercase tracking-wider">MEDICAL PROFILE</h3>
              </div>
              <button 
                onClick={() => onNavigateToView('profile')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>EDIT</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {userProfile ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-outline-variant/20 pb-3">
                  <div>
                    <h4 className="text-base font-black text-on-surface">{userProfile.name || 'Anonymous User'}</h4>
                    <p className="text-xs text-on-surface-variant">DOB: {userProfile.dob || 'Not Configured'}</p>
                    {userProfile.location && (
                      <p className="text-[11px] text-primary font-bold flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[200px]">{userProfile.location}</span>
                      </p>
                    )}
                  </div>
                  <div className="bg-error/10 text-error border border-error/20 px-3 py-1 rounded text-sm font-black">
                    {userProfile.bloodGroup || '—'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase">Allergies</span>
                    <p className="font-bold text-on-surface mt-0.5 truncate">
                      {userProfile.allergies?.length > 0 ? userProfile.allergies.join(', ') : 'None Reported'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase">Conditions</span>
                    <p className="font-bold text-on-surface mt-0.5 truncate text-error">
                      {userProfile.conditions?.length > 0 ? userProfile.conditions.join(', ') : 'None Registered'}
                    </p>
                  </div>
                </div>

                {userProfile.medications?.length > 0 && (
                  <div className="bg-surface-container-high p-3 rounded border border-outline-variant/20 space-y-2">
                    <div className="flex items-center gap-1.5 text-primary">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-wider">MEDICATION REMINDER</span>
                    </div>
                    {userProfile.medications.slice(0, 1).map((med, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-bold text-on-surface">{med.name}</span>
                        <span className="text-on-surface-variant">{med.dosage} ({med.frequency})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <p className="text-xs text-on-surface-variant font-bold">No Medical Profile Configured yet.</p>
                <button 
                  onClick={() => onNavigateToView('profile')}
                  className="px-4 py-2 bg-primary text-black font-black text-xs rounded hover:bg-primary/80 transition-all"
                >
                  SETUP LIFE PROFILE
                </button>
              </div>
            )}
          </div>

          {/* Quick-Dial Priority Contacts Widget */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm text-on-surface uppercase tracking-wider">PRIORITY CONTACTS</h3>
              <button 
                onClick={() => onNavigateToView('contacts')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>MANAGE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {starContacts.length > 0 ? (
                starContacts.map((contact) => (
                  <div 
                    key={contact.id} 
                    className="flex justify-between items-center p-3 rounded-md bg-surface-container-high border border-outline-variant/20"
                  >
                    <div>
                      <h4 className="text-xs font-black text-on-surface">{contact.name}</h4>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase">{contact.relationship}</p>
                    </div>
                    <a 
                      href={`tel:${contact.phone}`}
                      className="p-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-md transition-all active:scale-90"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </a>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 space-y-2">
                  <p className="text-xs text-on-surface-variant">No custom priority contacts starred yet.</p>
                  <button 
                    onClick={() => onNavigateToView('contacts')}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    View Preloaded Nigerian Agencies
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Kids Emergency Cartoon Guide Promo Card */}
          <div className="bg-gradient-to-br from-amber-500/15 via-surface-container to-emerald-500/15 border border-primary/30 rounded-lg p-5 space-y-3 shadow-md relative overflow-hidden">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                <h3 className="font-black text-sm text-on-surface uppercase tracking-wider">KIDS EMERGENCY CARTOON GUIDE</h3>
              </div>
              <span className="text-[9px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                CHILD REASSURING
              </span>
            </div>
            
            <p className="text-xs text-on-surface-variant leading-relaxed font-bold">
              Engaging, friendly 4-step cartoon visualization designed to teach children how asking for help with ALERTNOW is safe, easy, and smart!
            </p>

            <button
              onClick={() => onNavigateToView('kids')}
              className="w-full py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Smile className="w-4 h-4" />
              <span>OPEN KIDS CARTOON GUIDE</span>
            </button>
          </div>

        </div>
      </div>

      {/* Official AlertNow Executive Care & Smart Wristband Showcase Banner (Matching Official Flyer) */}
      <div className="bg-[#0D0D0D] border border-[#D4AF37]/40 rounded-xl p-6 text-white relative overflow-hidden shadow-xl mt-8">
        {/* Decorative Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F5D061] to-[#D4AF37]" />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Column 1: Product Showcase */}
          <div className="md:col-span-4 space-y-2 border-b md:border-b-0 md:border-r border-[#D4AF37]/20 pb-4 md:pb-0 md:pr-4">
            <span className="text-[9px] font-mono text-[#D4AF37] font-black uppercase tracking-widest block">
              OUR PRODUCT
            </span>
            <h4 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-2">
              <Watch className="w-4 h-4 text-[#D4AF37]" />
              THE ALERTNOW SMART WRISTBAND
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold">
              Equipped with advanced distress alert triggers, location tracking, and real-time vital signs monitoring connected to dispatch centers.
            </p>
          </div>

          {/* Column 2: Comprehensive Care Services */}
          <div className="md:col-span-5 space-y-2 border-b md:border-b-0 md:border-r border-[#D4AF37]/20 pb-4 md:pb-0 md:pr-4">
            <span className="text-[9px] font-mono text-[#D4AF37] font-black uppercase tracking-widest block">
              OUR SERVICES
            </span>
            <h4 className="text-sm font-black text-white tracking-wide uppercase">
              COMPREHENSIVE CARE PLAN
            </h4>
            <ul className="text-[10px] text-zinc-300 space-y-1 font-semibold">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                24/7 Monitored Dispatch & Proactive Care
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                Continuous Remote Monitoring & Live Dispatchers
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                Immediate Family Notification & Medical Liaison
              </li>
            </ul>
          </div>

          {/* Column 3: Call to Service */}
          <div className="md:col-span-3 space-y-2.5 text-left md:text-right">
            <span className="text-[9px] font-mono text-[#D4AF37] font-black uppercase tracking-widest block">
              CALL TO SERVICE
            </span>
            <a 
              href="tel:+2349076151444" 
              className="text-sm font-mono font-black text-white hover:text-[#D4AF37] transition-colors block"
            >
              +234 907 615 1444
            </a>
            <div className="text-[10px] text-zinc-400 font-bold uppercase space-y-0.5">
              <p className="text-[#D4AF37] font-semibold">VISIT: www.AlertNowCare.com</p>
              <p className="text-[9px] text-zinc-500">Lagos, Nigeria West Africa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
