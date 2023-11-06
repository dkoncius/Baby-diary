import React, { useState } from 'react';
import { SelectedImage } from './SelectedImage';
import { AnimatePresence } from 'framer-motion';

export const FeedImageGallery = ({ memories }) => {
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const changeImage = (increment) => {
    const newIndex = currentIndex + increment;

    if (newIndex >= 0 && newIndex < memories.length) {
      setSelectedMemory(memories[newIndex]);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="image-gallery">
      {memories.map((memory, index) => (
        <div key={index} className="memory-thumbnail" onClick={() => {
          setSelectedMemory(memory);
          setCurrentIndex(index);
        }}>
          <img src={memory.images[0]} alt={`Memory ${index}`} />
        </div>
      ))}

    <AnimatePresence>
      {selectedMemory && (
        <SelectedImage
          selectedMemory={selectedMemory}
          setSelectedMemory={setSelectedMemory}
          changeImage={changeImage}
          currentIndex={currentIndex}
          totalImages={memories.length}
        />
      )}
    </AnimatePresence>
    </div>
  );
};
