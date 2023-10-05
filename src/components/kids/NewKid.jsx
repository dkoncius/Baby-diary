import React, { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';  // Ensure Firebase Config is Setup
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const NewKid = ({user, setHasKids}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [kidData, setKidData] = useState({
    name: '',
    birthDate: '',
    height: '',
    weight: '',
  });
  const navigate = useNavigate();  // Hook for navigation
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setKidData({
      ...kidData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = user.uid;
      const kidsRef = collection(db, `users/${userId}/kids`);
      await addDoc(kidsRef, kidData);
      alert('Kid added successfully!');
      setHasKids(true)
      navigate('/feed');
    } catch (error) {
      console.error("Error adding kid: ", error);
    }
  };

  const goBackToFeed = (e) => {
    navigate('/feed');
  }

  return (
    <div className="new-kid-form-container">
      <div className="new-kid-form-image"></div>
      <motion.form
        className="new-kid-form"
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        required
      >
        <h1>Vaiko duomenys</h1>
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
        <button type="submit">IŠSAUGOTI</button>
        <button type="button" onClick={() => goBackToFeed()}>GRĮŽTI</button>
      </motion.form>
    </div>
  );
};
