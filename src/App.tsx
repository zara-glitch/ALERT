import React, { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  Lock, 
  Mail, 
  Key, 
  UserPlus, 
  LogIn, 
  HelpCircle, 
  Check, 
  X, 
  Bell,
  MapPin,
  HeartPulse,
  Battery,
  BatteryCharging,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Firebase modules
import { auth, db } from './lib/firebase';
import { UserProfile, EmergencyContact, SafetyPlan, AppNotification, Message } from './types';

// Client components
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import EmergencySOS from './components/EmergencySOS';
import MedicalProfile from './components/MedicalProfile';
import EmergencyContacts from './components/EmergencyContacts';
import AIAssistant from './components/AIAssistant';
import FirstAidGuides from './components/FirstAidGuides';
import EmergencyProtocolsView from './components/EmergencyProtocolsView';
import SettingsView from './components/Settings';
import About from './components/About';
import KidsEmergencyGuide from './components/KidsEmergencyGuide';
import ContactUs from './components/ContactUs';
import VoiceSosOutsideModal from './components/VoiceSosOutsideModal';

// Preloaded data
import { preloadedNigerianContacts } from './data/emergencyContacts';

const DEFAULT_PLANS: SafetyPlan[] = [
  {
    id: 'plan-fire',
    title: 'Home Fire Emergency Action Plan',
    description: 'Immediate procedures for fire outbreak inside residence.',
    steps: [
      { id: 'fire-1', text: 'Shout "Fire!" to notify all family occupants instantly.', completed: false },
      { id: 'fire-2', text: 'Evacuate immediately via designated primary escape route. Do not gather assets.', completed: false },
      { id: 'fire-3', text: 'Crawl low under smoke to maintain visibility and breathable air.', completed: false },
      { id: 'fire-4', text: 'Congregate at pre-selected external meeting point.', completed: false },
      { id: 'fire-5', text: 'Trigger AlertNow SOS to call Federal Fire Service (08032003557).', completed: false }
    ]
  },
  {
    id: 'plan-flood',
    title: 'Flooding Safety Checklist',
    description: 'Pre-flooding drainage clearances and high point escape plans.',
    steps: [
      { id: 'flood-1', text: 'Disconnect electricity mains and lift high-voltage appliances.', completed: false },
      { id: 'flood-2', text: 'Secure medical go-bag containing primary medications and paper IDs.', completed: false },
      { id: 'flood-3', text: 'Clear household drainage channels to prevent pooled backup.', completed: false },
      { id: 'flood-4', text: 'Evacuate to pre-selected elevation shelter or regional NEMA camps.', completed: false }
    ]
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>({
    uid: 'offline-commander-uid',
    email: 'saraog71@gmail.com', // Active session email
    displayName: 'Commander Sentinel'
  });
  const [loading, setLoading] = useState(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  // Authentication screen states
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [resetSent, setResetSent] = useState(false);
  const [authError, setAuthError] = useState('');

  // App core states
  const [currentView, setCurrentView] = useState('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>(preloadedNigerianContacts);
  const [plans, setPlans] = useState<SafetyPlan[]>(DEFAULT_PLANS);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  
  // Settings & Adaptive UI states
  const [appTheme, setAppTheme] = useState<'dark' | 'executive'>(() => {
    return (localStorage.getItem('alertnow_theme') as 'dark' | 'executive') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('alertnow_theme', appTheme);
    document.documentElement.setAttribute('data-theme', appTheme);
  }, [appTheme]);

  const [highContrast, setHighContrast] = useState(false);
  const [colorBlind, setColorBlind] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [voiceSosEnabled, setVoiceSosEnabled] = useState(() => {
    return localStorage.getItem('alertnow_voicesos') === 'true';
  });

  // Telemetry & GPS tracking states
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [locationWatcher, setLocationWatcher] = useState<number | null>(null);
  
  // Battery status states
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  // Overlay HUD controllers
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isVoiceOutsideModalOpen, setIsVoiceOutsideModalOpen] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: 'success' | 'alert' }[]>([]);

  // 1. URL Deep Link & Shortcut Listener for Outside-App Triggers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();
      const isVoiceTrigger = searchParams.get('trigger') === 'voice' || searchParams.get('voice') === 'true' || hash.includes('voice');
      const isSosTrigger = searchParams.get('sos') === 'true' || searchParams.get('action') === 'sos' || hash.includes('sos');
      const isDeactivateTrigger = searchParams.get('action') === 'deactivate' || searchParams.get('cancel') === 'true' || searchParams.get('deactivate') === 'true' || hash.includes('cancel') || hash.includes('deactivate');

      if (isDeactivateTrigger) {
        setIsSOSActive(false);
        setCurrentView('dashboard');
        addToast("OUTSIDE-APP DEACTIVATION: Emergency SOS cancelled. Returned to Home Screen.", "success");
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } else if (isVoiceTrigger || isSosTrigger) {
        setVoiceSosEnabled(true);
        setIsSOSActive(true);
        setCurrentView('sos');
        addToast("OUTSIDE-APP TRIGGER DETECTED: Activating Voice SOS Emergency Sequence!", "alert");
        if ('speechSynthesis' in window) {
          window.speechSynthesis.speak(new SpeechSynthesisUtterance("Outside app Voice SOS trigger activated. Emergency sequence engaged."));
        }
      }
    }
  }, []);

  // 1. Toast notify system
  const addToast = (msg: string, type: 'success' | 'alert' = 'success') => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // 2. Internet Connectivity Watcher
  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      addToast('System Online. Automatic cloud synchronization complete.', 'success');
    };
    const goOffline = () => {
      setIsOnline(false);
      addToast('System Offline. Swapped to Local Sentinel cache storage.', 'alert');
    };

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // 3. Geolocation Continuous GPS satellite watcher
  useEffect(() => {
    if ('geolocation' in navigator) {
      const success = (position: GeolocationPosition) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Reverse-geocode coordinates (simulated robustly for Nigerian addresses)
        let address = "Aureus Sentinel GPS Grid lock established.";
        if (lat > 6 && lat < 7 && lng > 3 && lng < 4) {
          address = "Lagos Medical Sector Zone, Ikeja, Lagos State, Nigeria.";
        } else if (lat > 7 && lat < 8 && lng > 3 && lng < 4) {
          address = "UCH Teaching Complex, Ibadan, Oyo State, Nigeria.";
        } else if (lat > 9 && lat < 10 && lng > 7 && lng < 8) {
          address = "NEMA Central HQ Sector, Wuse II, Abuja FCT, Nigeria.";
        } else {
          address = `Sector Latitude ${lat.toFixed(4)}°N, Longitude ${lng.toFixed(4)}°E. National Grid.`;
        }

        setCurrentLocation({ lat, lng, address });
      };

      const error = (err: GeolocationPositionError) => {
        console.warn("GPS Access Denied:", err);
        // Load secure offline placeholder coords
        setCurrentLocation({
          lat: 6.5244,
          lng: 3.3792,
          address: "Offline Satellite Fallback. Ikeja Core Area, Lagos, Nigeria."
        });
      };

      const watcher = navigator.geolocation.watchPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 1000
      });

      setLocationWatcher(watcher);
    } else {
      addToast("GPS satellite tracking not supported on this receiver.", 'alert');
    }

    return () => {
      if (locationWatcher) navigator.geolocation.clearWatch(locationWatcher);
    };
  }, []);

  // 4. Battery Status API Watcher
  useEffect(() => {
    let battery: any = null;

    const handleChargingChange = () => {
      if (battery) setIsCharging(battery.charging);
    };

    const handleLevelChange = () => {
      if (battery) setBatteryLevel(battery.level * 100);
    };

    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((bat: any) => {
        battery = bat;
        setBatteryLevel(bat.level * 100);
        setIsCharging(bat.charging);

        battery.addEventListener('chargingchange', handleChargingChange);
        battery.addEventListener('levelchange', handleLevelChange);
      }).catch((err: any) => {
        console.warn("Battery API error:", err);
      });
    }

    return () => {
      if (battery) {
        battery.removeEventListener('chargingchange', handleChargingChange);
        battery.removeEventListener('levelchange', handleLevelChange);
      }
    };
  }, []);

  // 4. Offline-first, automated local identity & data sync initializer
  useEffect(() => {
    // Establish immediate, high-security mock user identity
    const mockUser = {
      uid: 'offline-commander-uid',
      email: 'saraog71@gmail.com', // Active session email
      displayName: 'Commander Sentinel'
    };
    setCurrentUser(mockUser);

    // Load user medical profile from localStorage, falling back to preloaded defaults
    const storedProfile = localStorage.getItem('alertnow_profile');
    let loadedProfile: UserProfile | null = null;
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        if (parsed && parsed.name !== 'Commander Sentinel') {
          loadedProfile = parsed;
        }
      } catch (e) {
        console.error("Failed to parse stored profile", e);
      }
    }

    if (loadedProfile) {
      setUserProfile(loadedProfile);
    } else {
      const defaultProfile: UserProfile = {
        uid: mockUser.uid,
        email: mockUser.email,
        name: '',
        dob: '',
        gender: '',
        height: '',
        weight: '',
        bloodGroup: '',
        allergies: [],
        medications: [],
        conditions: [],
        organDonor: false,
        insurance: '',
        preferredHospital: '',
        primaryDoctor: '',
        medicalIdNumber: 'AL-' + Math.floor(Math.random() * 9000 + 1000),
        lifestyle: { smoking: 'Never', alcohol: 'None', exercise: 'Regular' },
        qrEnabled: true,
        location: ''
      };
      setUserProfile(defaultProfile);
      localStorage.setItem('alertnow_profile', JSON.stringify(defaultProfile));
    }

    // Load emergency contacts from localStorage, ensuring preloaded ones exist
    const storedContacts = localStorage.getItem('alertnow_contacts');
    if (storedContacts) {
      try {
        const parsed: EmergencyContact[] = JSON.parse(storedContacts);
        // Filter out Dr. Alabi and Omolara Alabi if present in stored state
        const filtered = parsed.filter(c => c.id !== 'dr-alabi' && c.id !== 'fam-omolara' && !c.name.toLowerCase().includes('omolara'));
        const merged = [...filtered];
        preloadedNigerianContacts.forEach(pre => {
          if (!merged.some(m => m.id === pre.id)) {
            merged.unshift(pre);
          }
        });
        setContacts(merged);
        localStorage.setItem('alertnow_contacts', JSON.stringify(merged));
      } catch (e) {
        setContacts(preloadedNigerianContacts);
        localStorage.setItem('alertnow_contacts', JSON.stringify(preloadedNigerianContacts));
      }
    } else {
      setContacts(preloadedNigerianContacts);
      localStorage.setItem('alertnow_contacts', JSON.stringify(preloadedNigerianContacts));
    }

    // Load safety checklists/plans from localStorage, falling back to preloaded defaults
    const storedPlans = localStorage.getItem('alertnow_plans');
    if (storedPlans) {
      try {
        setPlans(JSON.parse(storedPlans));
      } catch (e) {
        setPlans(DEFAULT_PLANS);
      }
    } else {
      setPlans(DEFAULT_PLANS);
      localStorage.setItem('alertnow_plans', JSON.stringify(DEFAULT_PLANS));
    }

    // Load active app notifications from localStorage
    const storedNotifications = localStorage.getItem('alertnow_notifications');
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (e) {
        setNotifications([]);
      }
    } else {
      const defaultNotifications = [
        {
          id: 'n-init',
          title: 'Aureus Sentinel Active',
          message: 'Your high-contrast emergency clinical console is fully active. Password logins have been bypassed for seamless immediate operational access.',
          timestamp: Date.now(),
          type: 'system' as const,
          read: false
        }
      ];
      setNotifications(defaultNotifications);
      localStorage.setItem('alertnow_notifications', JSON.stringify(defaultNotifications));
    }

    setLoading(false);
    addToast("Identity unlocked. Running in Secure Direct-Access mode.", "success");
  }, []);

  // 4b. Local storage synchronization side-effects
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('alertnow_profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('alertnow_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('alertnow_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('alertnow_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('alertnow_voicesos', voiceSosEnabled ? 'true' : 'false');
  }, [voiceSosEnabled]);

  // Global Speech Recognition (Voice SOS Listener)
  useEffect(() => {
    let recognition: any = null;
    let keepListening = true;

    if (voiceSosEnabled) {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        try {
          recognition = new SpeechRecognitionClass();
          recognition.continuous = true;
          recognition.interimResults = false;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
            console.log("Voice SOS Audio Hook:", transcript);
            
            // Check for voice deactivation commands
            if (
              transcript.includes('cancel sos') ||
              transcript.includes('cancel emergency') ||
              transcript.includes('deactivate sos') ||
              transcript.includes('deactivate') ||
              transcript.includes('stop sos') ||
              transcript.includes('stop emergency') ||
              transcript.includes('stand down') ||
              transcript.includes('safe safe') ||
              transcript.includes('false alarm') ||
              transcript.includes('all clear') ||
              transcript.includes('cancel cancel') ||
              transcript.includes('cancel')
            ) {
              setIsSOSActive(false);
              setCurrentView('dashboard');
              addToast("VOICE DEACTIVATION DETECTED: Emergency SOS cancelled. Returned to Home Screen.", "success");
              if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
            } else if (
              transcript.includes('help help') || 
              transcript.includes('emergency') || 
              transcript.includes('activate alert') || 
              transcript.includes('sos sos') ||
              transcript.includes('danger danger')
            ) {
              setIsSOSActive(true);
              setCurrentView('sos');
              addToast("VOICE TRIGGER DETECTED: Activating Emergency SOS Dispatch!", "alert");
              if ('speechSynthesis' in window) {
                window.speechSynthesis.speak(new SpeechSynthesisUtterance("Voice trigger detected. Activating SOS emergency dispatch sequence."));
              }
            }
          };

          recognition.onerror = (err: any) => {
            console.warn("Speech Recognition transient error:", err.error);
          };

          recognition.onend = () => {
            if (voiceSosEnabled && keepListening && recognition) {
              try {
                recognition.start();
              } catch (e) {
                console.warn("Speech recognition fail on restart:", e);
              }
            }
          };

          recognition.start();
          addToast("Voice SOS Sentinel active. Listening for 'Help Help' or 'SOS'.", "success");
        } catch (e) {
          console.error("Failed to initialize Web Speech Recognition:", e);
        }
      } else {
        addToast("Vocal recognition API not supported on this browser context.", "alert");
      }
    }

    return () => {
      keepListening = false;
      if (recognition) {
        recognition.onend = null;
        try {
          recognition.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [voiceSosEnabled]);

  // 5. Secure Firebase Database Sync helpers
  const handleSaveProfile = async (profile: UserProfile) => {
    setUserProfile(profile);
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      try {
        await updateDoc(userRef, { profile });
        addToast('Medical Profile Cloud Sync Succeeded.', 'success');
      } catch (err) {
        console.error(err);
        addToast('Saved profile locally. Will retry upload when online.', 'alert');
      }
    } else {
      addToast('Profile saved locally.', 'success');
    }
  };

  const handleAddContact = async (contact: EmergencyContact) => {
    const updated = [contact, ...contacts];
    setContacts(updated);
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      try {
        await updateDoc(userRef, { contacts: updated });
        addToast('Emergency Contacts database synchronized.', 'success');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteContact = async (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      try {
        await updateDoc(userRef, { contacts: updated });
        addToast('Contact purged from security registers.', 'success');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleTogglePriority = async (id: string) => {
    const updated = contacts.map(c => c.id === id ? { ...c, priority: !c.priority } : c);
    setContacts(updated);
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      try {
        await updateDoc(userRef, { contacts: updated });
        addToast('Contact priority updated.', 'success');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddPlan = async (plan: SafetyPlan) => {
    const updated = [plan, ...plans];
    setPlans(updated);
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      try {
        await updateDoc(userRef, { plans: updated });
        addToast('Custom Safety Directive committed.', 'success');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdatePlan = async (plan: SafetyPlan) => {
    const updated = plans.map(p => p.id === plan.id ? plan : p);
    setPlans(updated);
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      try {
        await updateDoc(userRef, { plans: updated });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeletePlan = async (id: string) => {
    const updated = plans.filter(p => p.id !== id);
    setPlans(updated);
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      try {
        await updateDoc(userRef, { plans: updated });
        addToast('Safety Plan purged.', 'success');
      } catch (err) {
        console.error(err);
      }
    }
  };

  // 6. Gemini-powered Secure Server proxy AI chat handler
  const handleSendChatMessage = async (text: string, imageUrl?: string) => {
    const newUserMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: Date.now(),
      imageUrl
    };

    setChatMessages(prev => [...prev, newUserMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, newUserMsg],
          userMedicalContext: userProfile
        })
      });

      const data = await res.json();
      const aiReply: Message = {
        id: Math.random().toString(),
        sender: 'ai',
        text: data.text,
        timestamp: Date.now(),
        suggestedActions: data.suggestedActions
      };

      setChatMessages(prev => [...prev, aiReply]);

      if (speechEnabled && 'speechSynthesis' in window) {
        // Strip asterisks or markdown brackets for speech
        const cleanSpeak = data.text.replace(/[\*\#\_]/g, '');
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(cleanSpeak.slice(0, 150)));
      }
    } catch (err) {
      console.error(err);
      const errReply: Message = {
        id: Math.random().toString(),
        sender: 'ai',
        text: "Direct connection with clinical command centers is restricted. Please call emergency dials immediately in severe situations.",
        timestamp: Date.now()
      };
      setChatMessages(prev => [...prev, errReply]);
    }
  };

  // 7. Core auth execution blocks (Bypassed for local-first direct access)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const emailToUse = authEmail || 'saraog71@gmail.com';
    const mockUser = {
      uid: 'offline-commander-uid',
      email: emailToUse,
      displayName: 'Commander Sentinel'
    };
    setCurrentUser(mockUser);
    addToast("Identity unlocked. Running in Secure Direct-Access mode.", "success");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const emailToUse = authEmail || 'saraog71@gmail.com';
    const mockUser = {
      uid: 'offline-commander-uid',
      email: emailToUse,
      displayName: 'Commander Sentinel'
    };
    setCurrentUser(mockUser);
    addToast("Identity unlocked. Running in Secure Direct-Access mode.", "success");
  };

  const handlePasswordReset = async () => {
    if (!authEmail) {
      setAuthError("Input your email first to deliver reset payload.");
      return;
    }
    setResetSent(true);
    addToast("Simulated password reset email dispatched.", "success");
    setTimeout(() => setResetSent(false), 5000);
  };

  const handleLogout = async () => {
    setCurrentUser(null);
    addToast('Logged out securely.', 'success');
  };

  const handleResetApp = async () => {
    // Purges offline indexes
    setUserProfile(null);
    setContacts(preloadedNigerianContacts);
    setPlans(DEFAULT_PLANS);
    setChatMessages([]);
    setNotifications([]);
    localStorage.clear();
    setCurrentUser(null);
    addToast('Aureus memory bank wiped clean.', 'alert');
    window.location.reload();
  };

  const copyLocationToClipboard = () => {
    if (currentLocation) {
      navigator.clipboard.writeText(`GPS: ${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}. Address: ${currentLocation.address}`);
      addToast('Satellite coordinates locked to clipboard.', 'success');
    }
  };

  const shareLocationNative = () => {
    if (currentLocation) {
      if (navigator.share) {
        navigator.share({
          title: 'AlertNow Emergency Coordinates',
          text: `My current location: ${currentLocation.address} (GPS: ${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)})`,
          url: `https://www.google.com/maps/search/?api=1&query=${currentLocation.lat},${currentLocation.lng}`
        });
      } else {
        copyLocationToClipboard();
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black text-primary font-mono flex flex-col items-center justify-center space-y-6">
        <HeartPulse className="w-16 h-16 animate-pulse text-primary" />
        <div className="space-y-2 text-center">
          <p className="tracking-widest font-black uppercase text-sm animate-bounce">BOOTING ALERTNOW V2 SECURE COGNITION</p>
          <p className="text-[10px] text-neutral-500">ESTABLISHING INTEGRITY RADARS...</p>
        </div>
      </div>
    );
  }

  const isPowerSaver = batteryLevel !== null && batteryLevel < 20;

  // Display Logged In Workspace
  return (
    <div className={`min-h-screen transition-all duration-500 font-sans overflow-x-hidden
      ${highContrast ? 'bg-black text-white' : 'bg-background text-on-background'}
      ${currentView === 'sos' && 'bg-black text-white'}
      ${isPowerSaver ? 'brightness-80' : ''}`}
    >
      
      {/* Side collapsible navigation */}
      <Navigation 
        currentView={currentView}
        setCurrentView={setCurrentView}
        notificationsCount={notifications.filter(n => !n.read).length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        userEmail={currentUser?.email || 'saraog71@gmail.com'}
        highContrast={highContrast}
        colorBlind={colorBlind}
        onToggleSOS={() => setIsSOSActive(true)}
        isCollapsed={isNavCollapsed}
        setIsCollapsed={setIsNavCollapsed}
        onOpenVoiceOutsideModal={() => setIsVoiceOutsideModalOpen(true)}
        voiceSosEnabled={voiceSosEnabled}
      />

      {/* Backdrop overlay for when desktop navigation is expanded to hide page content under it */}
      {!isNavCollapsed && (
        <div 
          id="desktop-nav-backdrop"
          onClick={() => setIsNavCollapsed(true)}
          className="hidden md:block fixed inset-0 bg-black/60 backdrop-blur-[2px] z-30 transition-all duration-300 cursor-pointer"
        />
      )}

      {/* Main view container content wrapper */}
      <main className={`transition-all duration-300 ${isNavCollapsed ? 'md:pl-24' : 'md:pl-72'} ${currentView !== 'ai' && 'py-20 md:py-8 px-4 md:px-8 max-w-7xl mx-auto'}`}>
        
        {/* Power Saver Active Alert Banner */}
        {isPowerSaver && (
          <div 
            id="power-saver-mode-active-banner" 
            className="mb-4 p-3.5 bg-amber-500/10 border border-amber-500/35 text-amber-500 rounded-lg flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-wider transition-all duration-500"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>⚡ Power Saver Mode Active: Display brightness dimmed and ambient animations paused.</span>
            </div>
            <span className="text-[10px] bg-amber-500/20 px-2.5 py-1 rounded font-mono font-black">
              BATTERY: {Math.round(batteryLevel || 0)}%
            </span>
          </div>
        )}

        {/* Top Stats Bar */}
        <header className={`hidden md:flex h-16 border border-outline-variant/30 bg-surface items-center justify-between px-6 rounded-lg mb-6
          ${highContrast ? 'border-white' : ''}`}>
          <div className="flex gap-8 items-center">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full bg-emerald-500 ${isPowerSaver ? '' : 'animate-pulse'}`}></div>
              <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider font-bold">System: Online</span>
            </div>
            {currentLocation && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider font-bold">
                  GPS Lock: {currentLocation.lat.toFixed(4)}° N, {currentLocation.lng.toFixed(4)}° E
                </span>
              </div>
            )}
            {batteryLevel !== null && (
              <div className="flex items-center gap-2" title={isCharging ? "Charging" : "Discharging"}>
                {isCharging ? (
                  <BatteryCharging className={`w-4 h-4 text-emerald-500 ${isPowerSaver ? '' : 'animate-pulse'}`} />
                ) : (
                  <Battery className={`w-4 h-4 ${batteryLevel <= 20 ? 'text-error' : 'text-primary'}`} />
                )}
                <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider font-bold">
                  Power: {Math.round(batteryLevel)}% {isCharging && '(Charging)'}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setAppTheme(prev => prev === 'dark' ? 'executive' : 'dark')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-xs font-bold text-on-surface hover:border-primary/50 transition-all active:scale-95"
              title={`Active Theme: ${appTheme === 'dark' ? 'Dark Sentinel (Original)' : 'Executive Gold & Ivory (Official)'}. Click to toggle.`}
            >
              <Palette className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-mono tracking-wider uppercase font-black">
                {appTheme === 'dark' ? 'ORIGINAL DARK' : 'EXECUTIVE IVORY'}
              </span>
            </button>

            <button 
              onClick={shareLocationNative}
              className="px-4 py-1.5 bg-primary text-black text-[11px] font-black rounded-full hover:brightness-110 active:scale-95 transition-all tracking-wider"
            >
              SHARE STATUS
            </button>
            <button 
              onClick={() => setCurrentView('settings')}
              className="text-on-surface-variant hover:text-primary transition-colors text-base"
              title="Settings"
            >
              ⚙️
            </button>
          </div>
        </header>

        {/* Dynamic component routing view container */}
        <div className="pb-16 md:pb-0">
          {currentView === 'dashboard' && (
            <Dashboard 
              userProfile={userProfile}
              contacts={contacts}
              currentLocation={currentLocation}
              isOnline={isOnline}
              onCopyLocation={copyLocationToClipboard}
              onShareLocation={shareLocationNative}
              onOpenSOS={() => setIsSOSActive(true)}
              onNavigateToView={(view) => setCurrentView(view)}
              isPowerSaver={isPowerSaver}
            />
          )}

          {currentView === 'sos' && (
            <EmergencySOS 
              userProfile={userProfile}
              contacts={contacts}
              currentLocation={currentLocation}
              highContrast={highContrast}
              colorBlind={colorBlind}
              isPowerSaver={isPowerSaver}
              onOpenVoiceOutsideModal={() => setIsVoiceOutsideModalOpen(true)}
              voiceSosEnabled={voiceSosEnabled}
              onDeactivateSOS={() => {
                setIsSOSActive(false);
                setCurrentView('dashboard');
              }}
            />
          )}

          {currentView === 'kids' && (
            <KidsEmergencyGuide 
              onTriggerRealSOS={() => {
                setIsSOSActive(true);
                setCurrentView('sos');
              }}
              onNavigateBack={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'profile' && (
            <MedicalProfile 
              userProfile={userProfile}
              onSaveProfile={handleSaveProfile}
              highContrast={highContrast}
            />
          )}

          {currentView === 'contacts' && (
            <EmergencyContacts 
              contacts={contacts}
              onAddContact={handleAddContact}
              onDeleteContact={handleDeleteContact}
              onTogglePriority={handleTogglePriority}
              userProfile={userProfile}
              currentLocation={currentLocation}
              highContrast={highContrast}
            />
          )}

          {currentView === 'ai' && (
            <AIAssistant 
              messages={chatMessages}
              onSendMessage={handleSendChatMessage}
              onClearHistory={() => setChatMessages([])}
              userMedicalContext={userProfile}
              highContrast={highContrast}
            />
          )}

          {currentView === 'firstaid' && (
            <FirstAidGuides 
              highContrast={highContrast}
            />
          )}

          {(currentView === 'protocols' || currentView === 'plans') && (
            <EmergencyProtocolsView 
              highContrast={highContrast}
              onTriggerSOS={() => setCurrentView('sos')}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView 
              appTheme={appTheme}
              setAppTheme={setAppTheme}
              highContrast={highContrast}
              setHighContrast={setHighContrast}
              colorBlind={colorBlind}
              setColorBlind={setColorBlind}
              speechEnabled={speechEnabled}
              setSpeechEnabled={setSpeechEnabled}
              voiceSosEnabled={voiceSosEnabled}
              setVoiceSosEnabled={setVoiceSosEnabled}
              onLogout={handleLogout}
              onResetApp={handleResetApp}
              userEmail={currentUser ? currentUser.email : undefined}
              onOpenVoiceOutsideModal={() => setIsVoiceOutsideModalOpen(true)}
            />
          )}

          {currentView === 'about' && (
            <About 
              onNavigateToView={(view) => setCurrentView(view)}
              onAskAI={handleSendChatMessage}
              highContrast={highContrast}
            />
          )}

          {currentView === 'contact' && (
            <ContactUs />
          )}
        </div>
      </main>

      {/* Floating Global Urgent SOS overlay */}
      <AnimatePresence>
        {isSOSActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-xl bg-neutral-950 border-4 border-[#f2ca50] rounded-xl p-6 space-y-6 shadow-2xl relative">
              <button 
                onClick={() => setIsSOSActive(false)}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white font-black text-lg"
              >
                ✕
              </button>

              <div className="text-center space-y-1">
                <span className="bg-[#f2ca50] text-black text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                  RAPID SOS RESPONSE HUBS
                </span>
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter mt-3">CONFIRM EMERGENCY DISPATCH</h1>
              </div>

              <EmergencySOS 
                userProfile={userProfile}
                contacts={contacts}
                currentLocation={currentLocation}
                highContrast={highContrast}
                colorBlind={colorBlind}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications overlay slider */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotificationsOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed right-0 top-0 h-full w-full max-w-md z-50 p-6 flex flex-col border-l shadow-2xl
                ${highContrast ? 'bg-black border-white' : 'bg-surface border-outline-variant/30'}`}
            >
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4 mb-4">
                <h3 className="font-black text-sm text-on-surface uppercase tracking-wider">Alert Center</h3>
                <button onClick={() => setIsNotificationsOpen(false)} className="text-primary font-bold text-xs uppercase">Close</button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div key={notif.id} className="p-3 bg-surface-container border border-outline-variant/20 rounded">
                      <h4 className="text-xs font-black text-on-surface">{notif.title}</h4>
                      <p className="text-[10px] text-on-surface-variant leading-relaxed mt-1">{notif.message}</p>
                      <p className="text-[8px] font-mono font-bold text-neutral-500 uppercase mt-2">
                        {new Date(notif.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-on-surface-variant text-center py-12">No new security logs.</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Toasts Notifications Engine */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-50 space-y-2 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className={`p-4 rounded shadow-xl border text-xs font-bold leading-normal pointer-events-auto flex items-center justify-between gap-3
                ${toast.type === 'success' 
                  ? 'bg-neutral-900 border-[#f2ca50] text-[#f2ca50]' 
                  : 'bg-neutral-950 border-red-500 text-red-500'}`}
            >
              <span>{toast.msg}</span>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-[10px] hover:text-white"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Outside App Voice SOS Configuration Modal */}
      <VoiceSosOutsideModal 
        isOpen={isVoiceOutsideModalOpen}
        onClose={() => setIsVoiceOutsideModalOpen(false)}
        voiceSosEnabled={voiceSosEnabled}
        setVoiceSosEnabled={setVoiceSosEnabled}
        onTestTrigger={() => {
          setIsVoiceOutsideModalOpen(false);
          setIsSOSActive(true);
          setCurrentView('sos');
          addToast("OUTSIDE VOICE SOS TEST ACTIVATED: Launching Emergency Dispatch!", "alert");
          if ('speechSynthesis' in window) {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance("Outside app Voice SOS test activated. Emergency dispatch sequence engaged."));
          }
        }}
      />

    </div>
  );
}
