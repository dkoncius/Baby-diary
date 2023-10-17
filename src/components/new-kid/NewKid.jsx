import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import NewKidForm from './NewKidForm';
import { useLocalStorage } from '../../utils/localStorage';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {  readAndCompressImage } from 'browser-image-resizer';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';

const NewKid = ({ user }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [kidData, setKidData] = useLocalStorage('kidData', {
    name: '',
    birthDate: '',
    height: '',
    weight: '',
    image: '',
  });

  const navigate = useNavigate();

  const urlToBlob = async (url) => {
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
  
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error fetching image:', error.message); // Log the error message
      return null;
    }
  };
  
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const newKidData = {
      name: kidData.name,
      birthDate: kidData.birthDate,
      height: kidData.height,
      weight: kidData.weight,
      image: '', // No temporary placeholder
    };
  
    const imageConfig = {
      quality: 0.7,
      maxWidth: 800,
      maxHeight: 800,
      autoRotate: true,
      debug: true,
    };
  
    const userId = user.uid;
    const kidId = `${user.uid}-${Date.now()}`;
  
    try {
      if (file || previewUrl) {
        let uploadFile;
  
        if (file) {
          uploadFile = file;
        } else if (previewUrl) {
          const imageBlob = await urlToBlob(previewUrl);
          if (imageBlob) {
            uploadFile = new File([imageBlob], 'filename.jpg', {
              type: imageBlob.type,
            });
          } else {
            throw new Error('Image blob is null'); // Throw an error with a specific message
          }
        }
  
        const resizedImage = await readAndCompressImage(
          uploadFile,
          imageConfig
        );
  
        const storage = getStorage();
        const filePath = `users/${userId}/kids/${newKidData.name}/profile-image/${uploadFile.name}`;
        const storageRef = ref(storage, filePath);
  
        await uploadBytes(storageRef, resizedImage);
  
        newKidData.image = await getDownloadURL(storageRef);
      }
   
      await setDoc(
        doc(db, 'users', userId, 'kids', kidId),
        newKidData
      );
      console.log('Data and image saved successfully.');
  
      // Clear form data and local storage
      setKidData({
        name: '',
        birthDate: '',
        height: '',
        weight: '',
        image: '',
      });
      setFile(null);
      setPreviewUrl(null);
      localStorage.removeItem('kidData');
      localStorage.removeItem('profileImage');
  
      navigate('/feed');
    } catch (error) {
      console.error('Error saving data or uploading image:', error);
      // Optionally, you can provide a user-friendly error message here
      // to inform the user about the issue.
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setKidData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log('Selected file:', selectedFile);
  
    if (selectedFile && selectedFile instanceof Blob && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        localStorage.setItem('profileImage', dataUrl);
        setPreviewUrl(dataUrl);
        setFile(selectedFile);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      console.error('The selected file is not a valid image or no file was selected.');
    }
  };
  

  const goBackToFeed = () => {
    navigate('/feed');
  };

  useEffect(() => {
    const localKidData = JSON.parse(localStorage.getItem('kidData'));
    const localProfileImage = localStorage.getItem('profileImage');

    if (localKidData) {
      setKidData(localKidData);
    }
    if (localProfileImage) {
      setPreviewUrl(localProfileImage);
    }
  }, []);

  return (
    <div className="new-kid-form-container">
      <div className="new-kid-form-image"></div>
      <NewKidForm
        file={file}
        setFile={setFile}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        kidData={kidData}
        handleImageChange={handleImageChange}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        goBackToFeed={goBackToFeed}
      />
    </div>
  );
};

export default NewKid;
