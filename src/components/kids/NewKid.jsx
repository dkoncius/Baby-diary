// NewKid.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AiFillPlusCircle } from "react-icons/ai";
import { useLocalStorage } from '../../utils/localStorage';


const variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const NewKid = ({user, setHasKids}) => {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null);

  const [isFocused, setIsFocused] = useState(false);
  const [kidData, setKidData] = useLocalStorage('kidData', {
    name: '',
    birthDate: '',
    height: '',
    weight: '',
    image: ''
  });
  const navigate = useNavigate();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setKidData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };


  // utils/handleFileChange.js
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        localStorage.setItem('profileImage', dataUrl);
        setPreviewUrl(dataUrl);
        setFile(selectedFile);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      console.error('The selected file is not an image or no file was selected.');
    }
  };
  
  
  
  // Add this useEffect hook for cleanup
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]); // Depend on previewUrl so it cleans up old URLs when a new file is selected
  

  // Initialize profile image from localStorage
  useEffect(() => {
    const localKidData = JSON.parse(localStorage.getItem('kidData'));
    const localProfileImage = localStorage.getItem('profileImage');
    
    if (localKidData) {
      setKidData(localKidData);
    }
    if (localProfileImage) {
      setPreviewUrl(localProfileImage);
    }
  }, []);  // Empty dependency array ensures this useEffect runs once on component mount





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
          // onSubmit={(e) => newKidSubmit(e, user, kidId, file, kidData, setKidData, setHasKids, navigate)}
          required
        >
        <h1>Vaiko duomenys</h1>
        <input
          id="file"
          type="file"
          name="image"
          placeholder="Profilio nuotrauka"
          onChange={handleFileChange}  // Update to use local handleFileChange
          required
        />
        <label className='file-container' htmlFor="file">
            {previewUrl && (<img className="profile-image-preview" src={previewUrl} alt="Selected profile" />)}
            <AiFillPlusCircle className='icon'/>
        </label>
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
        <button type="button" onClick={() => goBackToFeed()}>IŠEITI</button>
      </motion.form>
    </div>
  );
};
