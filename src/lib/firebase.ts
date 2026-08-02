import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "valued-bindery-n71nt",
  appId: "1:656602075727:web:e3f78cc2a8785e6260503a",
  apiKey: "AIzaSyCcpGmwhuNTxVYOfA1VxHguQkPl_mPe5b4",
  authDomain: "valued-bindery-n71nt.firebaseapp.com",
  storageBucket: "valued-bindery-n71nt.firebasestorage.app",
  messagingSenderId: "656602075727"
};

// Initialize App
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Firestore with robust local caching for offline support
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
