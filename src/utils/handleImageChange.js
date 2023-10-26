
export const handleImageChange = (e) => {
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