import React, { useEffect, useState, useRef } from 'react';
import { fetchPhotos, getUserId, handleFileChange, loadUserPhotos  } from '../utils/monthsUtils';
import { Month } from './Month';

export const Months = () => {
  const [photos, setPhotos] = useState(Array(12).fill(null));
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);

  const handleClickMonth = (index) => {
    if (photos[index]) {
      setSelectedImage(photos[index]);
    } else {
      setSelectedMonthIndex(index);
      fileInputRef.current.click();
    }
  };

  const handleCloseSelectedImage = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    loadUserPhotos(setPhotos);
  }, []);

  return (
    <>
      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={e => handleFileChange(e, getUserId(), selectedMonthIndex, photos, setPhotos, fetchPhotos)}
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