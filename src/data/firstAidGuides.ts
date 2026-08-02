import { FirstAidGuide } from '../types';

export const firstAidGuides: FirstAidGuide[] = [
  {
    id: 'cpr',
    title: 'CPR Protocol (Cardiopulmonary Resuscitation)',
    icon: 'heart_handshake',
    category: 'Life Support',
    steps: [
      'Check if the environment is safe for you and the victim.',
      'Check for responsiveness: Tap the shoulder and shout loudly, "Are you okay?"',
      'If unresponsive, look for breathing. If they are not breathing or only gasping, call Emergency Services (or shout for help) immediately.',
      'Place the heel of one hand in the center of the chest, and the other hand on top, interlocking fingers.',
      'Push hard and fast: Compress the chest 2 to 2.4 inches deep at a rate of 100 to 120 compressions per minute.',
      'Allow the chest to fully recoil after each compression.',
      'If trained, give 2 rescue breaths after every 30 chest compressions (30:2 ratio). If untrained, perform continuous Hands-Only CPR.'
    ],
    tips: [
      'Singing the beat of "Stayin Alive" by the Bee Gees matches the required 100-120 beats per minute.',
      'Minimize interruptions in chest compressions.'
    ],
    disclaimer: 'Always call emergency services before starting CPR if you are alone.'
  },
  {
    id: 'stroke',
    title: 'Stroke Recognition (FAST Protocol)',
    icon: 'brain',
    category: 'Neurological',
    steps: [
      'F - FACE DROOPING: Ask the person to smile. Does one side of the face droop or is it numb?',
      'A - ARM WEAKNESS: Ask the person to raise both arms. Does one arm drift downward or is one arm weak?',
      'S - SPEECH DIFFICULTY: Ask the person to repeat a simple sentence. Is their speech slurred or hard to understand?',
      'T - TIME TO CALL: If the person shows any of these symptoms, even if they go away, call emergency services immediately.',
      'Note the exact time symptoms first appeared.'
    ],
    tips: [
      'Do NOT give the person aspirin, food, or drink as they may have difficulty swallowing.',
      'Keep the person lying down on their side if they are breathing but unconscious.'
    ],
    disclaimer: 'Every minute counts. Do not wait to see if symptoms improve.'
  },
  {
    id: 'bleeding',
    title: 'Severe Bleeding Control',
    icon: 'droplet',
    category: 'Trauma',
    steps: [
      'Put on protective gloves if available.',
      'Expose the wound by removing or cutting away clothing.',
      'Apply direct, firm pressure to the wound with a clean cloth, sterile bandage, or gloved hand.',
      'Maintain continuous pressure for at least 5 minutes without checking the wound.',
      'If bleeding does not stop, add more cloths/dressings on top of the first one. Do NOT remove the original dressing.',
      'If direct pressure fails on a limb and bleeding is life-threatening, apply a tourniquet above the wound if trained.'
    ],
    tips: [
      'Elevate the injured area above the level of the heart if possible and safe.',
      'Keep the victim warm and calm to prevent shock.'
    ],
    disclaimer: 'Severe arterial bleeding can be fatal within minutes. Apply pressure immediately.'
  },
  {
    id: 'burns',
    title: 'Burns Treatment',
    icon: 'flame',
    category: 'Trauma',
    steps: [
      'Stop the burning process: Put out flames, disconnect power sources, or wash chemical agents away.',
      'Cool the burn immediately under cool running tap water for at least 10 to 20 minutes.',
      'Do NOT use ice, ice water, butter, oils, or ointments as these can trap heat and worsen the damage.',
      'Remove jewelry or tight clothing from the burned area before it starts to swell, but do NOT peel off stuck clothing.',
      'Cover the burn loosely with clean cling film, a clean plastic bag, or a sterile non-stick bandage.'
    ],
    tips: [
      'Never pop blisters as this increases the risk of infection.',
      'Seek immediate medical care for deep burns, chemical burns, or burns on the face, hands, or joints.'
    ],
    disclaimer: 'For major burns covering a large area, keep the patient warm to prevent hypothermia while waiting for help.'
  },
  {
    id: 'heart_attack',
    title: 'Heart Attack Protocol',
    icon: 'activity',
    category: 'Cardiovascular',
    steps: [
      'Recognize symptoms: Chest pain or pressure, shortness of breath, pain radiating to the jaw, neck, back, or arm.',
      'Call emergency services immediately. Do not drive yourself or the victim.',
      'Have the person sit down and rest in a comfortable position (such as a half-seated position on the floor).',
      'Loosen tight clothing around the neck and chest.',
      'If the patient has prescribed nitroglycerin, assist them in taking it.',
      'If the person is fully awake, alert, and not allergic to aspirin, have them chew and swallow an adult aspirin (325mg).'
    ],
    tips: [
      'Keep the person calm. Anxiety increases the workload of the heart.',
      'Prepare to start CPR if the person loses consciousness and stops breathing.'
    ],
    disclaimer: 'Time is muscle. Quick action saves lives in cardiac events.'
  }
];
