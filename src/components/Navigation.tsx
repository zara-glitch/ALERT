import { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  MapPin, 
  UserSquare2, 
  Users, 
  Bot, 
  BriefcaseMedical, 
  FileCheck, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Bell, 
  User, 
  Menu,
  Info,
  Mail,
  Mic,
  Radio,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AlertNowLogo from './AlertNowLogo';

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  notificationsCount: number;
  onOpenNotifications: () => void;
  userEmail?: string;
  highContrast: boolean;
  colorBlind: boolean;
  onToggleSOS: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onOpenVoiceOutsideModal?: () => void;
  voiceSosEnabled?: boolean;
}

export default function Navigation({
  currentView,
  setCurrentView,
  notificationsCount,
  onOpenNotifications,
  userEmail,
  highContrast,
  colorBlind,
  onToggleSOS,
  isCollapsed,
  setIsCollapsed,
  onOpenVoiceOutsideModal,
  voiceSosEnabled
}: NavigationProps) {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sos', label: 'Emergency SOS', icon: ShieldAlert, highlight: true },
    { id: 'kids', label: 'Kids Emergency Guide', icon: Sparkles },
    { id: 'profile', label: 'Medical Profile', icon: UserSquare2 },
    { id: 'contacts', label: 'Emergency Contacts', icon: Users },
    { id: 'ai', label: 'AI Assistant', icon: Bot },
    { id: 'firstaid', label: 'First Aid Guides', icon: BriefcaseMedical },
    { id: 'protocols', label: 'Emergency Protocols', icon: FileCheck },
    { id: 'about', label: 'About & Credits', icon: Info },
    { id: 'contact', label: 'Contact Us', icon: Mail },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className={`md:hidden fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 border-b transition-colors
        ${highContrast ? 'bg-black border-white' : 'bg-surface border-outline-variant/30'}`}>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-primary"
            id="mobile-menu-toggle"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="w-7 h-7 rounded-md overflow-hidden border border-[#D4AF37]/30 bg-[#0D0D0D] shrink-0">
            <AlertNowLogo className="w-full h-full" variant="icon" />
          </div>
          <span className="font-extrabold tracking-tighter text-lg text-primary uppercase">ALERTNOW V2</span>
        </div>
        <div className="flex items-center gap-2">
          {onOpenVoiceOutsideModal && (
            <button
              onClick={onOpenVoiceOutsideModal}
              className={`p-2 rounded-full border transition-all flex items-center gap-1 ${
                voiceSosEnabled 
                  ? 'bg-primary/20 border-primary text-primary animate-pulse' 
                  : 'bg-surface-container-high border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
              }`}
              title="Configure Outside-App & Hands-Free Voice SOS"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}

          <button 
            onClick={onOpenNotifications}
            className="p-2 hover:bg-surface-container-high transition-colors rounded-full relative"
          >
            <Bell className="w-5 h-5 text-on-surface" />
            {notificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
            )}
          </button>
          <div className="w-8 h-8 rounded-full border border-primary overflow-hidden bg-surface-container flex items-center justify-center">
            {userEmail ? (
              <span className="text-xs font-bold text-primary">{userEmail[0].toUpperCase()}</span>
            ) : (
              <User className="w-4 h-4 text-on-surface-variant" />
            )}
          </div>
        </div>
      </header>

      {/* Desktop collapsible side bar */}
      <aside 
        onClick={() => {
          setIsCollapsed(!isCollapsed);
        }}
        className={`hidden md:flex h-screen fixed left-0 top-0 z-40 flex-col py-6 transition-all duration-300 ease-in-out border-r cursor-pointer
          ${isCollapsed ? 'w-20 hover:bg-surface-container-low/20' : 'w-64'} 
          ${highContrast ? 'bg-black border-white' : 'bg-surface border-outline-variant/30'}`}
      >
        <div className="px-4 mb-8 flex justify-between items-center overflow-hidden">
          {isCollapsed ? (
            <div className="w-10 h-10 mx-auto rounded-lg overflow-hidden border border-[#D4AF37]/30 bg-[#0D0D0D] shrink-0">
              <AlertNowLogo className="w-full h-full" variant="icon" />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#D4AF37]/30 bg-[#0D0D0D] shrink-0">
                <AlertNowLogo className="w-full h-full" variant="icon" />
              </div>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex flex-col"
              >
                <h1 className="font-black text-primary tracking-tight text-lg leading-none">ALERTNOW</h1>
                <p className="text-[9px] tracking-wider text-on-surface-variant font-bold uppercase mt-1">Sentinel Hub</p>
              </motion.div>
            </div>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(!isCollapsed);
            }}
            className="p-1.5 hover:bg-surface-container-high transition-colors rounded-lg text-primary self-center"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>



        {/* Menu Items */}
        <nav className="flex-1 space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`desktop-nav-item-${item.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentView(item.id);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left group relative
                  ${isActive 
                    ? (highContrast ? 'bg-zinc-800 border-l-4 border-white text-white' : 'bg-surface-container-highest border-l-4 border-primary text-primary') 
                    : (highContrast ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high')}
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary transition-colors'}`} />
                {!isCollapsed && (
                  <span className="font-bold text-sm tracking-wide">{item.label}</span>
                )}
                
                {/* Visual tooltip when collapsed */}
                {isCollapsed && (
                  <div className="absolute left-20 bg-surface-container-highest border border-outline-variant text-primary text-xs font-bold py-1.5 px-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-4 space-y-3">
          <button 
            id="desktop-nav-action-sos"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSOS();
            }}
            className={`w-full py-3.5 rounded-lg font-bold tracking-widest text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all
              ${highContrast ? 'bg-white text-black' : 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error'}`}
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            {!isCollapsed && <span>ACTIVATE SOS</span>}
          </button>

          <button 
            id="desktop-nav-action-settings"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentView('settings');
            }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left group relative
              ${currentView === 'settings' 
                ? (highContrast ? 'bg-zinc-800 border-l-4 border-white text-white' : 'bg-surface-container-highest border-l-4 border-primary text-primary') 
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}
            `}
          >
            <Settings className="w-5 h-5 shrink-0 group-hover:text-primary" />
            {!isCollapsed && <span className="font-bold text-sm">Settings</span>}
            {isCollapsed && (
              <div className="absolute left-20 bg-surface-container-highest border border-outline-variant text-primary text-xs font-bold py-1.5 px-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                Settings
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Side Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black z-40"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`md:hidden fixed left-0 top-0 h-full w-4/5 max-w-sm z-50 p-6 flex flex-col border-r shadow-2xl
                ${highContrast ? 'bg-black border-white' : 'bg-surface-container-lowest border-outline-variant/30'}`}
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="font-extrabold tracking-tighter text-xl text-primary uppercase">ALERTNOW</h1>
                  <p className="text-[9px] tracking-widest text-on-surface-variant font-bold uppercase mt-0.5">Emergency Hub</p>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-primary font-bold"
                >
                  Close
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`mobile-drawer-nav-item-${item.id}`}
                      onClick={() => {
                        setCurrentView(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left
                        ${isActive 
                          ? (highContrast ? 'bg-zinc-800 border-l-4 border-white text-white' : 'bg-surface-container-high border-l-4 border-primary text-primary') 
                          : 'text-on-surface hover:bg-surface-container'}
                      `}
                    >
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="font-bold text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="space-y-3 pt-4 border-t border-outline-variant/20">
                <button 
                  id="mobile-drawer-nav-settings"
                  onClick={() => {
                    setCurrentView('settings');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left
                    ${currentView === 'settings' ? 'bg-surface-container-high text-primary' : 'text-on-surface'}
                  `}
                >
                  <Settings className="w-5 h-5 text-primary" />
                  <span className="font-bold text-sm">Settings</span>
                </button>

                <button 
                  id="mobile-drawer-nav-sos"
                  onClick={() => {
                    onToggleSOS();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full py-4 rounded-lg font-bold tracking-widest text-xs flex items-center justify-center gap-2
                    ${highContrast ? 'bg-white text-black' : 'bg-error-container text-on-error-container'}`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>ACTIVATE SOS</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar */}
      <nav className={`md:hidden fixed bottom-0 left-0 w-full h-16 z-40 flex justify-around items-center border-t shadow-lg px-2
        ${highContrast ? 'bg-black border-white' : 'bg-surface-container-high border-outline-variant/30'}`}>
        <button 
          id="mobile-bottom-nav-dashboard"
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center justify-center transition-colors ${currentView === 'dashboard' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-1">Home</span>
        </button>
        <button 
          id="mobile-bottom-nav-sos"
          onClick={() => setCurrentView('sos')}
          className={`flex flex-col items-center justify-center transition-colors ${currentView === 'sos' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <ShieldAlert className="w-5 h-5 animate-pulse text-error" />
          <span className="text-[9px] font-bold mt-1 text-error">SOS</span>
        </button>
        <button 
          id="mobile-bottom-nav-ai"
          onClick={() => setCurrentView('ai')}
          className={`flex flex-col items-center justify-center transition-colors ${currentView === 'ai' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <Bot className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-1">AI Help</span>
        </button>
        <button 
          id="mobile-bottom-nav-profile"
          onClick={() => setCurrentView('profile')}
          className={`flex flex-col items-center justify-center transition-colors ${currentView === 'profile' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <UserSquare2 className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-1">Profile</span>
        </button>
      </nav>
    </>
  );
}
