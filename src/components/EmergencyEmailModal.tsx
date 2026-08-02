import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Send, 
  FileText, 
  CheckCircle2, 
  ShieldAlert,
  Ambulance,
  Flame,
  Car,
  LifeBuoy,
  Radio,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  EmergencyIncidentData, 
  DISPATCH_AGENCIES,
  DispatchAgency,
  generateEmergencyEmailSubject, 
  generateEmergencyEmailBody, 
  generateEmergencyEmailHref, 
  generateGmailHref, 
  generateOutlookHref, 
  generateYahooHref 
} from '../utils/emergencyReport';

interface EmergencyEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentData: EmergencyIncidentData | null;
  defaultRecipient?: string;
}

export default function EmergencyEmailModal({
  isOpen,
  onClose,
  incidentData,
  defaultRecipient = ''
}: EmergencyEmailModalProps) {
  // Determine initial selected agency based on emergency type
  const getInitialAgencies = (): string[] => {
    if (!incidentData) return ['unified'];
    const type = incidentData.emergencyType.toLowerCase();
    if (type.includes('police') || type.includes('crime') || type.includes('security') || type.includes('robbery') || type.includes('kidnap')) {
      return ['police'];
    }
    if (type.includes('medical') || type.includes('health') || type.includes('ambulance') || type.includes('cardiac') || type.includes('stroke')) {
      return ['ambulance'];
    }
    if (type.includes('fire') || type.includes('explosion') || type.includes('gas')) {
      return ['fire'];
    }
    if (type.includes('traffic') || type.includes('accident') || type.includes('road') || type.includes('highway') || type.includes('vehicle')) {
      return ['frsc'];
    }
    if (type.includes('flood') || type.includes('disaster') || type.includes('collapse') || type.includes('rescue')) {
      return ['sema'];
    }
    return ['unified'];
  };

  const [selectedAgencyIds, setSelectedAgencyIds] = useState<string[]>([]);
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [copiedType, setCopiedType] = useState<'subject' | 'body' | 'full' | null>(null);
  const [emailStatusMessage, setEmailStatusMessage] = useState<string | null>(null);

  // Sync selected agencies when modal opens or incidentData changes
  useEffect(() => {
    if (isOpen && incidentData) {
      const initial = getInitialAgencies();
      setSelectedAgencyIds(initial);
      const selectedAgencies = DISPATCH_AGENCIES.filter(a => initial.includes(a.id));
      const autoEmails = selectedAgencies.map(a => a.email).join(', ');
      setRecipient(defaultRecipient || autoEmails);
    }
  }, [isOpen, incidentData]);

  if (!isOpen || !incidentData) return null;

  const toggleAgency = (agencyId: string) => {
    let nextSelected: string[];
    if (agencyId === 'unified') {
      nextSelected = ['unified'];
    } else {
      const exists = selectedAgencyIds.includes(agencyId);
      if (exists) {
        nextSelected = selectedAgencyIds.filter(id => id !== agencyId && id !== 'unified');
        if (nextSelected.length === 0) nextSelected = ['unified'];
      } else {
        nextSelected = [...selectedAgencyIds.filter(id => id !== 'unified'), agencyId];
      }
    }
    setSelectedAgencyIds(nextSelected);

    // Auto-update recipient emails from selected agencies
    const selectedAgencies = DISPATCH_AGENCIES.filter(a => nextSelected.includes(a.id));
    const autoEmails = selectedAgencies.map(a => a.email).join(', ');
    setRecipient(autoEmails);
  };

  const selectedAgencies = DISPATCH_AGENCIES.filter(a => selectedAgencyIds.includes(a.id));
  const selectedAgencyNames = selectedAgencies.map(a => a.name);

  const subject = generateEmergencyEmailSubject(incidentData, selectedAgencyNames);
  const bodyText = generateEmergencyEmailBody(incidentData, selectedAgencyNames);

  const handleCopy = (text: string, type: 'subject' | 'body' | 'full') => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setEmailStatusMessage(`Copied ${type.toUpperCase()} to clipboard! You can paste it in any email app.`);
      setTimeout(() => {
        setCopiedType(null);
        setEmailStatusMessage(null);
      }, 3500);
    } catch (err) {
      console.error('Clipboard copy error:', err);
    }
  };

  const handleNativeMailto = () => {
    const href = generateEmergencyEmailHref(incidentData, recipient, selectedAgencyNames);
    try {
      window.location.href = href;
      setEmailStatusMessage('Launching your device email application...');
    } catch (err) {
      window.open(href, '_blank');
    }
  };

  const handleOpenGmail = () => {
    const href = generateGmailHref(incidentData, recipient, selectedAgencyNames);
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const handleOpenOutlook = () => {
    const href = generateOutlookHref(incidentData, recipient, selectedAgencyNames);
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const handleOpenYahoo = () => {
    const href = generateYahooHref(incidentData, recipient, selectedAgencyNames);
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const getAgencyIcon = (category: string) => {
    switch (category) {
      case 'police': return <ShieldAlert className="w-5 h-5 text-blue-400" />;
      case 'medical': return <Ambulance className="w-5 h-5 text-emerald-400" />;
      case 'fire': return <Flame className="w-5 h-5 text-red-400" />;
      case 'road': return <Car className="w-5 h-5 text-amber-400" />;
      case 'disaster': return <LifeBuoy className="w-5 h-5 text-purple-400" />;
      case 'unified': return <Radio className="w-5 h-5 text-sky-400" />;
      default: return <Building2 className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-surface-container border-2 border-sky-500/50 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-5 my-8 relative max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b border-outline-variant/30 pb-4 sticky top-0 bg-surface-container z-10 pt-1">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-sky-500/20 text-sky-400 rounded-xl shrink-0 border border-sky-500/30">
                <Mail className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-black text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 uppercase">
                  EMERGENCY DISPATCH REPORT COMPOSER
                </span>
                <h3 className="text-lg font-black text-on-surface uppercase tracking-wider mt-1">
                  EMAIL EMERGENCY DISPATCH SELECTION
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alert Status Feedback */}
          {emailStatusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{emailStatusMessage}</span>
            </motion.div>
          )}

          {/* DISPATCH SERVICE CHOICES */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono font-black text-sky-400 uppercase tracking-wider block">
                CHOOSE DISPATCH SERVICES TO REQUEST VIA EMAIL
              </label>
              <span className="text-[10px] font-mono font-bold text-on-surface-variant">
                {selectedAgencyIds.length} Service{selectedAgencyIds.length !== 1 ? 's' : ''} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DISPATCH_AGENCIES.map((agency: DispatchAgency) => {
                const isSelected = selectedAgencyIds.includes(agency.id);
                return (
                  <button
                    key={agency.id}
                    type="button"
                    onClick={() => toggleAgency(agency.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-400/80 shadow-md ring-1 ring-sky-400/40'
                        : 'bg-surface border-outline-variant/30 hover:border-outline-variant/60 hover:bg-surface-container-high'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-surface-container border border-outline-variant/30">
                          {getAgencyIcon(agency.category)}
                        </div>
                        <div>
                          <span className="text-[9px] font-mono font-black text-sky-400 uppercase block tracking-wider">
                            {agency.code}
                          </span>
                          <h4 className="text-xs font-black text-on-surface leading-snug">
                            {agency.name}
                          </h4>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-all ${
                        isSelected 
                          ? 'bg-sky-500 border-sky-400 text-slate-950 font-bold' 
                          : 'border-outline-variant/50 bg-surface-container'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <p className="text-[10px] text-on-surface-variant leading-tight line-clamp-2 mt-1">
                      {agency.description}
                    </p>

                    {agency.emailPurpose && (
                      <div className="mt-1 text-[9px] font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {agency.emailPurpose}
                      </div>
                    )}

                    <div className="mt-2 pt-1.5 border-t border-outline-variant/20 flex flex-col gap-1 text-[9px] font-mono text-on-surface-variant">
                      <div className="flex items-center justify-between">
                        <span>Email: <strong className="text-sky-300">{agency.email}</strong></span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${agency.isConfirmedDispatchChannel ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                          {agency.isConfirmedDispatchChannel ? 'Confirmed Dispatch Desk' : 'PR / Public Desk'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recipient Email Address Box */}
          <div className="space-y-1.5 border-t border-outline-variant/20 pt-3">
            <label className="text-[10px] font-mono font-black text-on-surface-variant uppercase tracking-wider block">
              RECIPIENT EMAIL ADDRESS(ES)
            </label>
            <div className="relative">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Selected dispatch emails will populate automatically..."
                className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-3 text-xs text-on-surface font-bold focus:border-sky-400 focus:outline-none"
              />
            </div>
            
            {/* Preset Email Quick Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[9px] font-mono text-on-surface-variant self-center mr-1">Quick Presets:</span>
              {DISPATCH_AGENCIES.map(a => (
                <button
                  key={`chip-${a.id}`}
                  type="button"
                  onClick={() => {
                    if (!selectedAgencyIds.includes(a.id)) {
                      toggleAgency(a.id);
                    } else {
                      setRecipient(a.email);
                    }
                  }}
                  className="px-2 py-0.5 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 rounded text-[9px] font-mono text-sky-300 transition-colors"
                >
                  +{a.name.split(' ')[0]}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setRecipient('')}
                className="px-2 py-0.5 bg-surface-container-high hover:bg-red-500/20 border border-outline-variant/30 rounded text-[9px] font-mono text-on-surface-variant transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Direct Multi-Channel Email Launch Buttons */}
          <div className="space-y-2 border-t border-outline-variant/20 pt-3">
            <label className="text-[10px] font-mono font-black text-on-surface-variant uppercase tracking-wider block">
              SELECT PREFERRED EMAIL APPLICATION LAUNCH
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Native Mail app */}
              <button
                onClick={handleNativeMailto}
                className="p-3.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 rounded-xl text-xs font-black uppercase text-sky-200 flex items-center justify-between transition-all active:scale-98 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4.5 h-4.5 text-sky-400" />
                  <div className="text-left">
                    <span className="block leading-tight">DEFAULT MAIL APP</span>
                    <span className="text-[9px] font-mono font-normal opacity-80">Apple Mail / Outlook / Phone Mail</span>
                  </div>
                </div>
                <Send className="w-4 h-4 text-sky-400" />
              </button>

              {/* Option 2: Gmail Web */}
              <button
                onClick={handleOpenGmail}
                className="p-3.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 rounded-xl text-xs font-black uppercase text-red-300 flex items-center justify-between transition-all active:scale-98 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-4.5 h-4.5 text-red-400" />
                  <div className="text-left">
                    <span className="block leading-tight">GMAIL WEBMAIL</span>
                    <span className="text-[9px] font-mono font-normal opacity-80">Opens mail.google.com prefilled</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-red-400" />
              </button>

              {/* Option 3: Outlook Web */}
              <button
                onClick={handleOpenOutlook}
                className="p-3.5 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 rounded-xl text-xs font-black uppercase text-blue-300 flex items-center justify-between transition-all active:scale-98 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-4.5 h-4.5 text-blue-400" />
                  <div className="text-left">
                    <span className="block leading-tight">OUTLOOK WEBMAIL</span>
                    <span className="text-[9px] font-mono font-normal opacity-80">Opens outlook.live.com prefilled</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-blue-400" />
              </button>

              {/* Option 4: Yahoo Webmail */}
              <button
                onClick={handleOpenYahoo}
                className="p-3.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 rounded-xl text-xs font-black uppercase text-purple-300 flex items-center justify-between transition-all active:scale-98 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-4.5 h-4.5 text-purple-400" />
                  <div className="text-left">
                    <span className="block leading-tight">YAHOO WEBMAIL</span>
                    <span className="text-[9px] font-mono font-normal opacity-80">Opens mail.yahoo.com prefilled</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-purple-400" />
              </button>
            </div>
          </div>

          {/* Clipboard Copy Actions */}
          <div className="space-y-2 border-t border-outline-variant/20 pt-3">
            <label className="text-[10px] font-mono font-black text-on-surface-variant uppercase tracking-wider block">
              MANUAL COPY OPTIONS
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCopy(bodyText, 'full')}
                className="p-3 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 rounded-xl text-xs font-black uppercase text-on-surface flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {copiedType === 'full' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-primary" />}
                <span>{copiedType === 'full' ? 'FULL REPORT COPIED!' : 'COPY REPORT TEXT'}</span>
              </button>

              <button
                onClick={() => handleCopy(subject, 'subject')}
                className="p-3 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 rounded-xl text-xs font-black uppercase text-on-surface flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {copiedType === 'subject' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-primary" />}
                <span>{copiedType === 'subject' ? 'SUBJECT COPIED!' : 'COPY EMAIL SUBJECT'}</span>
              </button>
            </div>
          </div>

          {/* Formatted Report Preview Box */}
          <div className="space-y-1.5 border-t border-outline-variant/20 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-black text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                DYNAMIC EMAIL REPORT PREVIEW
              </span>
              <span className="text-[10px] font-mono text-sky-400 font-bold">
                REF: {incidentData.incidentRef}
              </span>
            </div>

            <div className="bg-surface p-3.5 rounded-xl border border-outline-variant/30 font-mono text-[11px] text-on-surface-variant max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
              <div className="text-on-surface font-bold mb-2 pb-1 border-b border-outline-variant/20">
                SUBJECT: {subject}
              </div>
              {bodyText}
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-surface border border-outline-variant/40 hover:bg-surface-container-high text-on-surface font-black text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            CLOSE EMAIL DISPATCH WINDOW
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

