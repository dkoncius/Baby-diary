import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore, doc, collection, query, getDocs } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_CUSTOM_API_KEY,
  authDomain: import.meta.env.VITE_APP_CUSTOM_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_CUSTOM_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_CUSTOM_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_CUSTOM_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_CUSTOM_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);


const checkIfUserHasKids = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const kidsCollection = collection(userDocRef, 'kids');
    const q = query(kidsCollection);
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if user has kids:', error);
    return false;
  }
}; 

export { auth, storage, db, checkIfUserHasKids };
