// Months.jsx
import React, { useEffect, useState, useRef } from 'react';
import { handleFileUpload, fetchPhotos, getUserId } from '../utils/monthsUtils';
import { Month } from './Month';

export const Months = () => {
  const [photos, setPhotos] = useState(Array(12).fill(null));
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);
  const fileInputRef = useRef(null);

  const handleClick = (index) => {
    setSelectedMonthIndex(index);
    fileInputRef.current.click();
  };

  const fetchPhotosCallback = (userId) => {
    fetchPhotos(userId, setPhotos);
  };

  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      fetchPhotosCallback(userId);
    }
  }, []);

  return (
    <>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }}
             onChange={(e) => handleFileUpload(e.target.files[0], getUserId(), selectedMonthIndex, photos, setPhotos, fetchPhotosCallback)} />
      <div className="months-boxes">
        {Array.from({ length: 12 }, (_, i) => (
          <Month key={i} index={i} imageUrl={photos[i]} onClick={() => handleClick(i)} />
        ))}
      </div>
    </>
  );
};
