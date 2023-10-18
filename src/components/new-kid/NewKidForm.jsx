import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ImageUploader from './ImageUploader';

const variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const NewKidForm = ({
  file,
  setFile,
  previewUrl,
  setPreviewUrl,
  isFocused,
  setIsFocused,
  kidData,
  handleInputChange,
  handleFormSubmit,
  goBackToFeed,
  handleImageChange
}) => {
  const canSubmit = file || previewUrl;


   // Load image from localStorage upon component mount.
   useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setPreviewUrl(savedImage);
    }
  }, []);

  return (
    <motion.form
      className="new-kid-form"
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
      onSubmit={handleFormSubmit}
    >
      <h1>Vaiko duomenys</h1>
      {/* Use the ImageUploader component here */}
      <ImageUploader previewUrl={previewUrl} handleImageChange={handleImageChange} />
      <input
        type="text"
        name="name"
        placeholder="Vardas Pavardė"
        value={kidData.name}
        onChange={handleInputChange}
        required
      />
      <input
        type={isFocused || kidData.birthDate ? 'date' : 'text'}
        name="birthDate"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleInputChange}
        value={kidData.birthDate || ''}
        placeholder="Gimimo data"
        className="date-input"
        required
      />
      <input
        type="number"
        name="height"
        step="any"
        min="0"
        placeholder="Ūgis (cm)"
        value={kidData.height}
        onChange={handleInputChange}
        required
      />
      <input
        type="number"
        name="weight"
        step="any"
        min="0"
        placeholder="Svoris (kg)"
        value={kidData.weight}
        onChange={handleInputChange}
        required
      />
       <button type="submit" disabled={!canSubmit}>
        IŠSAUGOTI
      </button>
      <button type="button" onClick={() => goBackToFeed()}>IŠEITI</button>
    </motion.form>
  );
};

export default NewKidForm;
