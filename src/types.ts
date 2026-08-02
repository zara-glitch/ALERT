export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  dob: string;
  gender: string;
  height: string;
  weight: string;
  bloodGroup: string;
  allergies: string[];
  medications: Medication[];
  conditions: string[];
  organDonor: boolean;
  insurance: string;
  preferredHospital: string;
  primaryDoctor: string;
  medicalIdNumber: string;
  lifestyle: {
    smoking: 'Never' | 'Former' | 'Active';
    alcohol: 'None' | 'Occasional' | 'Moderate' | 'Frequent';
    exercise: string;
  };
  qrEnabled: boolean;
  location?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  priority: boolean;
  whatsappSupported: boolean;
  isAgency: boolean;
  agencyType?: 'Police' | 'Fire' | 'Ambulance' | 'FRSC' | 'NSCDC' | 'NEMA' | 'Hospital';
}

export interface FirstAidGuide {
  id: string;
  title: string;
  icon: string;
  category: string;
  steps: string[];
  tips: string[];
  disclaimer: string;
}

export interface EmergencyProtocol {
  id: string;
  category: string;
  title: string;
  severity: 'Critical' | 'Urgent' | 'High';
  summary: string;
  steps: { id: string; number: number; text: string; detail?: string }[];
  dosAndDonts: { do: string[]; dont: string[] };
  agencyToCall: '112' | '122' | 'Police' | 'Fire' | 'Medical' | 'SEMA';
  verificationStatus: string;
}

export interface SafetyPlan {
  id: string;
  title: string;
  description: string;
  steps: { id: string; text: string; completed: boolean }[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  type: 'reminder' | 'alert' | 'system';
  read: boolean;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  protocolActive?: string;
  protocolStep?: number;
  imageUrl?: string;
  suggestedActions?: string[];
}
