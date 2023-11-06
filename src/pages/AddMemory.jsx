import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storage, db } from '../firebase/firebase-config';
import { AddMemoryNav } from '../components/addMemory/AddMemoryNav';
import { FileUpload } from '../components/addMemory/FileUpload';
import { MetricsSection } from '../components/addMemory/MetricsSection';
import { DescriptionArea } from '../components/addMemory/DescriptionArea';

import { collection, doc, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { setDoc, getDoc } from 'firebase/firestore'; // Added getDoc for fetching kid's data

export const AddMemory = ({ user }) => {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState('');
  const [height, setHeight] = useState(null); // Initialize with null
  const [weight, setWeight] = useState(null); // Initialize with null

  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();
  const selectedKid = location.state ? location.state.selectedKid : null;

  const updateOriginalMetrics = async () => {
    const kidDocRef = doc(db, 'users', user.uid, 'kids', selectedKid.id);
    await setDoc(kidDocRef, {
      height: height,
      weight: weight
    }, { merge: true }); // This ensures only the height and weight fields are updated
  };
  


  useEffect(() => {
    // Fetch height and weight from Firestore when selectedKid changes
    const fetchKidData = async () => {
      if (selectedKid) {
        const kidDocRef = doc(db, 'users', user.uid, 'kids', selectedKid.id);
        const kidDocSnap = await getDoc(kidDocRef);
        
        if (kidDocSnap.exists()) {
          const kidData = kidDocSnap.data();
          console.log(kidData)
          if (kidData) {
            setHeight(kidData.height);
            setWeight(kidData.weight);
          }
        }
      }
    };

    fetchKidData();
  }, [selectedKid, user.uid]);

  const uploadMemory = async () => {
  // First, update the original height and weight
  await updateOriginalMetrics();

    if (!photo || !selectedKid) return;

    setIsUploading(true);
    setShowLoader(true);
    setProgress(1);

    // Generate a unique memory ID
    const memoryCollection = collection(db, 'users', user.uid, 'kids', selectedKid.id, 'memories');
    const memoryDoc = doc(memoryCollection);
    const memoryId = memoryDoc.id;

    // Upload to Cloud Storage
    const storageRef = ref(storage, `users/${user.uid}/kids/${selectedKid.name}/memories/${memoryId}/image1.jpg`);
    const uploadTask = uploadBytesResumable(storageRef, photo);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        setShowLoader(false);
        const progressNow = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressNow);
      },
      (error) => {
        console.error('Error uploading image:', error);
        setIsUploading(false);
      },
      async () => {
        const photoURL = await getDownloadURL(uploadTask.snapshot.ref);
        const memoryRef = doc(db, 'users', user.uid, 'kids', selectedKid.id, 'memories', memoryId);
        await setDoc(memoryRef, {
          description,
          mood,
          height,
          weight,
          images: [photoURL],
          date: new Date().toISOString().split('T')[0],
        });
        navigate('/feed', { state: { kidToFeed: selectedKid } });
        setIsUploading(false);
      }
    );
  };

  // Animation
  const variants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
  };

  const progressBarVariants = {
    initial: { scaleX: 0 },
    animate: { scaleX: progress / 100 },
  };

  return (
    <motion.div
      className="add-memory-section"
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      {showLoader ? (
        <div className="loader">Uploading...</div>
      ) : (
        <motion.div
          className="progress-bar"
          variants={progressBarVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5 }}
        ></motion.div>
      )}
      <AddMemoryNav newKidData={selectedKid} />
      <section className="add-memory-section">
        <FileUpload setPhoto={setPhoto} />
        <MetricsSection mood={mood} setMood={setMood} setHeight={setHeight} setWeight={setWeight} weight={weight} height={height} />
        <DescriptionArea description={description} setDescription={setDescription} />
        <button className="add-memory-button" onClick={uploadMemory} disabled={isUploading}>
          {isUploading ? 'Luktelkite...' : 'Išsaugoti'}
        </button>
      </section>
    </motion.div>
  );
};
