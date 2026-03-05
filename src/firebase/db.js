import { 
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// Locations Collection
export const locationsRef = collection(db, 'locations');

export const addLocation = async (locationData) => {
  return await addDoc(locationsRef, {
    ...locationData,
    last_updated: Timestamp.now(),
    verified_count: 0,
    safety_rating: 0
  });
};

export const getNearbyLocations = async (lat, lng, radius = 5) => {
  // Simplified - in production use geohashing
  const q = query(locationsRef, where('active', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Emergency Logs
export const emergencyLogsRef = collection(db, 'emergency_logs');

export const createEmergencyLog = async (emergencyData) => {
  return await addDoc(emergencyLogsRef, {
    ...emergencyData,
    timestamp: Timestamp.now(),
    status: 'pending'
  });
};

// Anonymous Help Requests
export const anonymousRequestsRef = collection(db, 'anonymous_requests');

export const createAnonymousRequest = async (requestData) => {
  return await addDoc(anonymousRequestsRef, {
    ...requestData,
    timestamp: Timestamp.now(),
    status: 'open'
  });
};

// Health Logs
export const healthLogsRef = collection(db, 'health_logs');

export const addHealthLog = async (logData) => {
  return await addDoc(healthLogsRef, {
    ...logData,
    date: Timestamp.now()
  });
};