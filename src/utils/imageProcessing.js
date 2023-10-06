// utils/imageProcessing.js
import { useState } from 'react';

export const useResizedImage = (setPreviewUrl) => {
  const [file, setFile] = useState(null);

  const resizeImage = (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
        console.error('Selected file is not an image.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgElement = document.createElement("img");
      imgElement.src = event.target.result;

      imgElement.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 200;
        canvas.height = 200;
        ctx.drawImage(imgElement, 0, 0, 200, 200);

        canvas.toBlob((blob) => {
          const newFile = new File([blob], selectedFile.name, { type: "image/jpeg", lastModified: new Date() });
          setFile(newFile);
          const blobUrl = URL.createObjectURL(blob);
          localStorage.setItem('profileImage', blobUrl);
          setPreviewUrl(blobUrl);  // Now setPreviewUrl is passed as an argument
      }, "image/jpeg");
    };
    };
    reader.readAsDataURL(selectedFile);
  };

   return [file, resizeImage, setFile];
};
