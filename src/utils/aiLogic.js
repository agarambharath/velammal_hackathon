// Menstrual Risk Index Calculation
export const calculateRiskScore = (userData, locations, emergencyLogs) => {
  let riskScore = 0;
  const weights = {
    daysUntilPeriod: 0.25,
    distanceFromHome: 0.2,
    stockAvailability: 0.3,
    ruralFactor: 0.15,
    pastEmergencyUsage: 0.1
  };

  // 1. Days until next period (1-30 days)
  const daysUntilPeriod = userData.nextPeriodDate 
    ? Math.max(0, Math.ceil((new Date(userData.nextPeriodDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : 15;
  
  if (daysUntilPeriod <= 3) {
    riskScore += weights.daysUntilPeriod * 100;
  } else if (daysUntilPeriod <= 7) {
    riskScore += weights.daysUntilPeriod * 60;
  } else {
    riskScore += weights.daysUntilPeriod * 20;
  }

  // 2. Distance from home to nearest location
  const nearestLocation = findNearestLocation(userData.location, locations);
  const distanceKm = nearestLocation?.distance || 10;
  
  if (distanceKm > 5) {
    riskScore += weights.distanceFromHome * 100;
  } else if (distanceKm > 2) {
    riskScore += weights.distanceFromHome * 60;
  } else {
    riskScore += weights.distanceFromHome * 20;
  }

  // 3. Stock availability in area
  const stockedLocations = locations.filter(l => l.stock_status === 'available').length;
  const totalLocations = locations.length;
  const stockPercentage = totalLocations > 0 ? (stockedLocations / totalLocations) * 100 : 0;
  
  if (stockPercentage < 30) {
    riskScore += weights.stockAvailability * 100;
  } else if (stockPercentage < 60) {
    riskScore += weights.stockAvailability * 50;
  }

  // 4. Rural/Urban factor
  if (userData.areaType === 'rural') {
    riskScore += weights.ruralFactor * 100;
  }

  // 5. Past emergency usage
  const recentEmergencies = emergencyLogs.filter(log => {
    const daysAgo = (new Date() - log.timestamp.toDate()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 30;
  }).length;

  if (recentEmergencies > 3) {
    riskScore += weights.pastEmergencyUsage * 100;
  } else if (recentEmergencies > 1) {
    riskScore += weights.pastEmergencyUsage * 60;
  }

  return Math.min(100, Math.round(riskScore));
};

const findNearestLocation = (userLocation, locations) => {
  if (!userLocation || !locations.length) return null;
  
  return locations.reduce((nearest, location) => {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      location.lat,
      location.lng
    );
    
    if (!nearest || distance < nearest.distance) {
      return { ...location, distance };
    }
    return nearest;
  }, null);
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const getRiskLevel = (score) => {
  if (score >= 70) return { level: 'High Risk', color: 'red', icon: '⚠️' };
  if (score >= 40) return { level: 'Moderate Risk', color: 'yellow', icon: '⚡' };
  return { level: 'Low Risk', color: 'green', icon: '✅' };
};