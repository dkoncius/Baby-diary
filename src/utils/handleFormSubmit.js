import { urlToBlob } from "./urlToBlob";

export const handleFormSubmit = async (e, isSubmitting, setIsSubmitting) => {

    e.preventDefault();
    setIsSubmitting(true);
  
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

      navigate('/feed', { state: { kidToFeed: newKidData, refresh: true } });
      setIsSubmitting(false); 

    } catch (error) {
      console.error('Error saving data or uploading image:', error);
      // Optionally, you can provide a user-friendly error message here
      // to inform the user about the issue.
    }
  };