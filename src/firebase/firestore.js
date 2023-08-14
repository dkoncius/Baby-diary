import { doc, setDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase-config';

export const createUserInFirestore = async (userId) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    // any initial data you want to set for the user
  });
};

export const uploadPhotoMetadata = async (userId, imageUrl) => {
  const photosRef = collection(db, 'users', userId, 'photos');
  await addDoc(photosRef, {
    imageUrl,
    timestamp: new Date(),
  });
};

export const getUserPhotos = async (userId) => {
  const photosRef = collection(db, 'users', userId, 'photos');
  const snapshot = await getDocs(photosRef);
  return snapshot.docs.map(doc => doc.data().imageUrl);
};



// New function to get month photos
export const getMonthPhotos = getUserPhotos; // Same functionality as getUserPhotos, but with a more descriptive name
