import { initializeApp } from 'firebase/app';
import { initializeAuth, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAuAd51BdOPbhbygt1LL359Y9LgE_rImQU",
  authDomain: "vsgo-a4ca8.firebaseapp.com",
  projectId: "vsgo-a4ca8",
  storageBucket: "vsgo-a4ca8.firebasestorage.app",
  messagingSenderId: "120061988197",
  appId: "1:120061988197:web:8320f153228b0502fb258c",
  measurementId: "G-V19V86907L"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize auth without persistence to avoid conflicts
let auth: any;
try {
  auth = initializeAuth(app);
} catch (error) {
  // If auth is already initialized, get the existing instance
  auth = getAuth(app);
}
export { auth };

// Initialize Firestore
export const db = getFirestore(app);

// Initialize anonymous auth for Firestore access
export const initializeFirebaseAuth = async () => {
  try {
    // Check if user is already signed in
    if (auth.currentUser) {
      console.log('User already signed in:', auth.currentUser.uid);
      return auth.currentUser;
    }
    
    // Try anonymous auth, if it fails, we'll continue without auth
    try {
      const userCredential = await signInAnonymously(auth);
      console.log('Firebase auth initialized successfully with anonymous user:', userCredential.user.uid);
      return userCredential.user;
    } catch (authError) {
      console.warn('Anonymous auth failed, continuing without auth:', authError);
      return null;
    }
  } catch (error) {
    console.error('Error initializing Firebase auth:', error);
    return null;
  }
};

// Development mode check
const isDevelopment = __DEV__;
if (isDevelopment) {
  console.log('Running in development mode');
} 