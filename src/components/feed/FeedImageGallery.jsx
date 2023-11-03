import React, { useState } from 'react';

export const FeedImageGallery = ({ memories }) => {
  const [selectedMemory, setSelectedMemory] = useState(null);

  return (
    <div className="image-gallery">
      {memories.map((memory, index) => (
        <div key={index} className="memory-thumbnail" onClick={() => setSelectedMemory(memory)}>
          <img src={memory.images[0]} alt={`Memory ${index}`} /> {/* Assuming first image in the array is the thumbnail */}
        </div>
      ))}

      {selectedMemory && (
        <div className="expanded-memory">
          <img src={selectedMemory.images[0]} alt="Expanded memory" />
          <div className="memory-details">
            <p>Date: {new Date(selectedMemory.date).toLocaleDateString('lt-LT', { month: 'long', day: 'numeric' })}</p>
            <p>Height: {selectedMemory.height}</p>
            <p>Weight: {selectedMemory.weight}</p>
            <p>Mood: {selectedMemory.mood}</p>
            <p>Description: {selectedMemory.description}</p>
          </div>
          <button onClick={() => setSelectedMemory(null)}>Close</button>
        </div>
      )}
    </div>
  );
};