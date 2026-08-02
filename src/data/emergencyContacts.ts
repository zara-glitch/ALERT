import { EmergencyContact } from '../types';

export const preloadedNigerianContacts: EmergencyContact[] = [
  {
    id: 'nig-police',
    name: 'Nigeria Police Force (NPF)',
    relationship: 'National Emergency',
    phone: '112',
    priority: true,
    whatsappSupported: false,
    isAgency: true,
    agencyType: 'Police'
  },
  {
    id: 'nig-fire',
    name: 'Federal Fire Service (FFS)',
    relationship: 'National Emergency',
    phone: '08032003557',
    priority: true,
    whatsappSupported: false,
    isAgency: true,
    agencyType: 'Fire'
  },
  {
    id: 'nig-frsc',
    name: 'Federal Road Safety Corps (FRSC)',
    relationship: 'Road Accidents',
    phone: '122',
    priority: true,
    whatsappSupported: false,
    isAgency: true,
    agencyType: 'Ambulance'
  },
  {
    id: 'nig-nscdc',
    name: 'NSCDC (Civil Defence)',
    relationship: 'Security & Civil Protection',
    phone: '08023413241',
    priority: false,
    whatsappSupported: false,
    isAgency: true,
    agencyType: 'Police'
  },
  {
    id: 'nig-nema',
    name: 'NEMA (National Emergency Management)',
    relationship: 'Disaster Relief / Flood / Fire',
    phone: '080022556362',
    priority: false,
    whatsappSupported: false,
    isAgency: true,
    agencyType: 'Ambulance'
  },
  {
    id: 'luth-hospital',
    name: 'Lagos University Teaching Hospital (LUTH)',
    relationship: 'Emergency Medical Services',
    phone: '08023182181',
    priority: true,
    whatsappSupported: true,
    isAgency: true,
    agencyType: 'Hospital'
  },
  {
    id: 'ib-uch-hospital',
    name: 'University College Hospital (UCH), Ibadan',
    relationship: 'Emergency Medical Services',
    phone: '022410088',
    priority: false,
    whatsappSupported: false,
    isAgency: true,
    agencyType: 'Hospital'
  },
  {
    id: 'nig-blood-bank',
    name: 'National Blood Transfusion Service (NBTS)',
    relationship: 'Blood Bank Services',
    phone: '08033284560',
    priority: false,
    whatsappSupported: false,
    isAgency: true,
    agencyType: 'Hospital'
  },
  {
    id: 'nig-poison-control',
    name: 'NAFDAC Poison Information Centre',
    relationship: 'Poison / Chemical Toxicity',
    phone: '08037885261',
    priority: false,
    whatsappSupported: false,
    isAgency: true,
    agencyType: 'Hospital'
  }
];
