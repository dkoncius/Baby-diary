import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PhotoUploadScreen = ({ onClose, monthIndex }) => {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [height, setHeight] = useState('');
  const [mood, setMood] = useState('');
  const [weight, setWeight] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleSubmit = () => {
    // Send these to the server or save them locally.
    console.log({
      photo,
      description,
      height,
      mood,
      weight,
    });
    navigate('/path-after-upload'); // Navigate after upload if needed
  };

  return (
    <div className="photo-upload-modal">
      <button onClick={onClose}>Close</button>
      <h2>Upload Photo for Month {monthIndex + 1}</h2>
      <input 
        type="file" 
        onChange={handlePhotoChange} 
        accept="image/*" 
      />

      <textarea 
        placeholder="Add a description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input 
        type="text" 
        placeholder="Height (cm)" 
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />

      <input 
        type="text" 
        placeholder="Mood (e.g. Happy, Sad)" 
        value={mood}
        onChange={(e) => setMood(e.target.value)}
      />

      <input 
        type="text" 
        placeholder="Weight (kg)" 
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <button onClick={handleSubmit}>Upload</button>
    </div>
  )
}
