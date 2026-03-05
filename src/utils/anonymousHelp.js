// Anonymous Help System Logic
export const createAnonymousRequest = async (userLocation, db) => {
  const requestId = generateRequestId();
  const approximateLocation = {
    lat: Math.round(userLocation.lat * 10) / 10, // Round to ~11km accuracy
    lng: Math.round(userLocation.lng * 10) / 10
  };
  
  const request = {
    request_id: requestId,
    approximate_location: approximateLocation,
    status: 'open',
    timestamp: new Date(),
    volunteers_notified: []
  };
  
  // Store in Firestore
  const docRef = await db.collection('anonymous_requests').add(request);
  
  // Find nearby verified female volunteers
  const volunteers = await findNearbyVolunteers(approximateLocation, db);
  
  // Notify volunteers (implement push notifications)
  volunteers.forEach(volunteer => {
    sendNotification(volunteer, requestId);
  });
  
  return { requestId, docRef };
};

const generateRequestId = () => {
  return 'AR_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const findNearbyVolunteers = async (location, db) => {
  // Query volunteers within 5km radius
  const volunteers = await db.collection('users')
    .where('role', '==', 'volunteer')
    .where('gender', '==', 'female')
    .where('verified', '==', true)
    .get();
  
  return volunteers.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(vol => calculateDistance(
      location.lat,
      location.lng,
      vol.location.lat,
      vol.location.lng
    ) <= 5);
};

// Auto-delete conversation after completion
export const scheduleConversationDeletion = (requestId, db, hours = 24) => {
  setTimeout(async () => {
    const request = await db.collection('anonymous_requests').doc(requestId).get();
    if (request.exists && request.data().status === 'completed') {
      await db.collection('anonymous_requests').doc(requestId).delete();
      // Also delete associated messages
      const messages = await db.collection('messages')
        .where('requestId', '==', requestId)
        .get();
      
      messages.docs.forEach(doc => doc.ref.delete());
    }
  }, hours * 60 * 60 * 1000);
};