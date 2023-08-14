import React, { useEffect, useState, useRef } from 'react';
import { auth } from '../firebase/firebase-config';
import { uploadImage } from '../firebase/storage';
import { getUserPhotos } from '../firebase/firestore';

export const Months = () => {
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!userId) {
      console.error('No user ID found');
      return;
    }

    if (file) {
      try {
        const downloadURL = await uploadImage(file, userId);
        console.log('File available at:', downloadURL);
        // Fetch photos again after upload
        fetchPhotos(userId);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const fetchPhotos = async (userId) => {
    try {
      const userPhotos = await getUserPhotos(userId);
      console.log('Fetched photos:', userPhotos); // Log retrieved photos
      setPhotos(userPhotos);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };
  

  useEffect(() => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (userId) {
      fetchPhotos(userId);
    }
  }, []);

  return (
    <>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
      <div className="months-boxes">
        {photos.map((photoUrl, i) => (
          <div key={i} className="month-box" onClick={handleClick}>
            <img src={photoUrl} alt={`Month ${i + 1}`} />
          </div>
        ))}
        {Array(20 - photos.length).fill().map((_, i) => (
          <div key={i + photos.length} className="month-box" onClick={handleClick}>
            <i className="fa-solid fa-plus"></i>
          </div>
        ))}
      </div>
    </>
  );
};
