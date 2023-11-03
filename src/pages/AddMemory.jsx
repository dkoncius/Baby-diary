import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storage, db } from '../firebase/firebase-config'; // Assuming you have firebase setup
import {AddMemoryNav} from '../components/addMemory/AddMemoryNav';
import {FileUpload} from '../components/addMemory/FileUpload';
import {MetricsSection} from '../components/addMemory/MetricsSection';
import {DescriptionArea} from '../components/addMemory/DescriptionArea';

import { collection, doc, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { setDoc } from 'firebase/firestore';


export const AddMemory = ({ user }) => {

  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState('');

  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();
  const selectedKid = location.state ? location.state.selectedKid : null;

  const uploadMemory = async () => {
    if (!photo || !selectedKid) return;

    setIsUploading(true);
    setShowLoader(true);
    setProgress(1);

    console.log("User ID:", user.id);
    console.log("Selected Kid ID:", selectedKid ? selectedKid.id : "Not available");

    // Generate a unique memory ID
    const memoryCollection = collection(db, 'users', user.uid, 'kids', selectedKid.id, 'memories');
    const memoryDoc = doc(memoryCollection); 
    const memoryId = memoryDoc.id;

    // Upload to Cloud Storage
    const storageRef = ref(storage, `users/${user.uid}/kids/${selectedKid.name}/memories/${memoryId}/image1.jpg`);
    const uploadTask = uploadBytesResumable(storageRef, photo);

    uploadTask.on('state_changed', 
        (snapshot) => {
            setShowLoader(false); // Hide the loader once the progress starts
            const progressNow = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progressNow);
        },
        (error) => {
            console.error('Error uploading image:', error);
            setIsUploading(false); // Error occurred, so update the upload status
        }, 
        async () => {
            const photoURL = await getDownloadURL(uploadTask.snapshot.ref);
            const memoryRef = doc(db, 'users', user.uid, 'kids', selectedKid.id, 'memories', memoryId);
            await setDoc(memoryRef, {
                description,
                mood,
                images: [photoURL],
                date: new Date().toISOString().split('T')[0]
            });
            navigate('/feed', { state: { kidToFeed: selectedKid} });
            setIsUploading(false); // End the upload process
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
    animate: { scaleX: progress / 100 }
  };

  return (
    <motion.div 
      className="add-memory-section"
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      {showLoader 
       ? <div className="loader">Uploading...</div> // This is the loader displayed immediately
       : <motion.div 
            className="progress-bar"
            variants={progressBarVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5 }}
          ></motion.div>
      }
      <AddMemoryNav newKidData={selectedKid} />
      <section className="add-memory-section">
        <FileUpload setPhoto={setPhoto} />
        <MetricsSection mood={mood} setMood={setMood} />
        <DescriptionArea description={description} setDescription={setDescription} />
        <button className='add-memory-button' onClick={uploadMemory} disabled={isUploading}>
          {isUploading ? 'Luktelkite...' : 'Išsaugoti'}
        </button>
      </section>
    </motion.div>
);


  
}
