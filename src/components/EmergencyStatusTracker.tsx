import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  PhoneCall, 
  ShieldCheck, 
  Ambulance, 
  UserCheck, 
  Flag, 
  XCircle, 
  QrCode, 
  Mail, 
  MessageCircle, 
  MapPin, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { EmergencyIncidentData, generateEmergencyEmailHref, generateEmergencyWhatsAppHref } from '../utils/emergencyReport';
import EmergencyBarcodeModal from './EmergencyBarcodeModal';
import EmergencyEmailModal from './EmergencyEmailModal';

interface EmergencyStatusTrackerProps {
  incidentData: EmergencyIncidentData;
  onCancelEmergency: () => void;
  onNavigateHome: () => void;
}

export type StatusStage = 
  | 'CREATED'
  | 'SENT'
  | 'ACKNOWLEDGED'
  | 'DISPATCHED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CANCELLED';

export default function EmergencyStatusTracker({
  incidentData,
  onCancelEmergency,
  onNavigateHome
}: EmergencyStatusTrackerProps) {
  const [currentStage, setCurrentStage] = useState<StatusStage>('SENT');
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [stageTimestamps, setStageTimestamps] = useState<Record<string, string>>({
    CREATED: new Date(Date.now() - 30000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    SENT: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  });

  // Simulated state progression if not cancelled
  useEffect(() => {
    if (currentStage === 'CANCELLED' || currentStage === 'RESOLVED') return;

    const timer1 = setTimeout(() => {
      setCurrentStage('ACKNOWLEDGED');
      setStageTimestamps(prev => ({
        ...prev,
        ACKNOWLEDGED: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }));
    }, 4000);

    const timer2 = setTimeout(() => {
      setCurrentStage('DISPATCHED');
      setStageTimestamps(prev => ({
        ...prev,
        DISPATCHED: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }));
    }, 9000);

    const timer3 = setTimeout(() => {
      setCurrentStage('IN_PROGRESS');
      setStageTimestamps(prev => ({
        ...prev,
        IN_PROGRESS: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }));
    }, 16000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [currentStage]);

  const stages: { key: StatusStage; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
    { key: 'CREATED', label: 'Alert Created', icon: Clock, description: 'Incident log generated locally' },
    { key: 'SENT', label: 'Alert Sent', icon: Send, description: 'Broadcasted to 112 Command Network' },
    { key: 'ACKNOWLEDGED', label: 'Response Acknowledged', icon: ShieldCheck, description: 'National Dispatcher accepted incident' },
    { key: 'DISPATCHED', label: 'Help Dispatched', icon: Ambulance, description: 'Emergency unit en route to GPS coordinates' },
    { key: 'IN_PROGRESS', label: 'Assistance in Progress', icon: UserCheck, description: 'Responders active on location' },
    { key: 'RESOLVED', label: 'Resolved', icon: Flag, description: 'Emergency situation stabilized' }
  ];

  const getStageIndex = (stage: StatusStage) => {
    if (stage === 'CANCELLED') return -1;
    return stages.findIndex(s => s.key === stage);
  };

  const currentIdx = getStageIndex(currentStage);

  const emailHref = generateEmergencyEmailHref(incidentData);
  const whatsappHref = generateEmergencyWhatsAppHref(incidentData);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-surface-container border border-primary/40 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl shrink-0 ${currentStage === 'CANCELLED' ? 'bg-error-container text-error' : 'bg-primary/20 text-primary'}`}>
              {currentStage === 'CANCELLED' ? <XCircle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6 animate-pulse" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/30 uppercase">
                  INCIDENT TRACKER
                </span>
                <span className="text-[10px] font-mono text-on-surface-variant font-bold">
                  NATIONAL ROUTE: 112
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-on-surface uppercase tracking-wider mt-1">
                REF: {incidentData.incidentRef}
              </h2>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsBarcodeModalOpen(true)}
              className="flex-1 sm:flex-initial px-3 py-2 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 rounded-xl text-xs font-black uppercase text-on-surface flex items-center justify-center gap-1.5 transition-all"
            >
              <QrCode className="w-4 h-4 text-primary" />
              <span>QR Barcode</span>
            </button>

            {currentStage !== 'CANCELLED' && currentStage !== 'RESOLVED' && (
              <button
                onClick={onCancelEmergency}
                className="flex-1 sm:flex-initial px-4 py-2 bg-error/20 hover:bg-error/30 text-error border border-error/40 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Alert</span>
              </button>
            )}

            {(currentStage === 'CANCELLED' || currentStage === 'RESOLVED') && (
              <button
                onClick={onNavigateHome}
                className="flex-1 sm:flex-initial px-4 py-2 bg-primary text-black font-black text-xs uppercase tracking-wider rounded-xl shadow"
              >
                Return Home
              </button>
            )}
          </div>
        </div>

        {/* Incident Summary Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-surface p-4 rounded-xl border border-outline-variant/20 text-xs font-bold">
          <div>
            <span className="text-[9px] text-on-surface-variant uppercase font-mono block">Emergency Category</span>
            <span className="text-on-surface font-black uppercase text-sm">{incidentData.emergencyType}</span>
          </div>
          <div>
            <span className="text-[9px] text-on-surface-variant uppercase font-mono block">Selected Service</span>
            <span className="text-on-surface font-black uppercase">{incidentData.emergencyService} ({incidentData.servicePhone})</span>
          </div>
          <div>
            <span className="text-[9px] text-on-surface-variant uppercase font-mono block">State & Location</span>
            <span className="text-on-surface font-black uppercase truncate block">{incidentData.state} - {incidentData.locationAddress}</span>
          </div>
        </div>
      </div>

      {/* Lifecycle Stepper */}
      <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-5 sm:p-6 space-y-6 shadow-md">
        <h3 className="text-xs font-black text-on-surface uppercase tracking-wider flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 text-primary ${currentStage !== 'CANCELLED' && currentStage !== 'RESOLVED' ? 'animate-spin' : ''}`} />
          REAL-TIME DISPATCH WORKFLOW STATUS
        </h3>

        {currentStage === 'CANCELLED' ? (
          <div className="p-6 bg-error-container/20 border border-error/30 rounded-xl text-center space-y-2">
            <XCircle className="w-12 h-12 text-error mx-auto" />
            <h4 className="text-sm font-black text-error uppercase tracking-wider">INCIDENT CANCELLED BY USER</h4>
            <p className="text-xs text-on-surface-variant font-bold">
              All active sirens, timers, and emergency loops have been stopped completely.
            </p>
          </div>
        ) : (
          <div className="relative space-y-4">
            {stages.map((stage, idx) => {
              const isCompleted = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const isPending = idx > currentIdx;

              const IconComponent = stage.icon;

              return (
                <div key={stage.key} className="flex items-start gap-4 relative">
                  {/* Connecting Line */}
                  {idx < stages.length - 1 && (
                    <div 
                      className={`absolute left-5 top-10 w-0.5 h-10 -ml-px transition-colors duration-500 ${
                        idx < currentIdx ? 'bg-emerald-500' : 'bg-outline-variant/30'
                      }`} 
                    />
                  )}

                  {/* Icon Badge */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 font-bold z-10 ${
                    isCompleted 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                      : isCurrent 
                        ? 'bg-primary text-black ring-4 ring-primary/20 shadow-lg scale-110' 
                        : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/30'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <IconComponent className="w-5 h-5" />}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 pt-1">
                    <div className="flex justify-between items-center">
                      <h4 className={`text-xs font-black uppercase tracking-wider ${
                        isCurrent ? 'text-primary font-extrabold text-sm' : isCompleted ? 'text-on-surface' : 'text-on-surface-variant'
                      }`}>
                        {stage.label}
                      </h4>
                      {stageTimestamps[stage.key] && (
                        <span className="text-[10px] font-mono text-on-surface-variant font-bold bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant/20">
                          {stageTimestamps[stage.key]}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-on-surface-variant font-bold mt-0.5">
                      {stage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* External Action Channels */}
      <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-5 space-y-3">
        <h4 className="text-xs font-black text-on-surface uppercase tracking-wider">
          ADDITIONAL REPORT TRANSMISSION CHANNELS
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href={`tel:${incidentData.servicePhone}`}
            className="p-3 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call {incidentData.servicePhone}</span>
          </a>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Share</span>
          </a>

          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="p-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Mail className="w-4 h-4 text-sky-400" />
            <span>Email Report</span>
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
