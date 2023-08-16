// storage.js
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { readAndCompressImage } from 'browser-image-resizer';
import { storage } from './firebase-config';
import { uploadPhotoMetadata } from './firestore';

export const uploadImage = async (file, userId, monthIndex) => {
  try {
    const resizedImage = await readAndCompressImage(file, {
      quality: 0.9,
      maxWidth: 1080,
    });

    const storageRef = ref(storage, `users/${userId}/${monthIndex}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, resizedImage);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed', () => {}, reject, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          uploadPhotoMetadata(userId, monthIndex, downloadUrl).then(() => {
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
