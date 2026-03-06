# PinkRoute

Full stack PWA for predictive menstrual emergency infrastructure.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env` and fill with Firebase/Google Maps credentials.
3. Run development server:
   ```bash
   npm run dev
   ```
4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## Firestore Rules
See `firestore.rules`.

## Sample Data
Imported in `src/sampleData.js`.

## Features
- Smart pad locator
- Emergency modes (pad, delivery, anonymous)
- Risk & preparedness scoring
- Health pattern monitoring
- Offline support & PWA
- Admin analytics dashboard
