import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  getDocFromServer,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';
import { OrderHistoryItem } from '../types';

// Use the provisioned Firebase configuration
const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore (using custom databaseId if configured)
export const db = firebaseConfigData.firestoreDatabaseId && firebaseConfigData.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

// Test connection as required by Firebase skill
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection: client appears offline.');
      return false;
    }
    // Permission denied on 'test/connection' is expected since rules protect it
    return true;
  }
}

// Trigger initial connection test quietly
if (typeof window !== 'undefined') {
  testConnection().catch(() => {});
}

// Authentication helpers
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      // Sync user profile to Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          id: user.uid,
          displayName: user.displayName || 'Habibi Guest',
          email: user.email || '',
          photoURL: user.photoURL || '',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return user;
  } catch (error: any) {
    console.error('Google Sign-in failed:', error);
    throw error;
  }
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

// Firestore Order persistence helpers
export async function saveOrderToFirestore(userId: string, order: OrderHistoryItem): Promise<void> {
  try {
    const orderDocRef = doc(db, 'users', userId, 'orders', order.referenceId);
    await setDoc(orderDocRef, {
      ...order,
      userId,
      status: 'received',
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to save order to Firestore:', err);
    throw err;
  }
}

export function subscribeToUserOrders(
  userId: string,
  callback: (orders: OrderHistoryItem[]) => void
): () => void {
  const ordersRef = collection(db, 'users', userId, 'orders');
  const q = query(ordersRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const orders: OrderHistoryItem[] = [];
      snapshot.forEach((docSnap) => {
        orders.push(docSnap.data() as OrderHistoryItem);
      });
      callback(orders);
    },
    (error) => {
      console.error('Error fetching real-time user orders:', error);
    }
  );
}
