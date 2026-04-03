/**
 * Symptom Mapper for Health Assistant
 * Maps natural language user input to curated video categories.
 */

const symptomMap = {
  headache: ['head', 'pain', 'migraine', 'thalai', 'vali', 'head pain', 'stress', 'tension'],
  fever: ['fever', 'jwaram', 'hot', 'cold', 'flu', 'temperature', 'body heat', 'kasam'],
  back_pain: ['back', 'spine', 'back pain', 'naduvali', 'shoulder', 'sitting', 'posture', 'lower back'],
  emergency: ['urgent', 'emergency', 'heart attack', 'stroke', 'bleeding', 'accident']
};

/**
 * Maps a user input string to the most likely health category.
 * @param {string} input - User specified symptom.
 * @returns {string|null} - The matched category or null if unknown.
 */
export const mapSymptomToCategory = (input) => {
  if (!input) return null;
  const lowercaseInput = input.toLowerCase().trim();

  for (const [category, keywords] of Object.entries(symptomMap)) {
    if (keywords.some(keyword => lowercaseInput.includes(keyword))) {
      return category;
    }
  }

  return null;
};

export const getCategoryLabel = (category) => {
  const labels = {
    headache: 'Headache & Migraine',
    fever: 'Fever & Flu',
    back_pain: 'Back & Spines',
    emergency: 'Emergency First Aid'
  };
  return labels[category] || 'General Health';
};
