import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const deleteKid = async (userId, kidId) => {
    const db = firebase.firestore();
    const storage = firebase.storage();
    
    try {
      // Get kid and memories data
      const kidRef = db.collection('users').doc(userId).collection('kids').doc(kidId);
      const kidData = await kidRef.get();
  
      // 1a: Delete Images from Cloud Storage
      await storage.ref(kidData.data().profileImage).delete();
      
      const memoriesRef = kidRef.collection('memories');
      const memoriesData = await memoriesRef.get();
      
      for (const memory of memoriesData.docs) {
        for (const imagePath of memory.data().images) {
          await storage.ref(imagePath).delete();
        }
      }
  
      // 2a & 2b: Delete Data from Firestore (kid & memories)
      // Batch delete to ensure atomicity
      const batch = db.batch();
  
      // Deleting memories
      memoriesData.forEach((doc) => {
        batch.delete(memoriesRef.doc(doc.id));
      });
  
      // Deleting the kid
      batch.delete(kidRef);
      
      // Committing the batch
      await batch.commit();
      
      console.log('Kid and associated memories deleted successfully!');
      
    } catch (error) {
      console.error('Error deleting kid and associated memories: ', error);
    }
  };


const DeleteKidButton = ({ userId, kidId }) => {
  
  const handleDelete = async () => {
    // Here, you may want to add additional UI logic such as confirmation modals
    // to ensure the user wants to delete the kid and their associated data.
    if(window.confirm("Are you sure you want to delete this kid and all related memories?")) {
      await deleteKid(userId, kidId);
    }
  };
  
  return (
    <button onClick={handleDelete}>Delete Kid</button>
  );
};