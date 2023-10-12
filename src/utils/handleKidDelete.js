import { getFirestore, doc, deleteDoc, collection, query, getDocs } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';

export const handleKidDelete = async (userId, kidId) => {
  const db = getFirestore();
  const storage = getStorage();

  try {
    // 1. Delete Images from Memories
    // Get all memory documents for the kid
    const memoriesQuery = query(collection(db, `users/${userId}/kids/${kidId}/memories`));
    const memorySnapshots = await getDocs(memoriesQuery);

    // Create a promise for each memory to delete its associated images
    const deleteMemoriesImagesPromises = memorySnapshots.docs.map(async (memoryDoc) => {
      const memoryData = memoryDoc.data();
      // Create a promise for each image to delete it from storage
      const deleteImagePromises = memoryData.images.map(imagePath => 
        deleteObject(ref(storage, imagePath))
      );
      // Wait for all image delete promises to resolve before moving to the next memory
      await Promise.all(deleteImagePromises);
    });
    // Wait for all memory image delete promises to resolve before moving to the next step
    await Promise.all(deleteMemoriesImagesPromises);

    // 2. Delete the Kid document from Firestore
    const kidRef = doc(db, `users/${userId}/kids/${kidId}`);
    await deleteDoc(kidRef);

    // 3. Delete the Kid's Profile Image from Cloud Storage
    // Ensure the path is correct according to your storage schema
    const kidProfileImageRef = ref(storage, `users/${userId}/${kidId}/profile-image/image.jpg`);
    await deleteObject(kidProfileImageRef);

    console.log('Kid and associated memories/images deleted successfully!');
  } catch (error) {
    console.error('Error deleting kid:', error);
  }
};
