import { uploadImage } from '../firebase/storage';
import { getUserPhotos } from '../firebase/firestore';
import { auth } from '../firebase/firebase-config';

export const handleFileUpload = async (file, userId, selectedMonthIndex, photos, setPhotos, fetchPhotosCallback) => {
    if (!userId) {
      console.error('No user ID found');
      return;
    }

    if (file) {
      try {
        const downloadURL = await uploadImage(file, userId, selectedMonthIndex);
        console.log('File available at:', downloadURL);

        if (selectedMonthIndex !== null) {
          const newPhotos = [...photos];
          newPhotos[selectedMonthIndex] = downloadURL;
          setPhotos(newPhotos);
        } else {
          fetchPhotosCallback(userId);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
};

export const fetchPhotos = async (userId, setPhotos) => {
  try {
    const userPhotos = await getUserPhotos(userId);
    setPhotos(userPhotos);
  } catch (error) {
    console.error('Error fetching photos:', error);
  }
};

export const getUserId = () => {
  return auth.currentUser ? auth.currentUser.uid : null;
};


export const handleFileChange = (e, userId, selectedMonthIndex, photos, setPhotos, fetchPhotos) => {
  if (e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileUpload(file, userId, selectedMonthIndex, photos, setPhotos, fetchPhotos);
  }
};

export const loadUserPhotos = (setPhotos) => {
  const userId = getUserId();
  if (userId) {
    fetchPhotos(userId, setPhotos);
  }
}
