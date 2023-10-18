import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ImageUploader from '../new-kid/ImageUploader';

export const UpdateKidForm = ({kidData, handleInputChange, handleFormSubmit,handleImageChange, goBackToKids, deleteKid }) => {
  const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleDelete = () => {
    if(window.confirm(`Ar tikrai norite ištrinti ${kidData.name}?`)) {
      deleteKid(kidData.id);
      goBackToKids();
    }
  };

  return (
        <motion.form
        className="new-kid-form"
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
        onSubmit={handleFormSubmit}  // Updated to use prop
    >
      <h1>Vaiko duomenys</h1>
      {/* Use the ImageUploader component here */}
      <ImageUploader previewUrl={kidData.image} handleImageChange={handleImageChange} />
      <input
          type="text"
          name="name"
          placeholder="Vardas Pavardė"
          value={kidData.name}
          onChange={handleInputChange}
          required
      />
      <input
        type="date"
        name="birthDate"
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
       <button type="submit">
        IŠSAUGOTI
      </button>
       <button type="button" className='delete' onClick={handleDelete}>
        IŠTRINTI
      </button>
      <button type="button" onClick={() => goBackToKids()}>IŠEITI</button>
    </motion.form>
  )
}
