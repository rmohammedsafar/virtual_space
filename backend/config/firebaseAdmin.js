const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Try to load service account key from file, or use default application credentials (e.g., from env variables in production)
const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');

let app;

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized with service account key.');
  } else {
    // If no service account file exists, initialize without credential.
    // This expects GOOGLE_APPLICATION_CREDENTIALS to be set in the environment,
    // or it will fail when trying to verify tokens if not properly configured.
    console.warn('WARNING: firebase-service-account.json not found. Falling back to default credentials.');
    app = admin.initializeApp();
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

module.exports = admin;
