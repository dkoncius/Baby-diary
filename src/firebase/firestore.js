import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase-config';

export const createUserInFirestore = async (userId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      // You can add some default fields here if needed
      created: new Date(),
    });
  } catch (error) {
    console.error('Error creating user in Firestore:', error);
    throw error;
  }
};

export const uploadPhotoMetadata = async (userId, monthIndex, imageUrl) => {
  try {
    if (!userId || monthIndex === undefined || !imageUrl) {
      throw new Error('Invalid parameters for uploading photo metadata');
    }
    
    const monthRef = doc(db, 'users', userId, 'months', monthIndex.toString());
    await setDoc(monthRef, {
      index: monthIndex,
      imageUrl,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error uploading photo metadata:', error);
    throw error;
  }
};

export const getUserPhotos = async (userId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    
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
  } catch (error) {
    console.error('Error retrieving user photos:', error);
    throw error;
  }
};
