import * as admin from 'firebase-admin';

// Check if Firebase is already initialized
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || 'fingenius-aad98';
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
      console.error('CRITICAL: Firebase Admin credentials missing in environment variables.');
      console.error('Please add FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY to .env.local');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        // Replace escaped newlines if they are passed in as single string from ENV
        privateKey: privateKey?.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://${projectId}.firebaseio.com`
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
