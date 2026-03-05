import { Timestamp } from 'firebase/firestore';

// Sample Locations
export const sampleLocations = [
  {
    name: "Sakhi Pharmacy",
    lat: 28.6139,
    lng: 77.2090,
    type: "pharmacy",
    stock_status: "available",
    verified_count: 12,
    last_updated: Timestamp.now(),
    safety_rating: 4.5,
    privacy_score: 4,
    added_by: "user123",
    active: true
  },
  {
    name: "Women's Health Center",
    lat: 28.6145,
    lng: 77.2100,
    type: "community",
    stock_status: "limited",
    verified_count: 8,
    last_updated: Timestamp.now(),
    safety_rating: 4.8,
    privacy_score: 5,
    added_by: "user456",
    active: true
  },
  {
    name: "Government School",
    lat: 28.6150,
    lng: 77.2085,
    type: "school",
    stock_status: "available",
    verified_count: 15,
    last_updated: Timestamp.now(),
    safety_rating: 4.2,
    privacy_score: 3,
    added_by: "user789",
    active: true
  }
];

// Sample Health Logs
export const sampleHealthLogs = [
  {
    user_id: "user123",
    symptom_type: "heavy_bleeding",
    severity_level: "high",
    date: Timestamp.fromDate(new Date('2024-01-15')),
    notes: "Very heavy flow, changing every 2 hours"
  },
  {
    user_id: "user123",
    symptom_type: "severe_cramps",
    severity_level: "high",
    date: Timestamp.fromDate(new Date('2024-01-15')),
    notes: "Pain score 8/10, took medication"
  }
];

// Sample Anonymous Requests
export const sampleAnonymousRequests = [
  {
    request_id: "AR_123456789",
    approximate_location: {
      lat: 28.6,
      lng: 77.2
    },
    status: "completed",
    assigned_volunteer: "volunteer123",
    timestamp: Timestamp.now(),
    help_type: "emergency_pads"
  }
];