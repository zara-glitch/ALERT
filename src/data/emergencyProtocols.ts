import { EmergencyProtocol } from '../types';

export const emergencyProtocols: EmergencyProtocol[] = [
  {
    id: 'proto-fire',
    category: 'Fire Emergency',
    title: 'Fire & Building Evacuation Protocol',
    severity: 'Critical',
    summary: 'Immediate action plan for structural fires, smoke inhalation risk, and burning hazards.',
    agencyToCall: 'Fire',
    verificationStatus: 'ALERTNOW Predefined Verified Safety Standard',
    dosAndDonts: {
      do: [
        'Move toward the nearest safe emergency exit immediately',
        'Stay low to the floor if smoke is present to reduce toxic inhalation',
        'Touch doors with the back of your hand before opening to check for heat',
        'Alert others on your way out by shouting "FIRE!"'
      ],
      dont: [
        'DO NOT use elevators during a fire evacuation',
        'DO NOT re-enter a burning building for any belongings',
        'DO NOT open hot doors or doors with smoke billowing around edges',
        'DO NOT hide in closets or under beds'
      ]
    },
    steps: [
      {
        id: 'fire-1',
        number: 1,
        text: 'Move away from the fire immediately if safe',
        detail: 'Assess immediate escape routes. If flames or dense smoke block your path, seek an alternate exit or window.'
      },
      {
        id: 'fire-2',
        number: 2,
        text: 'Alert Emergency Services (Dial 112 or Federal Fire Service)',
        detail: 'Call 112 or Federal Fire Service (08032003557) once in a safe location outside the building.'
      },
      {
        id: 'fire-3',
        number: 3,
        text: 'Move toward a safe exit',
        detail: 'Crawl low under smoke where air is cleaner. Use stairwells only—never elevators.'
      },
      {
        id: 'fire-4',
        number: 4,
        text: 'Do not return to the affected area',
        detail: 'Once outside, stay at your designated assembly point away from danger and emergency vehicles.'
      },
      {
        id: 'fire-5',
        number: 5,
        text: 'Follow official emergency responder instructions',
        detail: 'Provide firefighters with information on anyone remaining inside or hazardous materials present.'
      }
    ]
  },
  {
    id: 'proto-rta',
    category: 'Road Traffic Accident',
    title: 'Road Traffic Collision Protocol',
    severity: 'Critical',
    summary: 'Emergency response protocol for highway crashes, vehicle rollovers, and roadside trauma.',
    agencyToCall: '122',
    verificationStatus: 'ALERTNOW Predefined Verified Safety Standard',
    dosAndDonts: {
      do: [
        'Ensure your own safety before approaching the accident scene',
        'Turn on hazard lights and place warning triangles behind vehicles',
        'Call FRSC (122) or National Line (112) immediately',
        'Keep injured victims calm and still'
      ],
      dont: [
        'DO NOT move injured victims unless there is immediate risk of fire or explosion',
        'DO NOT remove helmets from injured motorcyclists',
        'DO NOT allow crowd gathering to obstruct incoming emergency vehicles',
        'DO NOT offer food or drink to injured persons'
      ]
    },
    steps: [
      {
        id: 'rta-1',
        number: 1,
        text: 'Move to a safe location if possible',
        detail: 'Pull your vehicle to the shoulder, turn on hazard lights, and step behind safety barriers.'
      },
      {
        id: 'rta-2',
        number: 2,
        text: 'Contact emergency services (FRSC 122 or 112)',
        detail: 'State your location clearly with mile markers, nearest town, or landmark.'
      },
      {
        id: 'rta-3',
        number: 3,
        text: 'Provide exact location and casualty count',
        detail: 'Report the number of vehicles involved, visible injuries, and trapped passengers.'
      },
      {
        id: 'rta-4',
        number: 4,
        text: 'Avoid unnecessary movement of an injured person',
        detail: 'Support neck and spinal column in place. Moving victims can cause permanent paralysis.'
      },
      {
        id: 'rta-5',
        number: 5,
        text: 'Wait for trained responders',
        detail: 'Direct traffic safely away from scene if safe to do so until FRSC or Police arrive.'
      }
    ]
  },
  {
    id: 'proto-bleeding',
    category: 'Severe Bleeding',
    title: 'Hemorrhage & Severe Bleeding Control',
    severity: 'Critical',
    summary: 'First-response steps for arterial bleeding, deep lacerations, and heavy blood loss.',
    agencyToCall: 'Medical',
    verificationStatus: 'ALERTNOW Predefined Verified Safety Standard',
    dosAndDonts: {
      do: [
        'Apply firm, continuous direct pressure over the wound',
        'Use sterile gauze, clean cloth, or pressure bandage',
        'Have victim lie down flat to prevent fainting',
        'Maintain pressure until medical personnel take over'
      ],
      dont: [
        'DO NOT remove blood-soaked dressings—layer new cloths directly over them',
        'DO NOT probe into deep wounds or attempt to clean inside severe cuts',
        'DO NOT apply improvised tight tourniquets unless trained and life-threatening arterial bleed occurs',
        'DO NOT let the victim move or walk around'
      ]
    },
    steps: [
      {
        id: 'bleed-1',
        number: 1,
        text: 'Alert emergency medical services (112)',
        detail: 'Call 112 or local ambulance dispatch immediately for severe blood loss.'
      },
      {
        id: 'bleed-2',
        number: 2,
        text: 'Apply appropriate first-aid pressure if safe',
        detail: 'Press firmly on the wound with a clean cloth, towel, or sterile dressing using both hands.'
      },
      {
        id: 'bleed-3',
        number: 3,
        text: 'Avoid unnecessary movement',
        detail: 'Lay the person down flat. Elevate bleeding limb above heart level if no bone fracture is suspected.'
      },
      {
        id: 'bleed-4',
        number: 4,
        text: 'Keep victim warm and comfortable',
        detail: 'Cover with a blanket or jacket to preserve body heat and prevent hypothermic shock.'
      },
      {
        id: 'bleed-5',
        number: 5,
        text: 'Wait for medical assistance',
        detail: 'Monitor consciousness and breathing continuously until paramedics arrive.'
      }
    ]
  },
  {
    id: 'proto-burn',
    category: 'Burn Emergency',
    title: 'Thermal & Chemical Burn Protocol',
    severity: 'High',
    summary: 'Safe management steps for flame burns, scalds, hot liquids, and chemical exposure.',
    agencyToCall: 'Medical',
    verificationStatus: 'ALERTNOW Predefined Verified Safety Standard',
    dosAndDonts: {
      do: [
        'Cool burn immediately with clean, cool running water for 10-20 minutes',
        'Cover loosely with sterile non-stick bandage or clean plastic wrap',
        'Remove rings and wristbands before swelling starts',
        'Seek urgent hospital treatment for large or facial burns'
      ],
      dont: [
        'DO NOT apply ice, ice water, butter, grease, oil, or toothpaste',
        'DO NOT break or pop blisters',
        'DO NOT pull away clothing that is stuck to burned skin',
        'DO NOT apply adhesive bandages directly over burned tissue'
      ]
    },
    steps: [
      {
        id: 'burn-1',
        number: 1,
        text: 'Move away from the source of danger',
        detail: 'Extinguish flames, turn off heat or power source, or flush chemical source.'
      },
      {
        id: 'burn-2',
        number: 2,
        text: 'Cool the affected area with clean, cool running water',
        detail: 'Hold under gentle cool water for at least 10–20 minutes. Do NOT use ice.'
      },
      {
        id: 'burn-3',
        number: 3,
        text: 'Seek medical assistance for serious burns',
        detail: 'Call 112 if burn is larger than victim’s palm, involves face, hands, joints, or groin.'
      },
      {
        id: 'burn-4',
        number: 4,
        text: 'Do not apply unsafe substances to the injury',
        detail: 'Avoid traditional remedies like butter, palm oil, or toothpaste which trap heat and cause severe infection.'
      },
      {
        id: 'burn-5',
        number: 5,
        text: 'Protect the burn with a clean cover',
        detail: 'Cover loosely with clean non-fluffy material or cling film to shield from air and microbes.'
      }
    ]
  },
  {
    id: 'proto-choking',
    category: 'Choking',
    title: 'Airway Obstruction & Choking Protocol',
    severity: 'Critical',
    summary: 'Emergency procedures for severe choking in adults and children.',
    agencyToCall: 'Medical',
    verificationStatus: 'ALERTNOW Predefined Verified Safety Standard',
    dosAndDonts: {
      do: [
        'Encourage coughing if the victim can speak or cough forcefully',
        'Deliver 5 sharp back blows between shoulder blades if coughing fails',
        'Perform 5 abdominal thrusts (Heimlich) for complete blockage in adults',
        'Call 112 immediately if obstruction does not clear'
      ],
      dont: [
        'DO NOT interfere if the person is coughing effectively',
        'DO NOT perform blind finger sweeps in the mouth',
        'DO NOT give abdominal thrusts to infants under 1 year (use chest thrusts)',
        'DO NOT slap a choking person while they are upright and speaking'
      ]
    },
    steps: [
      {
        id: 'choke-1',
        number: 1,
        text: 'Immediately identify the emergency',
        detail: 'Check if person can speak, breathe, or cough. Silent clutching of throat indicates total blockage.'
      },
      {
        id: 'choke-2',
        number: 2,
        text: 'Alert emergency services when serious',
        detail: 'Have someone dial 112 while you administer first aid maneuvers.'
      },
      {
        id: 'choke-3',
        number: 3,
        text: 'Provide age-appropriate first aid guidance',
        detail: 'For adults/children >1 yr: Give 5 back blows followed by 5 abdominal thrusts.'
      },
      {
        id: 'choke-4',
        number: 4,
        text: 'Follow the appropriate emergency protocol',
        detail: 'If person becomes unconscious, lower to floor and begin CPR chest compressions.'
      }
    ]
  },
  {
    id: 'proto-unconscious',
    category: 'Unconscious Person',
    title: 'Unconscious Victim & CPR Protocol',
    severity: 'Critical',
    summary: 'Emergency steps for unresponsive, non-breathing, or collapsed victims.',
    agencyToCall: 'Medical',
    verificationStatus: 'ALERTNOW Predefined Verified Safety Standard',
    dosAndDonts: {
      do: [
        'Check responsiveness (Shout and gently shake shoulders)',
        'Open airway by tilting head back and lifting chin',
        'Check for normal breathing for no more than 10 seconds',
        'Start CPR (100–120 compressions per minute) if not breathing normally'
      ],
      dont: [
        'DO NOT delay calling emergency services (112)',
        'DO NOT place pillows under the head of an unconscious victim',
        'DO NOT leave an unconscious victim unattended on their back if breathing (use recovery position)',
        'DO NOT give liquids or food to an unresponsive victim'
      ]
    },
    steps: [
      {
        id: 'unc-1',
        number: 1,
        text: 'Check for responsiveness and breathing',
        detail: 'Tap shoulders and ask loudly "Are you okay?". Look for chest movement for 10 seconds.'
      },
      {
        id: 'unc-2',
        number: 2,
        text: 'Alert emergency medical services (112)',
        detail: 'Call 112 or put phone on speaker so dispatcher can coach CPR.'
      },
      {
        id: 'unc-3',
        number: 3,
        text: 'Follow the app\'s emergency first-aid instructions',
        detail: 'If breathing: Place in recovery position (on side). If NOT breathing: Start chest compressions in center of chest.'
      },
      {
        id: 'unc-4',
        number: 4,
        text: 'Stay with the person when safe to do so',
        detail: 'Continue hands-only CPR compressions until paramedics arrive or AED is ready.'
      },
      {
        id: 'unc-5',
        number: 5,
        text: 'Follow professional responder instructions',
        detail: 'Hand over victim history, time of collapse, and CPR duration to ambulance team.'
      }
    ]
  },
  {
    id: 'proto-allergic',
    category: 'Allergic Reaction',
    title: 'Severe Anaphylactic & Allergic Reaction Protocol',
    severity: 'Critical',
    summary: 'Rapid response steps for severe allergic reactions, insect stings, and acute food anaphylaxis.',
    agencyToCall: 'Medical',
    verificationStatus: 'ALERTNOW Predefined Verified Safety Standard',
    dosAndDonts: {
      do: [
        'Remove or distance from the suspected allergen immediately',
        'Help victim administer their auto-injector (EpiPen) if prescribed',
        'Call 112 immediately if breathing difficulty or lip/throat swelling occurs',
        'Lay victim flat with legs elevated unless breathing is easier sitting'
      ],
      dont: [
        'DO NOT administer unprescribed oral medications during severe throat swelling',
        'DO NOT force victim to stand or walk around',
        'DO NOT leave victim alone as anaphylaxis can worsen rapidly',
        'DO NOT delay calling 112 hoping symptoms will fade'
      ]
    },
    steps: [
      {
        id: 'alg-1',
        number: 1,
        text: 'Move away from the suspected trigger when safe',
        detail: 'Stop food intake, remove insect stinger, or exit contaminated environment.'
      },
      {
        id: 'alg-2',
        number: 2,
        text: 'Alert emergency medical services for serious symptoms',
        detail: 'Dial 112 at first sign of airway constriction, facial swelling, or dizziness.'
      },
      {
        id: 'alg-3',
        number: 3,
        text: 'Follow the person\'s existing prescribed emergency plan',
        detail: 'Assist with epinephrine auto-injector into outer thigh if authorized and available.'
      },
      {
        id: 'alg-4',
        number: 4,
        text: 'Do not invent medication instructions',
        detail: 'Only use prescribed emergency auto-injectors or antihistamines per official medical guidance.'
      },
      {
        id: 'alg-5',
        number: 5,
        text: 'Monitor airway continuously',
        detail: 'Be prepared to perform CPR if victim loses consciousness and stops breathing.'
      }
    ]
  },
  {
    id: 'proto-collapse',
    category: 'Building Collapse',
    title: 'Structural Failure & Building Collapse Protocol',
    severity: 'Critical',
    summary: 'Emergency survival procedures during building collapse, tremor damage, or structural failure.',
    agencyToCall: 'SEMA',
    verificationStatus: 'ALERTNOW Predefined Verified Safety Standard',
    dosAndDonts: {
      do: [
        'Drop, Cover, and Hold On under heavy furniture if indoors',
        'Cover nose and mouth with cloth to protect against dust',
        'Tap on pipes or walls to attract search and rescue teams',
        'Evacuate via stairs when structural movement stops'
      ],
      dont: [
        'DO NOT use elevators under any circumstances',
        'DO NOT light matches or lighters due to potential gas leaks',
        'DO NOT scream continuously if trapped (conserves oxygen and limits dust inhalation)',
        'DO NOT re-enter compromised buildings'
      ]
    },
    steps: [
      {
        id: 'col-1',
        number: 1,
        text: 'Take immediate protective cover',
        detail: 'Seek shelter under a sturdy table, desk, or adjacent to an interior load-bearing column.'
      },
      {
        id: 'col-2',
        number: 2,
        text: 'Protect breathing airways',
        detail: 'Cover mouth and nose with shirt or cloth to filter airborne concrete dust.'
      },
      {
        id: 'col-3',
        number: 3,
        text: 'Alert SEMA / NEMA Disaster Response (112)',
        detail: 'Call 112 or NEMA disaster line (080022556362) with your GPS coordinates.'
      },
      {
        id: 'col-4',
        number: 4,
        text: 'Signal search teams if trapped',
        detail: 'Tap rhythmically on metal pipes, beams, or concrete walls to guide acoustic search gear.'
      },
      {
        id: 'col-5',
        number: 5,
        text: 'Evacuate cautiously to open ground',
        detail: 'Watch for falling debris, exposed electrical wires, and gas leaks outside.'
      }
    ]
  },
  {
    id: 'proto-robbery',
    category: 'Armed Robbery',
    title: 'Armed Security Threat Protocol',
    severity: 'Critical',
    summary: 'Safety steps for active armed robbery, home invasion, or violent security threat.',
    agencyToCall: 'Police',
    verificationStatus: 'ALERTNOW Predefined Verified Safety Standard',
    dosAndDonts: {
      do: [
        'Remain calm and keep hands visible at all times',
        'Comply with instructions without argument',
        'Observe details (height, clothing, weapons, getaway car)',
        'Alert Police Control Desk (112 / NPF) as soon as safe'
      ],
      dont: [
        'DO NOT make sudden movements or gestures',
        'DO NOT attempt to disarm armed assailants',
        'DO NOT stare directly at perpetrators in a hostile manner',
        'DO NOT chase fleeing armed suspects'
      ]
    },
    steps: [
      {
        id: 'rob-1',
        number: 1,
        text: 'Ensure personal safety first',
        detail: 'Prioritize physical safety over property. Keep calm and avoid sudden movements.'
      },
      {
        id: 'rob-2',
        number: 2,
        text: 'Follow robber instructions quietly',
        detail: 'Do not fight, argue, or make sudden gestures that could trigger violence.'
      },
      {
        id: 'rob-3',
        number: 3,
        text: 'Observe suspect details silently',
        detail: 'Note physical features, accents, clothing, weapons, and direction of escape.'
      },
      {
        id: 'rob-4',
        number: 4,
        text: 'Alert Police Control Room immediately once safe',
        detail: 'Call 112 or State Police Command line. Send automated ALERTNOW SOS if pre-set.'
      },
      {
        id: 'rob-5',
        number: 5,
        text: 'Preserve crime scene evidence',
        detail: 'Do not touch areas handled by intruders until police forensic teams arrive.'
      }
    ]
  },
  {
    id: 'proto-kidnap',
    category: 'Abduction / Kidnapping',
    title: 'Abduction & Security Threat Response Protocol',
    severity: 'Critical',
    summary: 'Emergency measures for suspected kidnapping, ambush, or abduction threat.',
    agencyToCall: 'Police',
    verificationStatus: 'ALERTNOW Predefined Verified Safety Standard',
    dosAndDonts: {
      do: [
        'Trigger ALERTNOW Silent SOS to dispatch location quietly',
        'Notify Police (112) immediately with last known GPS',
        'Preserve all incoming communications and demands',
        'Share verified vehicle registration details with authorities'
      ],
      dont: [
        'DO NOT post unverified kidnapping alerts on social media without police clearance',
        'DO NOT delete phone logs, SMS, or ransom messages',
        'DO NOT attempt solitary hostage rescue operations',
        'DO NOT pay ransom without consulting security agencies'
      ]
    },
    steps: [
      {
        id: 'kid-1',
        number: 1,
        text: 'Activate Silent SOS Location Sharing',
        detail: 'Trigger ALERTNOW discreet emergency beacon to transmit real-time coordinates.'
      },
      {
        id: 'kid-2',
        number: 2,
        text: 'Contact State Police Command Desk (112)',
        detail: 'Provide vehicle color, make, license plate, direction of travel, and time.'
      },
      {
        id: 'kid-3',
        number: 3,
        text: 'Secure victim profile & Medical ID',
        detail: 'Export ALERTNOW emergency medical QR code to share with security taskforces.'
      },
      {
        id: 'kid-4',
        number: 4,
        text: 'Preserve digital trail',
        detail: 'Keep all calls, texts, and location logs intact for law enforcement anti-kidnapping units.'
      }
    ]
  },
  {
    id: 'proto-snake',
    category: 'Snake Bite & Poisoning',
    title: 'Snake Bite & Toxic Exposure Protocol',
    severity: 'Critical',
    summary: 'First aid and emergency transport steps for venomous snake bites and chemical poisoning.',
    agencyToCall: 'Medical',
    verificationStatus: 'ALERTNOW Predefined Verified Safety Standard',
    dosAndDonts: {
      do: [
        'Keep victim calm and completely still to slow venom circulation',
        'Immobilize bitten limb at or slightly below heart level',
        'Remove rings, watches, and tight clothing before swelling',
        'Call 112 or NAFDAC Poison Control (08037885261)'
      ],
      dont: [
        'DO NOT cut the wound or try to suck out venom',
        'DO NOT apply tight tourniquets or arterial straps',
        'DO NOT apply ice or submerge limb in water',
        'DO NOT attempt to capture or kill the snake'
      ]
    },
    steps: [
      {
        id: 'snk-1',
        number: 1,
        text: 'Move victim to safety away from snake',
        detail: 'Retreat at least 5 meters. Keep victim still—movement speeds venom dispersal.'
      },
      {
        id: 'snk-2',
        number: 2,
        text: 'Call Emergency Medical Services (112 / Poison Control)',
        detail: 'Dial 112 or NAFDAC Poison Desk (08037885261) for antivenom hospital routing.'
      },
      {
        id: 'snk-3',
        number: 3,
        text: 'Immobilize limb and remove tight items',
        detail: 'Splint limb loosely. Remove rings, shoes, and tight bands before tissue swells.'
      },
      {
        id: 'snk-4',
        number: 4,
        text: 'Clean wound gently and cover loosely',
        detail: 'Wash with clean water. Cover with clean dry cloth. Note snake color/pattern if seen safely.'
      },
      {
        id: 'snk-5',
        number: 5,
        text: 'Transport urgently to hospital',
        detail: 'Keep victim lying flat during transport to hospital with verified antivenom stock.'
      }
    ]
  },
  {
    id: 'proto-asthma',
    category: 'Severe Asthma Attack',
    title: 'Acute Asthma Respiratory Protocol',
    severity: 'Critical',
    summary: 'Emergency guidance for severe asthma attacks and respiratory distress.',
    agencyToCall: 'Medical',
    verificationStatus: 'ALERTNOW Predefined Verified Safety Standard',
    dosAndDonts: {
      do: [
        'Sit victim upright comfortably—do not let them lie down',
        'Assist with quick-relief reliever inhaler (Salbutamol/Ventolin)',
        'Administer 1 puff every 30-60 seconds up to 10 puffs',
        'Call 112 immediately if symptoms fail to improve after 4 minutes'
      ],
      dont: [
        'DO NOT allow victim to lie down flat',
        'DO NOT crowd around victim—ensure open airflow',
        'DO NOT use preventer inhalers during acute attack',
        'DO NOT wait if victim cannot speak full words or lips turn blue'
      ]
    },
    steps: [
      {
        id: 'ast-1',
        number: 1,
        text: 'Sit person upright immediately',
        detail: 'Position sitting upright leaning slightly forward to maximize lung expansion.'
      },
      {
        id: 'ast-2',
        number: 2,
        text: 'Assist with reliever inhaler',
        detail: 'Give 1 puff of reliever inhaler (blue) every 30-60 seconds up to 10 puffs total.'
      },
      {
        id: 'ast-3',
        number: 3,
        text: 'Call 112 if no improvement',
        detail: 'Dial 112 immediately if person cannot talk, is exhausted, or lips turn blue.'
      },
      {
        id: 'ast-4',
        number: 4,
        text: 'Repeat inhaler doses while waiting',
        detail: 'If ambulance takes over 15 minutes, repeat inhaler protocol after 15 minutes.'
      }
    ]
  },
  {
    id: 'proto-electric',
    category: 'Electric Shock',
    title: 'High-Voltage Electric Shock Protocol',
    severity: 'Critical',
    summary: 'Safety steps for electrical contact, powerline incidents, and electrocution.',
    agencyToCall: 'Fire',
    verificationStatus: 'ALERTNOW Predefined Verified Safety Standard',
    dosAndDonts: {
      do: [
        'Turn off power source at breaker before touching victim',
        'Use dry wood or non-conductive object to push live wire away if breaker unreachable',
        'Call 112 / Federal Fire Service immediately',
        'Perform CPR if victim is non-responsive and not breathing'
      ],
      dont: [
        'DO NOT touch victim while they are still in contact with electrical current',
        'DO NOT use metal or damp objects near live electricity',
        'DO NOT approach high-voltage downed powerlines (stay at least 10 meters back)',
        'DO NOT apply ice to electrical burn entry/exit wounds'
      ]
    },
    steps: [
      {
        id: 'elec-1',
        number: 1,
        text: 'Disconnect power source safely',
        detail: 'Shut off main breaker. If impossible, push live cord away using dry wooden broom handle.'
      },
      {
        id: 'elec-2',
        number: 2,
        text: 'Call 112 / Fire Service',
        detail: 'Call 112 or Federal Fire Service (08032003557) for high-voltage emergencies.'
      },
      {
        id: 'elec-3',
        number: 3,
        text: 'Check victim breathing and pulse',
        detail: 'Once disconnected, check airway. Begin CPR immediately if victim is unresponsive.'
      },
      {
        id: 'elec-4',
        number: 4,
        text: 'Treat electrical burn wounds',
        detail: 'Cover entry/exit burn sites with clean dry sterile dressings until medical crew arrives.'
      }
    ]
  },
  {
    id: 'proto-flood',
    category: 'Flooding & Disaster',
    title: 'Flood & Inundation Emergency Protocol',
    severity: 'High',
    summary: 'Safety measures during flash floods, river overflows, and natural disasters.',
    agencyToCall: 'SEMA',
    verificationStatus: 'ALERTNOW Predefined Verified Safety Standard',
    dosAndDonts: {
      do: [
        'Move to higher ground immediately',
        'Turn off main electricity switch and gas valves before evacuating',
        'Call SEMA / NEMA Disaster Desk (112 / 080022556362)',
        'Carry emergency medical ID, essentials, and water'
      ],
      dont: [
        'DO NOT walk, swim, or drive through moving floodwaters',
        'DO NOT touch electrical equipment in flooded areas',
        'DO NOT consume floodwater or unsealed food that contacted floodwater',
        'DO NOT cross flooded bridges'
      ]
    },
    steps: [
      {
        id: 'fld-1',
        number: 1,
        text: 'Move to higher ground immediately',
        detail: 'Evacuate low-lying areas before floodwaters cut off escape routes.'
      },
      {
        id: 'fld-2',
        number: 2,
        text: 'Shut off power and utilities',
        detail: 'Disconnect main electrical switch if dry and safe to prevent electrocution.'
      },
      {
        id: 'fld-3',
        number: 3,
        text: 'Contact SEMA / NEMA Disaster Line (112)',
        detail: 'Report location and stranded residents to state disaster management agency.'
      },
      {
        id: 'fld-4',
        number: 4,
        text: 'Avoid moving water hazard',
        detail: '6 inches of fast-moving water can knock you down; 2 feet can float a car.'
      }
    ]
  }
];

export function getProtocolForCategory(categoryOrKeyword: string): EmergencyProtocol {
  const query = categoryOrKeyword.toLowerCase().trim();
  
  const exactMatch = emergencyProtocols.find(p => 
    p.category.toLowerCase() === query || p.id.toLowerCase() === query
  );
  if (exactMatch) return exactMatch;

  const partialMatch = emergencyProtocols.find(p => 
    p.category.toLowerCase().includes(query) ||
    p.title.toLowerCase().includes(query) ||
    p.summary.toLowerCase().includes(query) ||
    p.steps.some(s => s.text.toLowerCase().includes(query))
  );

  return partialMatch || emergencyProtocols[0];
}
