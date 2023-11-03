import React, { useState, useEffect } from 'react';
import { AiFillPlusCircle } from "react-icons/ai";
import { readAndCompressImage } from 'browser-image-resizer';  // Ensure you have this package installed.

export const FileUpload = ({ setPhoto }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setPreviewUrl(savedImage);
    }
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageConfig = {
        quality: 0.7,
        maxWidth: 1080,
        maxHeight: 1080,
        autoRotate: true,
        debug: true,
      };
      

      try {
        const resizedImage = await readAndCompressImage(file, imageConfig);
        const url = URL.createObjectURL(resizedImage);
        setPreviewUrl(url);  // Preview the resized image
        setPhoto(resizedImage);  // Pass the resized image up to the parent component
      } catch (error) {
        console.error("Error resizing the image:", error);
      }
    }
  };

  return (
    <>
      <input 
        id="file"
        type="file"
        onChange={handleImageChange}
      />
      <label 
      className="file" 
      htmlFor="file"
      style={{ backgroundImage: `url(${previewUrl})` }}
      >
      <AiFillPlusCircle className='icon' />
      </label>
    </>
  );
};

export default FileUpload;
