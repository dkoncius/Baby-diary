import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase-config';

export const createUserInFirestore = async (userId) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {});
};

export const uploadPhotoMetadata = async (userId, monthIndex, imageUrl) => {
  const monthRef = doc(db, 'users', userId, 'months', monthIndex.toString());
  await setDoc(monthRef, {
    index: monthIndex,
    imageUrl,
    timestamp: new Date(),
  });
};

export const getUserPhotos = async (userId) => {
  const monthsRef = collection(db, 'users', userId, 'months');
  const snapshot = await getDocs(monthsRef);
  const photos = Array(12).fill(null);
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.index !== undefined) {
      photos[data.index] = data.imageUrl;
    }
  });
  return photos;
};
