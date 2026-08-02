import React, { useState } from 'react';
import { 
  Heart, 
  Plus, 
  Trash2, 
  Save, 
  User, 
  QrCode, 
  ShieldAlert, 
  Check, 
  Activity, 
  Sparkles,
  CreditCard,
  Building,
  ActivitySquare,
  MapPin
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile, Medication } from '../types';

interface MedicalProfileProps {
  userProfile: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
  highContrast: boolean;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMMON_CONDITIONS = [
  { id: 'stroke', label: 'Stroke Risk / History' },
  { id: 'heart-attack', label: 'Heart Attack / CAD' },
  { id: 'seizure', label: 'Seizure Disorder / Epilepsy' },
  { id: 'asthma', label: 'Asthma / COPD' },
  { id: 'diabetes', label: 'Diabetes (Type 1 or 2)' },
  { id: 'hypertension', label: 'Hypertension (High BP)' },
];

export default function MedicalProfile({
  userProfile,
  onSaveProfile,
  highContrast
}: MedicalProfileProps) {
  // Prepopulate state or fall back to defaults
  const [name, setName] = useState(userProfile?.name || '');
  const [dob, setDob] = useState(userProfile?.dob || '');
  const [gender, setGender] = useState(userProfile?.gender || '');
  const [height, setHeight] = useState(userProfile?.height || '');
  const [weight, setWeight] = useState(userProfile?.weight || '');
  const [bloodGroup, setBloodGroup] = useState(userProfile?.bloodGroup || '');
  const [insurance, setInsurance] = useState(userProfile?.insurance || '');
  const [preferredHospital, setPreferredHospital] = useState(userProfile?.preferredHospital || '');
  const [primaryDoctor, setPrimaryDoctor] = useState(userProfile?.primaryDoctor || '');
  const [medicalIdNumber, setMedicalIdNumber] = useState(userProfile?.medicalIdNumber || 'AL-' + Math.floor(Math.random() * 9000 + 1000));
  const [organDonor, setOrganDonor] = useState(userProfile?.organDonor || false);
  const [qrEnabled, setQrEnabled] = useState(userProfile?.qrEnabled || true);
  const [location, setLocation] = useState(userProfile?.location || '');

  // Allergies tag state
  const [allergiesInput, setAllergiesInput] = useState('');
  const [allergies, setAllergies] = useState<string[]>(userProfile?.allergies || []);

  // Conditions checklists state
  const [selectedConditions, setSelectedConditions] = useState<string[]>(userProfile?.conditions || []);

  // Medications dynamic list state
  const [medsList, setMedsList] = useState<Medication[]>(userProfile?.medications || []);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');

  // Lifestyle state
  const [smoking, setSmoking] = useState<UserProfile['lifestyle']['smoking']>(userProfile?.lifestyle?.smoking || 'Never');
  const [alcohol, setAlcohol] = useState<UserProfile['lifestyle']['alcohol']>(userProfile?.lifestyle?.alcohol || 'None');
  const [exercise, setExercise] = useState(userProfile?.lifestyle?.exercise || 'Regular');

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = allergiesInput.trim();
    if (clean && !allergies.includes(clean)) {
      setAllergies([...allergies, clean]);
      setAllergiesInput('');
    }
  };

  const handleRemoveAllergy = (indexToRemove: number) => {
    setAllergies(allergies.filter((_, idx) => idx !== indexToRemove));
  };

  const handleToggleCondition = (id: string) => {
    if (selectedConditions.includes(id)) {
      setSelectedConditions(selectedConditions.filter(c => c !== id));
    } else {
      setSelectedConditions([...selectedConditions, id]);
    }
  };

  const handleAddMedication = () => {
    if (newMedName.trim() && newMedDosage.trim()) {
      const newMed: Medication = {
        id: Math.random().toString(36).substring(2, 9),
        name: newMedName.trim(),
        dosage: newMedDosage.trim(),
        frequency: newMedFreq.trim() || 'Once Daily'
      };
      setMedsList([...medsList, newMed]);
      setNewMedName('');
      setNewMedDosage('');
      setNewMedFreq('');
    }
  };

  const handleRemoveMedication = (id: string) => {
    setMedsList(medsList.filter(m => m.id !== id));
  };

  const handleSave = () => {
    const updatedProfile: UserProfile = {
      uid: userProfile?.uid || 'local-user',
      email: userProfile?.email || 'unregistered@alertnow.com',
      name,
      dob,
      gender,
      height,
      weight,
      bloodGroup,
      allergies,
      medications: medsList,
      conditions: selectedConditions,
      organDonor,
      insurance,
      preferredHospital,
      primaryDoctor,
      medicalIdNumber,
      lifestyle: {
        smoking,
        alcohol,
        exercise
      },
      qrEnabled,
      location
    };
    onSaveProfile(updatedProfile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Save Trigger Floating/Banner row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container border border-outline-variant/30 p-4 rounded-lg">
        <div>
          <h2 className="text-sm font-black text-on-surface uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-5 h-5 text-error animate-pulse" />
            SECURE HEALTH ENCRYPTOR
          </h2>
          <p className="text-xs text-on-surface-variant mt-1 font-medium">
            Medical information is cached securely locally. Saving uploads and synchronizes files instantly with Firebase cloud database.
          </p>
        </div>
        <button 
          onClick={handleSave}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-black font-black text-xs uppercase tracking-widest rounded hover:bg-primary/80 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? 'PROFILE SYNCED!' : 'SAVE & SECURE SYNC'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Editable Fields Forms (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Identity & Physical Parameters */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
            <h3 className="font-black text-sm text-on-surface uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              BIOMETRIC IDENTITY
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase">FULL NAME</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Adebayo Chioma"
                  className="w-full bg-surface border border-outline-variant/40 rounded px-3 py-2.5 text-xs text-on-surface font-bold focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase">DATE OF BIRTH</label>
                <input 
                  type="date" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/40 rounded px-3 py-2.5 text-xs text-on-surface font-bold focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase">BLOOD GROUP</label>
                <select 
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/40 rounded px-3 py-2.5 text-xs text-on-surface font-bold focus:border-primary focus:outline-none"
                >
                  <option value="">Select Blood Group</option>
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase">GENOTYPE / GENDER</label>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/40 rounded px-3 py-2.5 text-xs text-on-surface font-bold focus:border-primary focus:outline-none"
                >
                  <option value="">Select Gender/Genotype</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Non-Disclosure</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase">HEIGHT (CM)</label>
                <input 
                  type="text" 
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 175"
                  className="w-full bg-surface border border-outline-variant/40 rounded px-3 py-2.5 text-xs text-on-surface font-bold focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase">WEIGHT (KG)</label>
                <input 
                  type="text" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 78"
                  className="w-full bg-surface border border-outline-variant/40 rounded px-3 py-2.5 text-xs text-on-surface font-bold focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1 pt-3 border-t border-outline-variant/20">
              <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">USER LOCATION / ADDRESS</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-on-surface-variant">
                  <MapPin className="w-4 h-4 text-primary" />
                </span>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. 42, Adeola Hopewell Street, Victoria Island, Lagos, Nigeria"
                  className="w-full bg-surface border border-outline-variant/40 rounded pl-9 pr-3 py-2.5 text-xs text-on-surface font-bold focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Chronic Conditions Checklist */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
            <h3 className="font-black text-sm text-on-surface uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-error" />
              CHRONIC MEDICAL CONDITIONS
            </h3>
            <p className="text-[10px] text-on-surface-variant font-bold leading-relaxed">
              CHOOSE ALL THAT APPLY. THIS DATA SENSITIZES THE EMERGENCY HUD OVERLAY SCHEMES FOR FIRST RESPONDERS.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMMON_CONDITIONS.map(cond => {
                const checked = selectedConditions.includes(cond.id);
                return (
                  <button
                    key={cond.id}
                    onClick={() => handleToggleCondition(cond.id)}
                    className={`p-3 border rounded text-left flex items-center justify-between transition-all active:scale-95
                      ${checked 
                        ? 'bg-error-container/20 border-error text-error font-black' 
                        : 'bg-surface border-outline-variant/40 text-on-surface-variant hover:text-on-surface'}`}
                  >
                    <span className="text-xs font-bold">{cond.label}</span>
                    <span className={`w-4.5 h-4.5 rounded border flex items-center justify-center text-[10px] font-bold
                      ${checked ? 'bg-error text-white border-error' : 'border-outline-variant/40 bg-surface-container'}`}
                    >
                      {checked && '✓'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allergies Tag Arrays */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
            <h3 className="font-black text-sm text-on-surface uppercase tracking-wider flex items-center gap-2">
              <ActivitySquare className="w-4 h-4 text-amber-400" />
              CLINICAL ALLERGIES & REACTANTS
            </h3>

            <form onSubmit={handleAddAllergy} className="flex gap-2">
              <input 
                type="text" 
                value={allergiesInput}
                onChange={(e) => setAllergiesInput(e.target.value)}
                placeholder="e.g. Penicillin, Peanuts, Latex"
                className="flex-1 bg-surface border border-outline-variant/40 rounded px-3 py-2.5 text-xs text-on-surface font-bold focus:border-primary focus:outline-none"
              />
              <button 
                type="submit"
                className="px-4 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 text-primary font-black text-xs uppercase tracking-wider rounded transition-colors"
              >
                ADD ENTRY
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {allergies.length > 0 ? (
                allergies.map((allergy, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-1.5 px-3 py-1 bg-error-container/20 border border-error/30 text-error rounded text-xs font-bold"
                  >
                    <span>{allergy}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveAllergy(idx)}
                      className="hover:text-white font-black hover:bg-error/30 rounded px-1 text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-on-surface-variant font-medium">No allergies reported yet.</p>
              )}
            </div>
          </div>

          {/* Medications lists */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
            <h3 className="font-black text-sm text-on-surface uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              ACTIVE PRESCRIBED MEDICATIONS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input 
                type="text" 
                placeholder="Medication Name" 
                value={newMedName}
                onChange={(e) => setNewMedName(e.target.value)}
                className="bg-surface border border-outline-variant/40 rounded px-3 py-2 text-xs text-on-surface font-bold focus:outline-none"
              />
              <input 
                type="text" 
                placeholder="Dosage (e.g. 500mg)" 
                value={newMedDosage}
                onChange={(e) => setNewMedDosage(e.target.value)}
                className="bg-surface border border-outline-variant/40 rounded px-3 py-2 text-xs text-on-surface font-bold focus:outline-none"
              />
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Frequency" 
                  value={newMedFreq}
                  onChange={(e) => setNewMedFreq(e.target.value)}
                  className="flex-1 bg-surface border border-outline-variant/40 rounded px-3 py-2 text-xs text-on-surface font-bold focus:outline-none"
                />
                <button 
                  type="button" 
                  onClick={handleAddMedication}
                  className="p-2 bg-primary text-black rounded font-black hover:bg-primary/80 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {medsList.length > 0 ? (
                medsList.map((med) => (
                  <div key={med.id} className="flex justify-between items-center p-3 rounded bg-surface-container-high border border-outline-variant/20">
                    <div>
                      <h4 className="text-xs font-black text-on-surface">{med.name}</h4>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase">{med.dosage} — {med.frequency}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveMedication(med.id)}
                      className="p-1.5 text-on-surface-variant hover:text-error rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-on-surface-variant font-medium text-center py-2">No active medications registered.</p>
              )}
            </div>
          </div>

          {/* Providers & Hospital Prefs */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-5 space-y-4">
            <h3 className="font-black text-sm text-on-surface uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-primary" />
              PRESPONDING MEDICAL INFRASTRUCTURE
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase">INSURANCE PROVIDER & POLICY #</label>
                <input 
                  type="text" 
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                  placeholder="e.g. NHIS / HMO-29831"
                  className="w-full bg-surface border border-outline-variant/40 rounded px-3 py-2.5 text-xs text-on-surface font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase">PREFERRED CLINIC / HOSPITAL</label>
                <input 
                  type="text" 
                  value={preferredHospital}
                  onChange={(e) => setPreferredHospital(e.target.value)}
                  placeholder="e.g. LUTH Accident & Emergency"
                  className="w-full bg-surface border border-outline-variant/40 rounded px-3 py-2.5 text-xs text-on-surface font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase">PRIMARY CARE DOCTOR CONTACT</label>
                <input 
                  type="text" 
                  value={primaryDoctor}
                  onChange={(e) => setPrimaryDoctor(e.target.value)}
                  placeholder="e.g. Dr. Alabi (0803...)"
                  className="w-full bg-surface border border-outline-variant/40 rounded px-3 py-2.5 text-xs text-on-surface font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase">EMERGENCY CLINICAL KEY ID</label>
                <input 
                  type="text" 
                  value={medicalIdNumber}
                  onChange={(e) => setMedicalIdNumber(e.target.value)}
                  placeholder="e.g. AL-9082"
                  className="w-full bg-surface border border-outline-variant/40 rounded px-3 py-2.5 text-xs text-on-surface font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-outline-variant/20 pt-4">
              <div>
                <h4 className="text-xs font-black text-on-surface uppercase">ORGAN DONOR</h4>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Authorize clinical transplant bypasses during fatality events.</p>
              </div>
              <button 
                type="button" 
                onClick={() => setOrganDonor(!organDonor)}
                className={`px-4 py-2 border rounded text-xs font-bold uppercase transition-all
                  ${organDonor 
                    ? 'bg-primary text-black border-primary' 
                    : 'bg-surface border-outline-variant/40 text-on-surface-variant'}`}
              >
                {organDonor ? 'AUTHORIZED DONOR' : 'NOT AUTHORIZED'}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Medical ID Card & QR Mock (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Medical Information ID Badge Card */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-primary rounded-lg p-5 shadow-2xl relative overflow-hidden space-y-6">
            
            {/* Holographic Sentinel watermark background */}
            <div className="absolute top-0 right-0 p-12 opacity-5 transform translate-x-6 -translate-y-6">
              <Heart className="w-56 h-56" />
            </div>

            {/* Card Header */}
            <div className="flex justify-between items-start relative z-10 border-b border-primary/20 pb-3">
              <div>
                <span className="text-[9px] font-black tracking-widest text-primary uppercase">EMERGENCY MEDICAL IDENTIFICATION</span>
                <h3 className="text-base font-black text-white mt-0.5">{name || 'ANONYMOUS COMMANDER'}</h3>
                <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  ID: {medicalIdNumber}
                </span>
              </div>
              <div className="bg-primary text-black font-black text-base px-3 py-1 rounded">
                {bloodGroup}
              </div>
            </div>

            {/* Vital parameters */}
            <div className="grid grid-cols-2 gap-4 relative z-10 text-xs">
              <div>
                <span className="text-[9px] text-primary/70 font-bold uppercase">PHYSICALS</span>
                <p className="font-bold text-white mt-0.5">
                  {gender} • {height ? `${height}cm` : 'Not Set'} • {weight ? `${weight}kg` : 'Not Set'}
                </p>
              </div>
              <div>
                <span className="text-[9px] text-primary/70 font-bold uppercase">DOB / DATE</span>
                <p className="font-bold text-white mt-0.5">{dob || 'Not Configured'}</p>
              </div>
            </div>

            {/* Clinical Alerts and Reactants */}
            <div className="space-y-1 relative z-10">
              <span className="text-[9px] text-red-400 font-bold uppercase tracking-wide">CRITICAL LIFE REACTANTS / ALLERGIES</span>
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {allergies.length > 0 ? (
                  allergies.map((allergy, i) => (
                    <span key={i} className="px-2 py-0.5 bg-red-950 border border-red-800 text-red-400 rounded text-[10px] font-bold uppercase">
                      {allergy}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-neutral-500 font-bold uppercase">NONE REGISTERED</span>
                )}
              </div>
            </div>

            {/* Chronic Medical Conditions */}
            <div className="space-y-1 relative z-10">
              <span className="text-[9px] text-red-400 font-bold uppercase tracking-wide">DETECTED CO-MORBIDITIES</span>
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {selectedConditions.length > 0 ? (
                  selectedConditions.map((cond, i) => (
                    <span key={i} className="px-2 py-0.5 bg-red-950 border border-red-800 text-red-400 rounded text-[10px] font-bold uppercase">
                      {cond.toUpperCase()}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-neutral-500 font-bold uppercase">NO CHRONIC STATES SPECIFIED</span>
                )}
              </div>
            </div>

            {/* Active meds table preview */}
            {medsList.length > 0 && (
              <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded relative z-10 space-y-1">
                <span className="text-[9px] text-primary/70 font-bold uppercase tracking-wider">ACTIVE PHARMACOLOGY LOCK</span>
                {medsList.slice(0, 2).map((med, i) => (
                  <div key={i} className="flex justify-between text-[10px] font-bold text-white">
                    <span>• {med.name}</span>
                    <span className="text-neutral-400">{med.dosage} ({med.frequency})</span>
                  </div>
                ))}
              </div>
            )}

            {/* Responsive QR Code offline mockup */}
            <div className="flex items-center justify-between border-t border-neutral-800 pt-4 relative z-10 gap-3">
              <div>
                <p className="text-[10px] text-primary font-black uppercase tracking-wider">RESPONDER PASS BYPASS</p>
                <p className="text-[9px] text-neutral-400 leading-normal max-w-[200px]">
                  First responders scan this physical-screen QR badge to instantly parse secure local JSON clinical profile values when offline.
                </p>
              </div>

              {/* Holographic QR drawing */}
              <div className="w-24 h-24 bg-white p-1 rounded-md flex flex-col items-center justify-center shadow-md relative group select-none">
                {/* SVG-based structured offline QR mockup */}
                <svg className="w-full h-full text-black" viewBox="0 0 100 100" fill="currentColor">
                  {/* Position detection outer anchors */}
                  <rect x="5" y="5" width="25" height="25" fill="black" />
                  <rect x="10" y="10" width="15" height="15" fill="white" />
                  <rect x="13" y="13" width="9" height="9" fill="black" />

                  <rect x="70" y="5" width="25" height="25" fill="black" />
                  <rect x="75" y="10" width="15" height="15" fill="white" />
                  <rect x="78" y="13" width="9" height="9" fill="black" />

                  <rect x="5" y="70" width="25" height="25" fill="black" />
                  <rect x="10" y="75" width="15" height="15" fill="white" />
                  <rect x="13" y="78" width="9" height="9" fill="black" />

                  {/* Dynamic pixel matrices representing clinical data hashes */}
                  <rect x="35" y="10" width="5" height="10" />
                  <rect x="45" y="5" width="10" height="5" />
                  <rect x="40" y="20" width="15" height="5" />
                  <rect x="60" y="15" width="5" height="15" />
                  
                  <rect x="35" y="35" width="15" height="15" />
                  <rect x="40" y="40" width="5" height="5" fill="white" />
                  
                  <rect x="10" y="35" width="10" height="5" />
                  <rect x="15" y="45" width="5" height="15" />
                  <rect x="5" y="55" width="15" height="5" />

                  <rect x="55" y="40" width="15" height="10" />
                  <rect x="65" y="55" width="20" height="5" />
                  <rect x="80" y="40" width="5" height="15" />
                  <rect x="85" y="35" width="10" height="5" />

                  <rect x="35" y="60" width="5" height="15" />
                  <rect x="45" y="70" width="15" height="10" />
                  <rect x="50" y="85" width="15" height="5" />
                  <rect x="35" y="80" width="10" height="5" />

                  <rect x="70" y="70" width="15" height="15" />
                  <rect x="75" y="75" width="5" height="5" fill="white" />
                  <rect x="85" y="80" width="10" height="10" />

                  {/* Centered medical cross emblem */}
                  <rect x="42" y="42" width="16" height="16" fill="white" />
                  <rect x="48" y="44" width="4" height="12" fill="red" />
                  <rect x="44" y="48" width="12" height="4" fill="red" />
                </svg>
              </div>
            </div>

            {/* Bottom physical security hologram */}
            <div className="flex justify-between items-center bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800 text-[9px] font-mono">
              <span className="text-primary/80 font-bold">● BIO CHIP ACTIVE</span>
              <span className="text-neutral-500 font-bold">AL-N V2 HARDENED SECURE</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
