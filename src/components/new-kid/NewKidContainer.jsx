import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import NewKidForm from './NewKidForm';
import ImageUploader from './ImageUploader';
import { useLocalStorage } from '../../utils/localStorage';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { imageConfig, readAndCompressImage } from 'browser-image-resizer';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';

const variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const NewKidContainer = ({ user }) => {
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
  const location = useLocation();
  const kidToEdit = location.state?.kidToEdit || null;

  const dataURLtoBlob = (dataurl) => {
    if (dataurl) {
      let arr = dataurl.split(',');
      if (arr.length >= 2) {
        let mime = arr[0].match(/:(.*?);/)[1];
        if (mime) {
          let bstr = atob(arr[1]);
          let n = bstr.length;
          let u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new Blob([u8arr], { type: mime });
        }
      }
    }
    return null;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Original newKidData
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
          uploadFile = new File([imageBlob], 'filename.jpg', {
            type: imageBlob.type,
          });
        }

        // Resize the image
        const resizedImage = await readAndCompressImage(
          uploadFile,
          imageConfig
        );

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
      await setDoc(
        doc(db, 'users', userId, 'kids', newKidData.name),
        newKidData
      );
      console.log('Data and image saved successfully.');

      // Reset states and local storage
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

  const goBackToFeed = () => {
    navigate('/feed');
  };

  useEffect(() => {
    // Initialize profile image from localStorage
    const localKidData = JSON.parse(localStorage.getItem('kidData'));
    const localProfileImage = localStorage.getItem('profileImage');

    if (localKidData) {
      setKidData(localKidData);
    }
    if (localProfileImage) {
      setPreviewUrl(localProfileImage);
    }
  }, []);

  useEffect(() => {
    // NEW useEffect hook for populating data of the kid to be edited
    if (kidToEdit) {
      setKidData(kidToEdit);
      setPreviewUrl(kidToEdit.image);
    }
  }, [kidToEdit]);

  return (
    <div className="new-kid-form-container">
      <div className="new-kid-form-image"></div>
      <NewKidForm
        file={file}
        setFile={setFile}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
        isFocused={isFocused}
        kidData={kidData}
        handleFileChange={handleFileChange}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        goBackToFeed={goBackToFeed}
      />
    </div>
  );
};

export default NewKidContainer;
