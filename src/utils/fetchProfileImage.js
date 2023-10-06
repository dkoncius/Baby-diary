// utils.js
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export const fetchProfileImage = async (user, kidId, setPreviewUrl) => {
    const storage = getStorage();
    const imagePath = `users/${user.uid}/${kidId}/images/profile-image/profile-pic.jpg`;  // Adjust the path as needed
    const storageRef = ref(storage, imagePath);

    try {
        const url = await getDownloadURL(storageRef);
        setPreviewUrl(url);  // Set the image URL from Cloud Storage
    } catch (error) {
        console.error("Error fetching image from Cloud Storage: ", error);
        // If an error occurs (e.g., image does not exist), fall back to localStorage
        const localProfileImage = localStorage.getItem('profileImage');
        if (localProfileImage) {
            setPreviewUrl(localProfileImage);  // Set the image URL from localStorage
        }
    }
};
