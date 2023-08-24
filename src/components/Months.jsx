import React, { useEffect, useState, useRef } from 'react';
import { handleFileUpload, fetchPhotos, getUserId } from '../utils/monthsUtils';
import { Month } from './Month';

export const Months = () => {
  const [photos, setPhotos] = useState(Array(12).fill(null));
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);

  const handleClickMonth = (index) => {
    if (photos[index]) {
      setSelectedImage(photos[index]); // Set the clicked image as the selected image
    } else {
      setSelectedMonthIndex(index);
      fileInputRef.current.click(); // Trigger the hidden file input
    }
  };

  const handleCloseSelectedImage = () => {
    setSelectedImage(null);
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
      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={e => handleFileUpload(e, selectedMonthIndex, setPhotos)}
      />
      {selectedImage && (
        <div className="expanded-image">
          <img src={selectedImage} alt="Selected Month" />
          <button onClick={handleCloseSelectedImage}>Close</button>
        </div>
      )}
      <div className="months-boxes">
        {Array.from({ length: 12 }, (_, i) => (
          <Month
            key={i}
            index={i}
            imageUrl={photos[i]}
            onClick={() => handleClickMonth(i)}
          />
        ))}
      </div>
    </>
  );
};
