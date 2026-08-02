import { UserProfile } from '../types';

export interface EmergencyIncidentData {
  incidentRef: string;
  emergencyType: string;
  timestamp: string;
  userName: string;
  userPhone?: string;
  medicalIdNumber?: string;
  bloodGroup?: string;
  allergies?: string[];
  state: string;
  emergencyService: string;
  servicePhone: string;
  locationAddress: string;
  latitude?: number;
  longitude?: number;
  shortDescription?: string;
  requestedDispatchUnits?: string[];
}

export interface DispatchAgency {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  description: string;
  category: 'police' | 'medical' | 'fire' | 'road' | 'disaster' | 'unified';
  emailPurpose?: string;
  isConfirmedDispatchChannel?: boolean;
}

export const DISPATCH_AGENCIES: DispatchAgency[] = [
  {
    id: 'police',
    name: 'Nigeria Police Force (NPF Headquarters)',
    code: 'POLICE DISPATCH & PR',
    email: 'pressforabuja@npf.gov.ng',
    phone: '112 / 08033000000',
    description: 'Security Threats, Crime Reports & Official Police Communications Desk.',
    category: 'police',
    emailPurpose: 'Official NPF Press & Public Desk (Note: Dial 112 for urgent live dispatch)',
    isConfirmedDispatchChannel: false
  },
  {
    id: 'nema',
    name: 'National Emergency Management Agency (NEMA)',
    code: 'NEMA DISASTER DESK',
    email: 'info@nema.gov.ng, nemapress@yahoo.com',
    phone: '112 / 080022556362',
    description: 'Disaster Relief, Flood Emergency & Mass Casualty Coordination.',
    category: 'disaster',
    emailPurpose: 'Official NEMA HQ Information Desk (Note: Dial 112 for immediate rescue)',
    isConfirmedDispatchChannel: false
  },
  {
    id: 'fire',
    name: 'Federal Fire Service (FFS HQ)',
    code: 'FEDERAL FIRE SERVICE',
    email: 'info@fedfire.gov.ng',
    phone: '112 / 08032003554',
    description: 'Building Fire, Explosions, Structural Collapse & Hazardous Material.',
    category: 'fire',
    emailPurpose: 'Official Federal Fire Service HQ Information Inbox',
    isConfirmedDispatchChannel: false
  },
  {
    id: 'frsc',
    name: 'Federal Road Safety Corps (FRSC)',
    code: 'HIGHWAY DISPATCH',
    email: 'info@frsc.gov.ng',
    phone: '122 / 07002255377',
    description: 'Highway Crash, Multi-Vehicle Collision & Road Rescue.',
    category: 'road',
    emailPurpose: 'FRSC National Headquarters Information Desk (Dial 122 for immediate highway rescue)',
    isConfirmedDispatchChannel: false
  },
  {
    id: 'ambulance',
    name: 'Emergency Medical & Ambulance (EMS 112)',
    code: 'MEDICAL DISPATCH',
    email: 'ems.ambulance@112.gov.ng',
    phone: '112 / 08000000911',
    description: 'Severe Trauma, Cardiac Arrest, Stroke & Critical Ambulance Response.',
    category: 'medical',
    emailPurpose: '112 Central Command Medical Incident Gateway',
    isConfirmedDispatchChannel: true
  },
  {
    id: 'unified',
    name: 'Unified National 112 Control Center',
    code: 'ALL-AGENCY DISPATCH',
    email: 'controlroom@112.gov.ng',
    phone: '112',
    description: 'Centralized Multi-Agency Dispatch (Police + Medical + Fire + FRSC).',
    category: 'unified',
    emailPurpose: '112 Central Command Emergency Email Gateway',
    isConfirmedDispatchChannel: true
  }
];

export function generateIncidentRef(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `AN-2026-${randomNum}`;
}

export function generateEmergencyEmailSubject(data: EmergencyIncidentData, targetAgencyNames?: string[]): string {
  const agencyTag = targetAgencyNames && targetAgencyNames.length > 0 
    ? ` [REQUESTED DISPATCH: ${targetAgencyNames.join(' + ').toUpperCase()}]`
    : '';
  return `[EMERGENCY ALERTNOW REPORT]${agencyTag} ${data.emergencyType.toUpperCase()} - Ref: ${data.incidentRef}`;
}

export function generateEmergencyEmailBody(data: EmergencyIncidentData, targetAgencyNames?: string[]): string {
  const gpsText = (data.latitude && data.longitude) 
    ? `${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}\nGoogle Maps: https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`
    : 'GPS unavailable';

  const dispatchList = targetAgencyNames && targetAgencyNames.length > 0
    ? targetAgencyNames.map(name => ` - ${name}`).join('\n')
    : ` - ${data.emergencyService} (${data.servicePhone})`;

  return `ALERTNOW CRITICAL EMERGENCY INCIDENT REPORT
=====================================================
INCIDENT REFERENCE : ${data.incidentRef}
DATE & TIME        : ${data.timestamp}
EMERGENCY CATEGORY : ${data.emergencyType.toUpperCase()}
NATIONAL HELPLINE   : 112

REQUESTED DISPATCH UNITS:
-----------------------------------------------------
${dispatchList}

LOCATION DETAILS
-----------------------------------------------------
STATE              : ${data.state}
ADDRESS            : ${data.locationAddress}
COORDINATES        : ${gpsText}

REPORTER / PATIENT IDENTIFIER
-----------------------------------------------------
NAME / IDENTIFIER  : ${data.userName}
MEDICAL ID NO.     : ${data.medicalIdNumber || 'N/A'}
BLOOD GROUP        : ${data.bloodGroup || 'N/A'}
KNOWN ALLERGIES    : ${data.allergies?.length ? data.allergies.join(', ') : 'None Reported'}

INCIDENT NOTES
-----------------------------------------------------
${data.shortDescription || 'Immediate emergency rescue assistance required.'}

=====================================================
Generated by ALERTNOW Emergency Mobile Response System
National Lifeline: Call 112 Immediately`;
}

export function generateEmergencyEmailHref(data: EmergencyIncidentData, recipientEmail?: string, targetAgencyNames?: string[]): string {
  const subject = encodeURIComponent(generateEmergencyEmailSubject(data, targetAgencyNames));
  const bodyText = generateEmergencyEmailBody(data, targetAgencyNames);
  const toEmail = recipientEmail ? encodeURIComponent(recipientEmail) : '';
  return `mailto:${toEmail}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
}

export function generateGmailHref(data: EmergencyIncidentData, recipientEmail?: string, targetAgencyNames?: string[]): string {
  const subject = encodeURIComponent(generateEmergencyEmailSubject(data, targetAgencyNames));
  const body = encodeURIComponent(generateEmergencyEmailBody(data, targetAgencyNames));
  const to = recipientEmail ? encodeURIComponent(recipientEmail) : '';
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
}

export function generateOutlookHref(data: EmergencyIncidentData, recipientEmail?: string, targetAgencyNames?: string[]): string {
  const subject = encodeURIComponent(generateEmergencyEmailSubject(data, targetAgencyNames));
  const body = encodeURIComponent(generateEmergencyEmailBody(data, targetAgencyNames));
  const to = recipientEmail ? encodeURIComponent(recipientEmail) : '';
  return `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${subject}&body=${body}`;
}

export function generateYahooHref(data: EmergencyIncidentData, recipientEmail?: string, targetAgencyNames?: string[]): string {
  const subject = encodeURIComponent(generateEmergencyEmailSubject(data, targetAgencyNames));
  const body = encodeURIComponent(generateEmergencyEmailBody(data, targetAgencyNames));
  const to = recipientEmail ? encodeURIComponent(recipientEmail) : '';
  return `https://compose.mail.yahoo.com/?to=${to}&subj=${subject}&body=${body}`;
}

export function generateEmergencyWhatsAppHref(data: EmergencyIncidentData, targetPhone?: string): string {
  const cleanPhone = targetPhone ? targetPhone.replace(/\s+/g, '').replace(/^\+/, '') : '';
  const formattedPhone = cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone;
  
  const gpsLink = (data.latitude && data.longitude) 
    ? `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`
    : 'GPS pending';

  const text = `🚨 *ALERTNOW EMERGENCY INCIDENT REPORT* 🚨

*REF ID*: ${data.incidentRef}
*CATEGORY*: ${data.emergencyType.toUpperCase()}
*TIME*: ${data.timestamp}

📍 *LOCATION*:
*State*: ${data.state}
*Address*: ${data.locationAddress}
*Map Coordinates*: ${gpsLink}

👤 *PATIENT IDENTIFIER*:
*Name*: ${data.userName}
*Blood Group*: ${data.bloodGroup || 'N/A'}
*Allergies*: ${data.allergies?.length ? data.allergies.join(', ') : 'None'}

📞 *TARGET SERVICE*: ${data.emergencyService} (${data.servicePhone})
*PRIMARY NATIONAL LIFELINE*: 112

⚠️ *NOTE*: ${data.shortDescription || 'Urgent assistance requested.'}`;

  const encodedText = encodeURIComponent(text);
  if (formattedPhone) {
    return `https://wa.me/${formattedPhone}?text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

export function generateEmergencySmsHref(data: EmergencyIncidentData, targetPhone: string): string {
  const gpsCoords = (data.latitude && data.longitude) ? `${data.latitude.toFixed(6)},${data.longitude.toFixed(6)}` : 'GPS pending';
  const message = `EMERGENCY ALERT! Ref:${data.incidentRef}. Type:${data.emergencyType}. Name:${data.userName}. Location:${data.locationAddress} (${gpsCoords}). State:${data.state}. Pls respond immediately!`;
  return `sms:${targetPhone}?body=${encodeURIComponent(message)}`;
}
