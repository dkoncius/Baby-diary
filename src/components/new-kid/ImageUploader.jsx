import React from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';

const ImageUploader = ({ previewUrl, handleImageChange }) => {
  return (
    <>
      <input
          id="file"
          type="file"
          name="image"
          placeholder="Profilio nuotrauka"
          onChange={handleImageChange}
        />
        <label className='file-container' htmlFor="file">
            {previewUrl && (<img className="profile-image-preview" src={previewUrl} alt="Selected profile" />)}
            <AiFillPlusCircle className='icon'/>
        </label>
    </>
  );
};

export default ImageUploader;
