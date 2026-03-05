// Preparedness Score Calculation
export const calculatePreparednessScore = (userData, locations, healthLogs) => {
  let score = 100;
  
  // Deductions based on various factors
  
  // 1. Stock at home
  if (!userData.hasStock || userData.stockCount < 5) {
    score -= 20;
  }
  
  // 2. Distance to nearest location
  const nearestDistance = userData.nearestLocationDistance || 5;
  if (nearestDistance > 3) {
    score -= 15;
  } else if (nearestDistance > 1) {
    score -= 5;
  }
  
  // 3. Regular cycle tracking
  if (!userData.tracksCycle) {
    score -= 10;
  }
  
  // 4. Emergency contacts set
  if (!userData.hasEmergencyContacts) {
    score -= 15;
  }
  
  // 5. Health pattern regularity
  const irregularCycles = healthLogs.filter(log => log.symptom_type === 'irregular_cycle').length;
  if (irregularCycles > 3) {
    score -= 20;
  }
  
  // 6. Area coverage
  const nearbyLocations = locations.filter(l => l.distance < 2).length;
  if (nearbyLocations === 0) {
    score -= 20;
  } else if (nearbyLocations < 3) {
    score -= 10;
  }
  
  return Math.max(0, Math.min(100, score));
};

export const getPreparednessStatus = (score) => {
  if (score >= 80) return { status: 'Safe', color: 'green', icon: '🛡️' };
  if (score >= 50) return { status: 'Moderate', color: 'yellow', icon: '⚠️' };
  return { status: 'High Risk', color: 'red', icon: '🚨' };
};

// Health Pattern Warning Detection
export const detectHealthPatterns = (healthLogs) => {
  const warnings = [];
  
  // Group logs by symptom type
  const symptomCounts = healthLogs.reduce((acc, log) => {
    acc[log.symptom_type] = (acc[log.symptom_type] || 0) + 1;
    return acc;
  }, {});
  
  // Check for concerning patterns
  if (symptomCounts['heavy_bleeding'] > 3) {
    warnings.push({
      type: 'heavy_bleeding',
      message: 'Frequent heavy bleeding detected',
      severity: 'high',
      suggestion: 'Consult a doctor to rule out underlying conditions'
    });
  }
  
  if (symptomCounts['severe_cramps'] > 5) {
    warnings.push({
      type: 'severe_cramps',
      message: 'Persistent severe cramps',
      severity: 'medium',
      suggestion: 'Consider tracking pain levels and consulting a gynecologist'
    });
  }
  
  // Check cycle irregularity
  const cycleLengths = healthLogs
    .filter(log => log.symptom_type === 'period_start')
    .map(log => log.date.toDate())
    .sort((a, b) => a - b);
  
  if (cycleLengths.length >= 3) {
    const intervals = [];
    for (let i = 1; i < cycleLengths.length; i++) {
      const days = (cycleLengths[i] - cycleLengths[i-1]) / (1000 * 60 * 60 * 24);
      intervals.push(days);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const hasIrregular = intervals.some(interval => Math.abs(interval - avgInterval) > 7);
    
    if (hasIrregular) {
      warnings.push({
        type: 'irregular_cycle',
        message: 'Irregular cycle pattern detected',
        severity: 'medium',
        suggestion: 'Track your cycle regularly and consult if pattern persists'
      });
    }
  }
  
  return warnings;
};