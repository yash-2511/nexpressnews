import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getMessaging, isSupported } from 'firebase/messaging';

// Check if Firebase credentials are properly configured
const isFirebaseConfigured = () => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return apiKey && 
         apiKey !== 'AIzaSyDummyKeyForDevelopment123456789012345' && 
         apiKey !== 'your_api_key_here' &&
         !apiKey.includes('dummy');
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if properly configured
let auth = null;
let googleProvider = null;
let messaging = null;

if (isFirebaseConfigured()) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    
    // Initialize messaging for push notifications (only in browser)
    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported) {
          messaging = getMessaging(app);
        }
      });
    }
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
  }
}

export { auth, googleProvider, messaging, isFirebaseConfigured };