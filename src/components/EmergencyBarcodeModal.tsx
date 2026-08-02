import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  X, 
  Copy, 
  Check, 
  Share2, 
  Mail, 
  Download, 
  Maximize2, 
  Minimize2, 
  ShieldCheck, 
  Scan, 
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  EmergencyIncidentData, 
  generateEmergencyEmailHref, 
  generateEmergencyWhatsAppHref 
} from '../utils/emergencyReport';
import EmergencyEmailModal from './EmergencyEmailModal';

interface EmergencyBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentData: EmergencyIncidentData;
}

export default function EmergencyBarcodeModal({
  isOpen,
  onClose,
  incidentData
}: EmergencyBarcodeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedRef, setCopiedRef] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'scanner'>('qr');
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Generate clean QR code string using temporary incident reference ID
      const qrPayload = JSON.stringify({
        ref: incidentData.incidentRef,
        type: incidentData.emergencyType,
        time: incidentData.timestamp,
        state: incidentData.state,
        lat: incidentData.latitude,
        lng: incidentData.longitude,
        system: "ALERTNOW-2026-NIGERIA-112"
      });

      QRCode.toDataURL(qrPayload, {
        width: 320,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(url => {
        setQrDataUrl(url);
      }).catch(err => {
        console.error("Failed to generate QR code:", err);
      });
    }
  }, [isOpen, incidentData]);

  if (!isOpen) return null;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(incidentData.incidentRef);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `ALERTNOW_Emergency_QR_${incidentData.incidentRef}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const emailHref = generateEmergencyEmailHref(incidentData);
  const whatsappHref = generateEmergencyWhatsAppHref(incidentData);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-surface-container border border-primary/40 rounded-2xl p-6 space-y-5 shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-on-surface uppercase tracking-wider">
                  EMERGENCY INCIDENT BARCODE / QR
                </h3>
                <p className="text-[10px] text-on-surface-variant font-mono font-bold">
                  REF: <span className="text-primary font-black">{incidentData.incidentRef}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex bg-surface border border-outline-variant/30 rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'qr'
                  ? 'bg-primary text-black shadow'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Display / Share QR</span>
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'scanner'
                  ? 'bg-primary text-black shadow'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>Responder Verification</span>
            </button>
          </div>

          {activeTab === 'qr' ? (
            <div className="space-y-4">
              {/* QR Code Container */}
              <div className="bg-white p-4 rounded-xl border-2 border-primary/40 flex flex-col items-center justify-center shadow-inner relative group">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Emergency QR Code"
                    className={`transition-all duration-300 ${isEnlarged ? 'w-72 h-72' : 'w-48 h-48'}`}
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-zinc-400 text-xs font-mono">
                    Generating QR Code...
                  </div>
                )}

                {/* Simulated Barcode strip underneath */}
                <div className="w-full mt-3 pt-2 border-t border-zinc-200 flex flex-col items-center">
                  <div className="h-8 w-4/5 bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_4px,#000_4px,#000_7px)] rounded-sm" />
                  <span className="text-[10px] font-mono font-black text-zinc-800 mt-1 tracking-widest uppercase">
                    *{incidentData.incidentRef}*
                  </span>
                </div>

                {/* Enlarge toggle button */}
                <button
                  onClick={() => setIsEnlarged(!isEnlarged)}
                  className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black text-white rounded-lg transition-colors text-xs font-bold flex items-center gap-1 shadow"
                  title="Toggle Enlarge"
                >
                  {isEnlarged ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Safety notice */}
              <div className="bg-surface p-3 rounded-lg border border-outline-variant/30 text-[11px] text-on-surface-variant font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Secure temporary QR contains emergency incident token. Private medical files are protected.
                </span>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={handleCopyRef}
                  className="p-2.5 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 rounded-xl text-xs font-black uppercase text-on-surface flex items-center justify-center gap-1.5 transition-all"
                >
                  {copiedRef ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-primary" />}
                  <span>{copiedRef ? 'Copied!' : 'Copy Ref'}</span>
                </button>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-xl text-xs font-black uppercase text-emerald-300 flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => setIsEmailModalOpen(true)}
                  className="p-2.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 rounded-xl text-xs font-black uppercase text-sky-300 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <Mail className="w-4 h-4 text-sky-400" />
                  <span>Email</span>
                </button>

                <button
                  onClick={handleDownloadQr}
                  className="p-2.5 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-xl text-xs font-black uppercase text-primary flex items-center justify-center gap-1.5 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Save QR</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/30 text-center space-y-3">
                <Scan className="w-10 h-10 text-primary mx-auto animate-pulse" />
                <h4 className="text-xs font-black text-on-surface uppercase tracking-wider">
                  AUTHORIZED RESPONDER SCANNER
                </h4>
                <p className="text-xs text-on-surface-variant font-semibold">
                  Authorized medical personnel or 112 dispatchers can scan this QR code to instantly verify patient location & incident ID.
                </p>

                <button
                  onClick={() => setScannedResult(`VERIFIED INCIDENT [${incidentData.incidentRef}] - Location: ${incidentData.state} (${incidentData.locationAddress})`)}
                  className="px-4 py-2 bg-primary text-black font-black text-xs uppercase tracking-wider rounded-lg shadow"
                >
                  Simulate Authorized Scan
                </button>

                {scannedResult && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-left text-xs text-emerald-300 font-mono font-bold">
                    <p className="text-[10px] text-emerald-400 font-black uppercase mb-1">✓ VERIFICATION ACKNOWLEDGED</p>
                    <p>{scannedResult}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Emergency Email Dispatch Modal */}
          <EmergencyEmailModal
            isOpen={isEmailModalOpen}
            onClose={() => setIsEmailModalOpen(false)}
            incidentData={incidentData}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
