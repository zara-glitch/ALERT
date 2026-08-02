import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Shield, 
  BookOpen, 
  FileText, 
  Activity, 
  ArrowRight,
  Sparkles,
  Heart,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AlertNowLogo from './AlertNowLogo';

interface FAQItem {
  question: string;
  answer: string;
}

interface GuideItem {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export default function ContactUs() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [modalType, setModalType] = useState<'privacy' | 'disclaimer' | 'terms' | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What is the AlertNow Emergency Response Platform?",
      answer: "AlertNow is an offline-resilient sentinel platform designed to provide instant access to life-saving emergency services, clinical first-aid guides, localized police/SEMA hotlines in Nigeria, and digital medical identity profiles."
    },
    {
      question: "How does Offline SOS Persistence work?",
      answer: "Your medical profiles, emergency contacts, and local dispatch hotlines are securely cached directly on your device via HTML5 LocalStorage and IndexDB. You can trigger, view, and read all emergency protocols without any active internet connection."
    },
    {
      question: "Is my personal and medical data safe?",
      answer: "Absolutely. All information entered in your Medical Profile remains strictly on your device. If you use cloud backup, your data is protected under robust security rules to ensure only you and your designated responders can access it."
    },
    {
      question: "How can I update my emergency contacts list?",
      answer: "Navigate to the 'Emergency Contacts' tab in the left sidebar menu. From there, you can add custom phone numbers, designate primary relationships, and star priority contacts for quick one-click emergency calls."
    }
  ];

  const guides: GuideItem[] = [
    {
      title: "Emergency SOS Protocol",
      description: "Step-by-step instructions for activating cellular alerts, broadcasting real-time GPS telemetry, and alerting Nigerian security agencies.",
      icon: Shield
    },
    {
      title: "First Aid Response Guide",
      description: "Clinical guides for CPR, severe bleeding containment, burn mitigation, and dynamic stabilization under emergency pressures.",
      icon: BookOpen
    },
    {
      title: "Safety Plan Builder",
      description: "A secure template system to design local evacuation routes, identify emergency roles, and coordinate immediate household responses.",
      icon: FileText
    },
    {
      title: "Contact Dispatch Guide",
      description: "Complete list of state-by-state contact numbers including localized police command channels and state emergency management teams.",
      icon: Activity
    }
  ];

  const handleToggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header and Intro */}
      <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-outline-variant/30">
        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#D4AF37]/30 bg-[#0D0D0D] flex items-center justify-center shrink-0 shadow-lg shadow-primary/10">
          <AlertNowLogo className="w-full h-full" variant="icon" />
        </div>
        <div className="text-center md:text-left space-y-1.5">
          <span className="text-[10px] text-primary font-black uppercase tracking-widest bg-primary-container/10 px-2.5 py-1 rounded border border-primary/20">
            SECURE DIRECT CHANNELS
          </span>
          <h2 className="text-3xl font-black tracking-tight mt-1 text-on-surface">CONTACT US</h2>
          <p className="text-xs font-bold text-primary font-mono tracking-wide uppercase">
            "24/7 SUPPORT & SECURITY ASSISTANCE PORTAL"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: FAQ & Guides (Span 7) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Frequently Asked Questions */}
          <div className="space-y-4">
            <h3 className="font-black text-sm text-primary uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-surface-container border border-outline-variant/30 rounded-lg overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => handleToggleFaq(idx)}
                      className="w-full px-5 py-4 flex justify-between items-center text-left hover:bg-surface-container-high transition-colors"
                    >
                      <span className="text-xs font-black text-on-surface leading-snug">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-primary shrink-0 ml-3" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-on-surface-variant shrink-0 ml-3" />
                      )}
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-5 pb-4 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-3">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinical/Emergency Guides */}
          <div className="space-y-4">
            <h3 className="font-black text-sm text-primary uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              EMERGENCY SYSTEM GUIDES
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guides.map((guide, idx) => {
                const Icon = guide.icon;
                return (
                  <div 
                    key={idx}
                    className="p-4 bg-surface-container border border-outline-variant/30 rounded-lg hover:border-primary/50 transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="p-2 w-9 h-9 rounded bg-primary-container/10 text-primary flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <h4 className="text-xs font-black text-on-surface uppercase tracking-wide group-hover:text-primary transition-colors">
                        {guide.title}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed font-semibold">
                        {guide.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Direct Contact Details (Span 5) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Direct Contact Card (Visual Match with Reference Photo) */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-6 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="space-y-1">
              <span className="text-[10px] text-primary font-mono font-black uppercase tracking-widest block">
                SENTINEL SECURE LINK
              </span>
              <h3 className="font-black text-base text-on-surface uppercase tracking-wider">
                DIRECT CONTACT
              </h3>
            </div>

            {/* Support Phone Row */}
            <a 
              href="tel:09076151444"
              className="flex items-start gap-4 p-3.5 rounded bg-surface border border-outline-variant/20 hover:border-primary/50 hover:bg-surface-container-high transition-all group"
            >
              <div className="p-2.5 rounded bg-emerald-500/10 text-emerald-500 shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider block">
                  Phone Support
                </span>
                <span className="text-sm font-black text-on-surface font-mono tracking-wider block group-hover:text-primary transition-colors">
                  09076151444
                </span>
              </div>
            </a>

            {/* Email Inquiry Row */}
            <a 
              href="mailto:saraog71@gmail.com"
              className="flex items-start gap-4 p-3.5 rounded bg-surface border border-outline-variant/20 hover:border-primary/50 hover:bg-surface-container-high transition-all group"
            >
              <div className="p-2.5 rounded bg-primary-container/10 text-primary shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider block">
                  Email Inquiry
                </span>
                <span className="text-xs font-black text-on-surface font-mono tracking-tight block break-all group-hover:text-primary transition-colors">
                  saraog71@gmail.com
                </span>
              </div>
            </a>

            {/* Clinical/Company Location Row */}
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Ogun+State,+Nigeria"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-3.5 rounded bg-surface border border-outline-variant/20 hover:border-primary/50 hover:bg-surface-container-high transition-all group"
            >
              <div className="p-2.5 rounded bg-error/10 text-error shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider block">
                  Company Location
                </span>
                <span className="text-xs font-black text-on-surface tracking-wide block group-hover:text-primary transition-colors">
                  Ogun State, Nigeria
                </span>
              </div>
            </a>

            <div className="text-center pt-2">
              <span className="text-[9px] text-on-surface-variant font-mono uppercase tracking-widest font-black bg-surface-container-high px-3 py-1.5 rounded-full border border-outline-variant/10">
                ⚡ SECURE & ENCRYPTED CHANNELS
              </span>
            </div>
          </div>

          {/* Assistance Notice */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-3">
            <h4 className="font-black text-xs text-on-surface uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-500" />
              SYSTEM AVAILABILITY STATUS
            </h4>
            <p className="text-[11px] text-on-surface-variant leading-relaxed font-bold">
              Our direct contact lines are monitored 24/7. In the event of a national outage or extreme network blackout, please refer to the preloaded state-by-state phone directories in our 'Emergency Contacts' directory which remain fully active offline.
            </p>
          </div>

        </div>

      </div>

      {/* Styled Footer exact visual match from photo, but updated with AlertNow company name */}
      <div className="pt-8 border-t border-outline-variant/20 mt-12 text-center space-y-4">
        <p className="text-xs text-on-surface-variant font-bold leading-relaxed">
          © 2026 AlertNow Portal. All emergency response content copyright AlertNow.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold text-primary font-mono tracking-wider">
          <button 
            onClick={() => setModalType('privacy')}
            className="hover:underline hover:text-white uppercase transition-colors"
          >
            Privacy Policy
          </button>
          <span className="text-outline-variant">|</span>
          <button 
            onClick={() => setModalType('disclaimer')}
            className="hover:underline hover:text-white uppercase transition-colors"
          >
            Medical Disclaimer
          </button>
          <span className="text-outline-variant">|</span>
          <button 
            onClick={() => setModalType('terms')}
            className="hover:underline hover:text-white uppercase transition-colors"
          >
            Terms of Service
          </button>
        </div>
      </div>

      {/* Interactive Legal Modals */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border-2 border-[#D4AF37]/50 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative"
            >
              <button 
                onClick={() => setModalType(null)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-white text-lg font-black"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 border-b border-outline-variant pb-3 text-primary">
                {modalType === 'privacy' && <Shield className="w-5 h-5" />}
                {modalType === 'disclaimer' && <Heart className="w-5 h-5 text-error" />}
                {modalType === 'terms' && <Scale className="w-5 h-5" />}
                <h3 className="font-black uppercase text-sm tracking-widest">
                  {modalType === 'privacy' && 'Privacy Policy'}
                  {modalType === 'disclaimer' && 'Medical Disclaimer'}
                  {modalType === 'terms' && 'Terms of Service'}
                </h3>
              </div>

              <div className="text-xs text-on-surface-variant leading-relaxed font-bold space-y-3 max-h-72 overflow-y-auto pr-2">
                {modalType === 'privacy' && (
                  <>
                    <p>At AlertNow Portal, accessible via our secure applications, your extreme privacy is our utmost priority.</p>
                    <p>We do NOT track your locations persistently, nor do we harvest or sell any profile telemetry. Your medical database configurations reside entirely inside secure device memory contexts (LocalStorage / IndexedDB) or your own encrypted Cloud Firestore node.</p>
                    <p>Information shared during an active SOS event is only disseminated to contacts specified directly in your Priority Directory or verified local public service responders.</p>
                  </>
                )}
                {modalType === 'disclaimer' && (
                  <>
                    <p>AlertNow Portal is a client-side emergency dispatch assistance platform. All informational clinical guidelines, triage algorithms, first aid guides, and AI assistant diagnostics are offered purely for peer-support education.</p>
                    <p>The contents of this app do NOT constitute professional medical advice, official diagnosis, or certified medical response training. Always coordinate direct medical intervention with professional emergency units and qualified physicians.</p>
                    <p>In life-threatening situations, initiate direct calling pathways immediately.</p>
                  </>
                )}
                {modalType === 'terms' && (
                  <>
                    <p>By engaging with the AlertNow platform, you accept full and absolute responsibility for your own physical security configurations.</p>
                    <p>You agree to utilize this system solely for legitimate emergency coordination, local Nigerian state dispatch routing, and personal safety telemetry preservation.</p>
                    <p>Misuse, spamming of simulated SOS triggers, or intentional misdirection of state responders will result in immediate permanent account termination and referral to appropriate cyber security services.</p>
                  </>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => setModalType(null)}
                  className="bg-primary text-black font-black text-xs uppercase px-4 py-2 rounded hover:brightness-110"
                >
                  Close & Acknowledge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
