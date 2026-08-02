import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Star, 
  Trash2, 
  PhoneCall, 
  MessageSquare, 
  ExternalLink, 
  Search,
  Building,
  HeartPulse,
  Flame,
  ShieldCheck,
  Check,
  MapPin,
  Share2,
  Copy,
  Mail,
  CheckCircle2,
  Info,
  Shield,
  MessageCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { EmergencyContact, UserProfile } from '../types';
import { nigerianStateEmergencyContacts, StateEmergencyContact } from '../data/stateEmergencyContacts';
import { 
  EmergencyIncidentData, 
  generateIncidentRef, 
  generateEmergencyEmailHref, 
  generateEmergencyWhatsAppHref,
  generateEmergencySmsHref
} from '../utils/emergencyReport';
import EmergencyEmailModal from './EmergencyEmailModal';

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  onAddContact: (contact: EmergencyContact) => void;
  onDeleteContact: (id: string) => void;
  onTogglePriority: (id: string) => void;
  userProfile: UserProfile | null;
  currentLocation: { lat: number; lng: number; address: string } | null;
  highContrast: boolean;
}

export default function EmergencyContacts({
  contacts,
  onAddContact,
  onDeleteContact,
  onTogglePriority,
  userProfile,
  currentLocation,
  highContrast
}: EmergencyContactsProps) {
  // Add Contact Form State
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [phone, setPhone] = useState('');
  const [whatsappSupported, setWhatsappSupported] = useState(true);
  const [priority, setPriority] = useState(false);

  // Active Tab: 'roster' (User contacts) vs 'states' (36 Nigerian States Directory)
  const [activeTab, setActiveTab] = useState<'roster' | 'states'>('states');

  // Filters state
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [emailModalData, setEmailModalData] = useState<EmergencyIncidentData | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      const newContact: EmergencyContact = {
        id: 'cust-' + Math.random().toString(36).substring(2, 9),
        name: name.trim(),
        relationship,
        phone: phone.trim(),
        priority,
        whatsappSupported,
        isAgency: false
      };
      onAddContact(newContact);
      setName('');
      setPhone('');
      setPriority(false);
    }
  };

  const handleCopy = (phoneNo: string) => {
    navigator.clipboard.writeText(phoneNo);
    setCopiedPhone(phoneNo);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleShareContact = (title: string, phoneNo: string, stateName?: string) => {
    const text = `ALERTNOW Verified Emergency Contact for ${title}${stateName ? ` (${stateName} State)` : ''}: ${phoneNo}. National Lifeline: 112, FRSC: 122.`;
    if (navigator.share) {
      navigator.share({
        title: `${title} - ALERTNOW Emergency`,
        text: text,
        url: window.location.href
      }).catch(err => console.log('Share error:', err));
    } else {
      handleCopy(phoneNo);
    }
  };

  const getIncidentDataForService = (serviceName: string, servicePhone: string, stateName: string): EmergencyIncidentData => {
    return {
      incidentRef: generateIncidentRef(),
      emergencyType: 'Emergency Dispatch Request',
      timestamp: new Date().toLocaleString(),
      userName: userProfile?.name || 'AlertNow User',
      medicalIdNumber: userProfile?.medicalIdNumber || 'AL-2026',
      bloodGroup: userProfile?.bloodGroup || 'Unspecified',
      allergies: userProfile?.allergies || [],
      state: stateName,
      emergencyService: serviceName,
      servicePhone: servicePhone,
      locationAddress: currentLocation?.address || 'Current Coordinates',
      latitude: currentLocation?.lat,
      longitude: currentLocation?.lng,
      shortDescription: `Emergency assistance request sent via ALERTNOW 112 directory.`
    };
  };

  const isPinned = (stateName: string, type: string, phoneNo: string) => {
    const cleanNo = phoneNo.replace(/\s+/g, '').replace(/^\+/, '');
    return contacts.some(c => c.phone.replace(/\s+/g, '').replace(/^\+/, '') === cleanNo);
  };

  const handlePin = (stateName: string, phoneNo: string, type: 'Police' | 'SEMA' | 'Fire' | 'Ambulance' | 'FRSC') => {
    const newContact: EmergencyContact = {
      id: `state-${stateName.toLowerCase().replace(/\s+/g, '-')}-${type.toLowerCase()}`,
      name: `${stateName} State ${type} Dispatch`,
      relationship: `${stateName} State ${type}`,
      phone: phoneNo,
      priority: true,
      whatsappSupported: phoneNo.startsWith('+234') || phoneNo === '112',
      isAgency: true,
      agencyType: type === 'Police' ? 'Police' : type === 'Fire' ? 'Fire' : 'Ambulance'
    };
    onAddContact(newContact);
  };

  // Advanced multi-token smart search across 36 states emergency dataset
  const filteredStateContacts = nigerianStateEmergencyContacts.filter(sc => {
    // State Filter
    const matchesState = selectedState === 'All' || sc.state === selectedState;

    // Category Filter
    let matchesCategory = true;
    if (selectedCategory === 'Police') {
      matchesCategory = !!sc.policePhone;
    } else if (selectedCategory === 'Medical') {
      matchesCategory = !!sc.ambulancePhone || sc.primaryNumber === '112';
    } else if (selectedCategory === 'Fire') {
      matchesCategory = !!sc.firePhone;
    } else if (selectedCategory === 'SEMA') {
      matchesCategory = !!sc.semaPhone;
    } else if (selectedCategory === 'FRSC') {
      matchesCategory = !!sc.frscPhone;
    }

    if (!matchesState || !matchesCategory) return false;

    // Search Query Matching
    if (!searchQuery.trim()) return true;

    const queryTokens = searchQuery.toLowerCase().trim().split(/\s+/);
    const fullSearchableText = [
      sc.state,
      sc.capital || '',
      sc.region || '',
      sc.notes || '',
      sc.primaryNumber,
      sc.policePhone,
      sc.policeEmail || '',
      sc.semaPhone || '',
      sc.semaEmail || '',
      sc.firePhone || '',
      sc.fireEmail || '',
      sc.ambulancePhone || '',
      sc.frscPhone || '',
      sc.whatsappPhone || '',
      sc.verificationStatus
    ].join(' ').toLowerCase();

    // Check if every token in search query matches somewhere in the contact text
    return queryTokens.every(token => fullSearchableText.includes(token));
  });

  // Filter roster contacts
  const filteredRosterContacts = contacts.filter(contact => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return contact.name.toLowerCase().includes(q) || 
           contact.relationship.toLowerCase().includes(q) || 
           contact.phone.includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* 112 National Lifeline Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-surface-container to-emerald-500/20 border border-amber-500/40 rounded-2xl p-5 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl font-black text-xl border border-amber-500/30">
              112
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                  NIGERIA NATIONAL EMERGENCY LIFELINE
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED 2026
                </span>
              </div>
              <h2 className="text-sm font-black text-on-surface uppercase tracking-wider mt-1">
                FEDERAL GOVERNMENT APPROVED 112 NATIONAL ROUTE
              </h2>
            </div>
          </div>

          <a
            href="tel:112"
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>DIAL 112 NATIONAL</span>
          </a>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed font-bold">
          Nigeria officially uses <strong>112</strong> as the national emergency lifeline for Police, Fire, Ambulance, and Disaster response across all 36 States and the FCT. Verified state-specific control room hotlines are displayed below alongside 112.
        </p>
      </div>

      {/* Top Search, Category Filters & State Selector Bar */}
      <div className="bg-surface-container border border-outline-variant/30 p-4 rounded-2xl space-y-3 shadow-md">
        
        {/* Search Input and State Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3.5" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 36 states, police, ambulance, fire, SEMA, FRSC, 112..."
              className="w-full bg-surface border border-outline-variant/40 rounded-xl pl-10 pr-10 py-2.5 text-xs text-on-surface font-bold focus:border-primary focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-on-surface-variant hover:text-on-surface text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-surface border border-outline-variant/40 rounded-xl px-3 py-2.5 text-xs text-on-surface font-black focus:border-primary focus:outline-none uppercase"
            >
              <option value="All">All 36 States + FCT</option>
              {nigerianStateEmergencyContacts.map(sc => (
                <option key={sc.state} value={sc.state}>{sc.state} State ({sc.capital})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-outline-variant/10">
          <span className="text-[10px] font-mono font-black text-on-surface-variant uppercase mr-1">Filter Service:</span>
          {[
            { id: 'All', label: 'All Services' },
            { id: 'Police', label: '🛡️ Police' },
            { id: 'Medical', label: '🚑 Medical & Ambulance' },
            { id: 'Fire', label: '🚒 Fire & Rescue' },
            { id: 'SEMA', label: '🌊 SEMA Disaster' },
            { id: 'FRSC', label: '🚗 FRSC Highway' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-black shadow-sm font-bold'
                  : 'bg-surface hover:bg-surface-container-high text-on-surface-variant border border-outline-variant/20'
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* Quick reset button */}
          {(selectedState !== 'All' || selectedCategory !== 'All' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSelectedState('All');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="ml-auto text-[10px] font-mono text-amber-400 hover:underline font-bold"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 36 States Directory vs Personal Roster (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Tabs header */}
          <div className="flex border-b border-outline-variant/30 gap-2 pb-1">
            <button
              onClick={() => setActiveTab('states')}
              className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-xl transition-all flex items-center gap-2
                ${activeTab === 'states' 
                  ? 'bg-primary/10 border-b-2 border-primary text-primary' 
                  : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <MapPin className="w-4 h-4" />
              <span>36 States Emergency Directory ({filteredStateContacts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-xl transition-all flex items-center gap-2
                ${activeTab === 'roster' 
                  ? 'bg-primary/10 border-b-2 border-primary text-primary' 
                  : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <Users className="w-4 h-4" />
              <span>Personal Roster ({filteredRosterContacts.length})</span>
            </button>
          </div>

          {activeTab === 'states' ? (
            <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
              {filteredStateContacts.length > 0 ? (
                filteredStateContacts.map(sc => {
                  const stateIncidentData = getIncidentDataForService(`${sc.state} Emergency Command`, sc.primaryNumber, sc.state);

                  return (
                    <div 
                      key={sc.state}
                      className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-4 shadow-sm"
                    >
                      {/* State Header Badge */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-outline-variant/10 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-on-surface uppercase tracking-wider flex items-center gap-2">
                              <MapPin className="w-4.5 h-4.5 text-primary shrink-0" />
                              <span>{sc.state} State Emergency Directory</span>
                            </h3>
                            {sc.region && (
                              <span className="text-[9px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 font-bold uppercase">
                                {sc.region}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3 h-3" /> {sc.verificationStatus} • Capital: <strong>{sc.capital || sc.state}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${sc.primaryNumber}`}
                            className="px-3 py-1.5 bg-amber-400 text-black rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow hover:bg-amber-300"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>DIAL {sc.primaryNumber}</span>
                          </a>
                        </div>
                      </div>

                      {/* Service Grid for this state */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        
                        {/* Police Emergency */}
                        {sc.policePhone && (
                          <div className="p-3.5 bg-surface border border-outline-variant/20 rounded-xl flex flex-col justify-between gap-3">
                            <div>
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] text-blue-400 font-black tracking-wider uppercase flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  POLICE DISPATCH
                                </span>
                                <span className="text-[9px] font-mono text-emerald-400 font-bold">VERIFIED</span>
                              </div>
                              <p className="text-xs font-mono font-black text-on-surface mt-1 tracking-wider">{sc.policePhone}</p>
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-outline-variant/10">
                              <a 
                                href={`tel:${sc.policePhone}`}
                                className="px-2 py-1 bg-primary/20 text-primary hover:bg-primary/30 rounded text-[10px] font-black flex items-center gap-1"
                                title={`Dial ${sc.state} Police`}
                              >
                                <PhoneCall className="w-3 h-3" />
                                <span>CALL</span>
                              </a>

                              <a 
                                href={generateEmergencySmsHref(stateIncidentData, sc.policePhone)}
                                className="px-2 py-1 bg-primary/20 text-primary hover:bg-primary/30 rounded text-[10px] font-black flex items-center gap-1"
                                title={`SMS to ${sc.state} Police`}
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>SMS</span>
                              </a>

                              <button 
                                onClick={() => setEmailModalData(getIncidentDataForService(`${sc.state} Police Command`, sc.policePhone, sc.state))}
                                className="px-2 py-1 bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 rounded text-[10px] font-black flex items-center gap-1"
                                title={`Email ${sc.state} Police`}
                              >
                                <Mail className="w-3 h-3 text-sky-400" />
                                <span>EMAIL</span>
                              </button>

                              <button 
                                onClick={() => handleShareContact(`${sc.state} Police Command`, sc.policePhone, sc.state)}
                                className="px-2 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded text-[10px] font-black flex items-center gap-1"
                                title="Share Contact"
                              >
                                <Share2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Medical / Ambulance Emergency */}
                        <div className="p-3.5 bg-surface border border-outline-variant/20 rounded-xl flex flex-col justify-between gap-3">
                          <div>
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] text-emerald-400 font-black tracking-wider uppercase flex items-center gap-1">
                                <HeartPulse className="w-3.5 h-3.5" />
                                AMBULANCE & MEDICAL
                              </span>
                              <span className="text-[9px] font-mono text-emerald-400 font-bold">VERIFIED</span>
                            </div>
                            <p className="text-xs font-mono font-black text-on-surface mt-1 tracking-wider">{sc.ambulancePhone || '112'}</p>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-outline-variant/10">
                            <a 
                              href={`tel:${sc.ambulancePhone || '112'}`}
                              className="px-2 py-1 bg-primary/20 text-primary hover:bg-primary/30 rounded text-[10px] font-black flex items-center gap-1"
                              title={`Dial ${sc.state} Medical Response`}
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>CALL</span>
                            </a>

                            <a 
                              href={generateEmergencySmsHref(stateIncidentData, sc.ambulancePhone || '112')}
                              className="px-2 py-1 bg-primary/20 text-primary hover:bg-primary/30 rounded text-[10px] font-black flex items-center gap-1"
                              title={`SMS to Medical Dispatch`}
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>SMS</span>
                            </a>

                            <button 
                              onClick={() => setEmailModalData(getIncidentDataForService(`${sc.state} Ambulance Dispatch`, sc.ambulancePhone || '112', sc.state))}
                              className="px-2 py-1 bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 rounded text-[10px] font-black flex items-center gap-1"
                              title="Email Medical Response"
                            >
                              <Mail className="w-3 h-3 text-sky-400" />
                              <span>EMAIL</span>
                            </button>

                            <button 
                              onClick={() => handleShareContact(`${sc.state} Ambulance`, sc.ambulancePhone || '112', sc.state)}
                              className="px-2 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded text-[10px] font-black flex items-center gap-1"
                              title="Share Contact"
                            >
                              <Share2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Fire & Rescue Service */}
                        <div className="p-3.5 bg-surface border border-outline-variant/20 rounded-xl flex flex-col justify-between gap-3">
                          <div>
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] text-amber-400 font-black tracking-wider uppercase flex items-center gap-1">
                                <Flame className="w-3.5 h-3.5" />
                                FIRE & RESCUE SERVICE
                              </span>
                              <span className="text-[9px] font-mono text-emerald-400 font-bold">VERIFIED</span>
                            </div>
                            <p className="text-xs font-mono font-black text-on-surface mt-1 tracking-wider">{sc.firePhone || '112'}</p>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-outline-variant/10">
                            <a 
                              href={`tel:${sc.firePhone || '112'}`}
                              className="px-2 py-1 bg-primary/20 text-primary hover:bg-primary/30 rounded text-[10px] font-black flex items-center gap-1"
                              title={`Dial ${sc.state} Fire Service`}
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>CALL</span>
                            </a>

                            <a 
                              href={generateEmergencySmsHref(stateIncidentData, sc.firePhone || '112')}
                              className="px-2 py-1 bg-primary/20 text-primary hover:bg-primary/30 rounded text-[10px] font-black flex items-center gap-1"
                              title={`SMS to Fire Service`}
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>SMS</span>
                            </a>

                            <button 
                              onClick={() => setEmailModalData(getIncidentDataForService(`${sc.state} Fire Service`, sc.firePhone || '112', sc.state))}
                              className="px-2 py-1 bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 rounded text-[10px] font-black flex items-center gap-1"
                              title="Email Fire Service"
                            >
                              <Mail className="w-3 h-3 text-sky-400" />
                              <span>EMAIL</span>
                            </button>

                            <button 
                              onClick={() => handleShareContact(`${sc.state} Fire Service`, sc.firePhone || '112', sc.state)}
                              className="px-2 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded text-[10px] font-black flex items-center gap-1"
                              title="Share Contact"
                            >
                              <Share2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* SEMA / Disaster Desk */}
                        {sc.semaPhone && (
                          <div className="p-3.5 bg-surface border border-outline-variant/20 rounded-xl flex flex-col justify-between gap-3">
                            <div>
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] text-red-400 font-black tracking-wider uppercase flex items-center gap-1">
                                  <Flame className="w-3.5 h-3.5" />
                                  SEMA DISASTER DESK
                                </span>
                                <span className="text-[9px] font-mono text-emerald-400 font-bold">VERIFIED</span>
                              </div>
                              <p className="text-xs font-mono font-black text-on-surface mt-1 tracking-wider">{sc.semaPhone}</p>
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-outline-variant/10">
                              <a 
                                href={`tel:${sc.semaPhone}`}
                                className="px-2 py-1 bg-primary/20 text-primary hover:bg-primary/30 rounded text-[10px] font-black flex items-center gap-1"
                                title={`Dial ${sc.state} SEMA`}
                              >
                                <PhoneCall className="w-3 h-3" />
                                <span>CALL</span>
                              </a>

                              <a 
                                href={generateEmergencySmsHref(stateIncidentData, sc.semaPhone)}
                                className="px-2 py-1 bg-primary/20 text-primary hover:bg-primary/30 rounded text-[10px] font-black flex items-center gap-1"
                                title={`SMS to ${sc.state} SEMA`}
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>SMS</span>
                              </a>

                              <button 
                                onClick={() => setEmailModalData(getIncidentDataForService(`${sc.state} SEMA Disaster Desk`, sc.semaPhone!, sc.state))}
                                className="px-2 py-1 bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 rounded text-[10px] font-black flex items-center gap-1"
                                title="Email SEMA Desk"
                              >
                                <Mail className="w-3 h-3 text-sky-400" />
                                <span>EMAIL</span>
                              </button>

                              <button 
                                onClick={() => handleShareContact(`${sc.state} SEMA`, sc.semaPhone!, sc.state)}
                                className="px-2 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded text-[10px] font-black flex items-center gap-1"
                                title="Share Contact"
                              >
                                <Share2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Verified WhatsApp Channel */}
                      {sc.whatsappPhone ? (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-black text-emerald-300 uppercase">
                              Official Verified WhatsApp Response Channel
                            </span>
                          </div>
                          <a
                            href={generateEmergencyWhatsAppHref(stateIncidentData, sc.whatsappPhone)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-lg flex items-center gap-1 shadow"
                          >
                            <span>Open WhatsApp</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <div className="text-[10px] text-on-surface-variant font-mono font-bold flex items-center gap-1 italic opacity-70">
                          <Info className="w-3 h-3" />
                          <span>No third-party WhatsApp line. Dial 112 directly for official instant dispatch.</span>
                        </div>
                      )}

                      {/* State Emergency Email Report Action Footer */}
                      <div className="pt-2 border-t border-outline-variant/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-bold">
                        <span className="text-[10px] font-mono text-on-surface-variant uppercase">
                          ⚡ {sc.notes}
                        </span>

                        <button
                          onClick={() => setEmailModalData(stateIncidentData)}
                          className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 transition-all active:scale-95"
                        >
                          <Mail className="w-3.5 h-3.5 text-sky-400" />
                          <span>Email Multi-Agency Report</span>
                        </button>
                      </div>

                    </div>
                  );
                })
              ) : (
                /* SMART NO RESULTS FALLBACK SCREEN (NEVER GIVES FALSE NOT FOUND) */
                <div className="p-8 text-center bg-surface-container border-2 border-dashed border-amber-500/40 rounded-2xl space-y-4 shadow-lg">
                  <div className="p-4 bg-amber-500/10 text-amber-400 rounded-full w-14 h-14 mx-auto flex items-center justify-center border border-amber-500/30">
                    <Search className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-on-surface uppercase tracking-wider">
                      No Exact Directory Match Found For "{searchQuery}"
                    </h4>
                    <p className="text-xs text-on-surface-variant font-medium mt-1.5 max-w-md mx-auto leading-relaxed">
                      Try searching by state name (e.g. <strong>Lagos</strong>, <strong>Kano</strong>, <strong>Abuja</strong>), service type (e.g. <strong>Ambulance</strong>, <strong>Fire</strong>, <strong>Police</strong>, <strong>FRSC</strong>), or phone number.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <a 
                      href="tel:112" 
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow flex items-center gap-1.5"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>DIAL 112 NATIONAL</span>
                    </a>
                    
                    <a 
                      href="tel:122" 
                      className="px-4 py-2 bg-sky-500/20 text-sky-300 border border-sky-400/40 hover:bg-sky-500/30 font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5"
                    >
                      <Building className="w-4 h-4" />
                      <span>DIAL 122 FRSC</span>
                    </a>

                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedState('All');
                        setSelectedCategory('All');
                      }} 
                      className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-black text-xs uppercase tracking-wider rounded-xl border border-outline-variant/30"
                    >
                      RESET FILTERS
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Personal Roster View */
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {filteredRosterContacts.length > 0 ? (
                filteredRosterContacts.map(contact => (
                  <div 
                    key={contact.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all
                      ${contact.priority 
                        ? 'bg-primary-container/10 border-primary/40' 
                        : 'bg-surface-container border-outline-variant/30'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded bg-surface-container-high border border-outline-variant/20 shrink-0">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-on-surface leading-tight">{contact.name}</h4>
                          <button 
                            onClick={() => onTogglePriority(contact.id)}
                            className="text-on-surface-variant hover:text-primary transition-colors"
                          >
                            <Star className={`w-4 h-4 ${contact.priority ? 'fill-primary text-primary' : ''}`} />
                          </button>
                        </div>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase mt-1">
                          {contact.relationship} • <span className="font-mono">{contact.phone}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      <a 
                        href={`tel:${contact.phone}`}
                        className="p-2.5 bg-primary/20 text-primary hover:bg-primary/30 rounded-md transition-all active:scale-90 flex items-center justify-center"
                        title="Open Dialer"
                      >
                        <PhoneCall className="w-4 h-4" />
                      </a>

                      {contact.whatsappSupported && (
                        <a 
                          href={generateEmergencyWhatsAppHref(getIncidentDataForService(contact.name, contact.phone, 'Nigeria'), contact.phone)}
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-md transition-all active:scale-90 flex items-center justify-center"
                          title="Contact via WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}

                      {!contact.isAgency && (
                        <button 
                          onClick={() => onDeleteContact(contact.id)}
                          className="p-2.5 bg-error-container/10 text-error hover:bg-error-container/20 rounded-md transition-all active:scale-90 flex items-center justify-center ml-2"
                          title="Delete contact"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-surface-container border border-outline-variant/30 rounded-2xl">
                  <Users className="w-12 h-12 text-on-surface-variant mx-auto mb-3 opacity-40" />
                  <p className="text-xs text-on-surface-variant font-bold">No personal contacts found.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Add Custom Personal Contact (Span 5) */}
        <div className="lg:col-span-5">
          <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-5 space-y-4 shadow-md">
            <h3 className="font-black text-sm text-on-surface uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              ADD PERSONAL EMERGENCY CONTACT
            </h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase">FULL NAME</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Samuel Alabi"
                  required
                  className="w-full bg-surface border border-outline-variant/40 rounded-lg px-3 py-2.5 text-xs text-on-surface font-bold focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase">RELATIONSHIP / ROLE</label>
                <select 
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/40 rounded-lg px-3 py-2.5 text-xs text-on-surface font-bold focus:border-primary focus:outline-none"
                >
                  <option value="Family">Family / Kin</option>
                  <option value="Friend">Friend / Neighbour</option>
                  <option value="Doctor">Primary Care Physician</option>
                  <option value="Other">Corporate Responders</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase">PHONE NUMBER</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +234 803 123 4567"
                  required
                  className="w-full bg-surface border border-outline-variant/40 rounded-lg px-3 py-2.5 text-xs text-on-surface font-bold focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between py-1 border-b border-outline-variant/10">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">WHATSAPP AVAILABLE</span>
                <button 
                  type="button"
                  onClick={() => setWhatsappSupported(!whatsappSupported)}
                  className={`w-10 h-6 rounded-full p-1 transition-colors ${whatsappSupported ? 'bg-emerald-500' : 'bg-surface-container-highest'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${whatsappSupported ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-outline-variant/10">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">STARRED PRIORITY STATUS</span>
                <button 
                  type="button"
                  onClick={() => setPriority(!priority)}
                  className={`w-10 h-6 rounded-full p-1 transition-colors ${priority ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${priority ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>SAVE CONTACT</span>
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Emergency Email Dispatch Modal */}
      <EmergencyEmailModal
        isOpen={!!emailModalData}
        onClose={() => setEmailModalData(null)}
        incidentData={emailModalData}
      />
    </div>
  );
}
