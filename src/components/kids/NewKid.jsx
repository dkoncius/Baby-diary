// NewKid.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AiFillPlusCircle } from "react-icons/ai";
import { useLocalStorage } from '../../utils/localStorage';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { imageConfig, readAndCompressImage } from 'browser-image-resizer';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';  // This import is correct based on your config file



const variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const NewKid = ({user}) => {
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
   // Converts data URL to Blob
   const dataURLtoBlob = (dataurl) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }


  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

     // Validate Image
    if (!file && !previewUrl) {
      alert('Pasirinkite nuotrauką :)');
      return;
    }
  
    // Original newKidData
    const newKidData = {
      name: kidData.name,
      birthDate: kidData.birthDate,
      height: kidData.height,
      weight: kidData.weight,
      image: "profile-image" // Temporary placeholder
    };

    const imageConfig = {
      quality: 0.7,
      maxWidth: 800,
      maxHeight: 800,
      autoRotate: true,
      debug: true
    };
    
    
    // Assuming user is an object with a userId property
    const userId = user.uid;
  
    try {
     // If a file is selected for upload or if previewUrl exists...
    if (file || previewUrl) {
      let uploadFile;

      if (file) {
        uploadFile = file;
      } else if (previewUrl) {
        const imageBlob = dataURLtoBlob(previewUrl);
        uploadFile = new File([imageBlob], "filename.jpg", {type: imageBlob.type});
      } else {
        alert('No image file is selected for upload. Please choose an image.');
        return;
      }

       // Resize the image
       const resizedImage = await readAndCompressImage(uploadFile, imageConfig);
      
       // Firebase storage reference
       const storage = getStorage();
       const filePath = `users/${userId}/kids/${newKidData.name}/profile-image/${uploadFile.name}`;
       const storageRef = ref(storage, filePath);
 
       // Upload the resized image to Firebase storage
       await uploadBytes(storageRef, resizedImage);
       
       // Get download URL of uploaded file and update newKidData
       newKidData.image = await getDownloadURL(storageRef);
      
    }
  
      // Save newKidData to Firestore
      await setDoc(doc(db, 'users', userId, 'kids', newKidData.name), newKidData);
      console.log('Data and image saved successfully.');
      
      // Reset states and local storage
      setKidData({
        name: '',
        birthDate: '',
        height: '',
        weight: '',
        image: ''
      });
      setFile(null);
      setPreviewUrl(null);
      localStorage.removeItem("kidData");
      localStorage.removeItem('profileImage');
  
      // Navigate to /feed.
      navigate('/feed');
    } catch (error) {
      console.error('Error saving data or uploading image:', error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setKidData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  // utils/handleFileChange.js
  const handleFileChange = (e) => {
    console.log("submit")
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
          onSubmit={handleFormSubmit}
        >
        <h1>Vaiko duomenys</h1>
        <input
          id="file"
          type="file"
          name="image"
          placeholder="Profilio nuotrauka"
          onChange={handleFileChange}
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
