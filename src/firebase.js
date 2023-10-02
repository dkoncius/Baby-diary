import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut, sendPasswordResetEmail, FacebookAuthProvider } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { readAndCompressImage } from 'browser-image-resizer';
import { doc, setDoc, getFirestore, collection, query, where, getDocs } from 'firebase/firestore';



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
const storage = getStorage(app); // Initialize storage instance
const db = getFirestore(app);

export { auth, storage }; // Export storage along with auth

export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Send verification email
    await sendEmailVerification(userCredential.user);

    // Create user document in Firestore
    await createUserInFirestore(userCredential.user.uid);

    return { user: userCredential.user };
  } catch (error) {
    return { error: error.message };
  }
};


export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    return { error: error.message };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: 'Password reset email sent!' };
  } catch (error) {
    return { error: error.message };
  }
};

export const uploadImage = async (file, userId) => {
  try {
    const resizedImage = await readAndCompressImage(file, {
      quality: 0.9,
      maxWidth: 1080,
    });

    const storageRef = ref(storage, `users/${userId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, resizedImage);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed', () => {}, reject, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          uploadPhotoMetadata(userId, downloadUrl).then(() => {
            resolve(downloadUrl);
          });
        });
      });
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};


export const uploadPhotoMetadata = async (userId, imageUrl) => {
  const photosRef = collection(db, 'users', userId, 'photos');
  await addDoc(photosRef, {
    imageUrl,
    timestamp: new Date(),
  });
};

export const createUserInFirestore = async (userId) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    // any initial data you want to set for the user
  });
};


export const getUserPhotos = async (userId) => {
  const photosRef = collection(db, 'users', userId, 'photos');
  const q = query(photosRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
};