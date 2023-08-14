import React, { useRef } from 'react';
import { auth } from '../firebase/firebase-config';
import { uploadImage } from '../firebase/storage'; // Import uploadImage from firebase.js

export const Months = () => {
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    // Get the user ID
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (!userId) {
      console.error('No user ID found');
      return; // or handle this case however you'd like
    }

    if (file) {
      try {
        // Call the uploadImage function from firebase.js
        const downloadURL = await uploadImage(file, userId);
        console.log('File available at:', downloadURL);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
      <div className="months-boxes">
        {Array(20).fill().map((_, i) => (
          <div key={i} className="month-box" onClick={handleClick}>
            <i className="fa-solid fa-plus"></i>
          </div>
        ))}
      </div>
    </>
  );
};
