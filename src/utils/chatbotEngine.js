/**
 * Advanced Chatbot Engine for DSU LifeLink
 * Handles intent detection, fuzzy matching, and multi-language support (Tamil + English).
 */

const intents = {
  BLOOD_REQUEST: {
    keywords: ['blood', 'blod', 'venum', 'blood request', 'need blood', 'ratham', 'ratha', 'group', 'emergency blood', 'blood needed'],
    response: "I can help you find a donor. Please enter the blood group and location. Do you want to create a blood request now?",
    action: '/search',
    suggestions: ['O+ Blood needed', 'A- Blood needed', 'Search nearby donors']
  },
  DONATE_BLOOD: {
    keywords: ['donate', 'donor', 'give blood', 'registration', 'panna', 'epdi', 'how to donate', 'acceptance', 'can i donate', 'safe to donate'],
    response: "Donating blood is safe and saves lives! Anyone healthy, over 18, and weighing more than 45kg can usually donate. Is it your first time?",
    action: '/donor',
    suggestions: ['Who can donate?', 'Donation safety tips', 'Register as donor']
  },
  FIRST_AID: {
    keywords: ['first aid', 'accident', 'injury', 'wound', 'burn', 'cut', 'bleeding', 'choking', 'fainted', 'cpr'],
    response: "I can guide you through first aid steps. For serious injuries, please visit a doctor immediately. What happened?",
    action: '/health',
    suggestions: ['Minor cut care', 'Burn first aid', 'Fainting help']
  },
  AMBULANCE: {
    keywords: ['ambulance', 'ambalance', 'vandi', 'vehicle', 'urgent transport', 'vanum', 'fast'],
    response: "I'll help you book an ambulance quickly. Please pick a nearby driver. Click 'Ambulance' below.",
    action: '/driver',
    suggestions: ['Book Ambulance', 'Nearby Hospitals']
  },
  EMERGENCY: {
    keywords: ['urgent', 'help', 'save', 'emergency', 'danger', 'apasathu', 'sos', 'medical emergency', 'accident', 'help me'],
    response: "EMERGENCY DETECTED! Use the SOS button now to alert nearby help and call an ambulance.",
    action: 'SOS_TRIGGER',
    isEmergency: true,
    suggestions: ['Call Ambulance', 'Send SOS', 'Nearby Hospital']
  },
  HEALTH_COMMON: {
    keywords: ['fever', 'cold', 'weakness', 'headache', 'body pain', 'cough', 'throat', 'stomach'],
    response: "For issues like fever or cold, ensure plenty of rest and hydration. If symptoms persist or feel serious, please visit a doctor.",
    action: '/health',
    suggestions: ['Fever care', 'Cold tips', 'Rest & Hydration']
  },
  PROFILE: {
    keywords: ['profile', 'account', 'my details', 'settings', 'ennoda', 'details', 'my info'],
    response: "You can manage your account and view your history in the Profile section.",
    action: '/profile'
  },
  CERTIFICATES: {
    keywords: ['certificate', 'certifcate', 'rewards', 'points', 'donated', 'achievement'],
    response: "Your achievements and certificates are safe in your profile. Want to see them?",
    action: '/profile/certificates'
  },
  HELP: {
    keywords: ['help', 'hi', 'hello', 'what', 'how', 'guide', 'vanakkam', 'epdi use', 'what is this', 'enna'],
    response: "Hello! I'm your LifeLink Assistant. I can help with blood requests, first aid, or booking an ambulance. What do you need?",
    action: '/'
  }
};

/**
 * Normalizes user input for matching.
 */
const normalize = (text) => {
  return text.toLowerCase().trim().replace(/[^\w\s\u0b80-\u0bff]/g, '');
};

/**
 * Simple fuzzy matching using keyword presence and scoring.
 */
export const detectIntent = (userInput) => {
  if (!userInput) return null;

  const input = normalize(userInput);
  const words = input.split(/\s+/);

  let bestIntent = null;
  let highestScore = 0;

  // 1. Check for Emergency First (Absolute Priority)
  for (const keyword of (intents.EMERGENCY?.keywords || [])) {
    if (input.includes(keyword)) {
      return intents.EMERGENCY;
    }
  }

  // 2. Score other intents
  for (const [key, intent] of Object.entries(intents)) {
    if (key === 'EMERGENCY') continue;

    let score = 0;
    const weight = intent.priority || 1;

    for (const keyword of intent.keywords) {
      if (input.includes(keyword)) {
        score += 3;
      }
      if (words.some(word => word === keyword)) {
        score += 2;
      }
    }

    const finalScore = score * weight;

    if (finalScore > highestScore) {
      highestScore = finalScore;
      bestIntent = intent;
    }
  }

  // Fallback to AI if score is low
  if (highestScore < 3) {
    return {
      response: "Checking with my AI core...",
      action: null,
      fallback: true
    };
  }

  return bestIntent;
};

export const getQuickReplies = () => [
  { label: 'Blood Request', action: '/search' },
  { label: 'Donate Blood', action: '/donor' },
  { label: 'Ambulance', action: '/driver' },
  { label: 'First Aid', action: '/health' },
  { label: 'Find Hospital', action: '/driver' }
];

