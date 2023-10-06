import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';

export const newKidSubmit = async (e, user, kidId, file, kidData, setKidData, setHasKids, navigate) => {
    e.preventDefault();

    if (!file) {
        alert('Please select a file.');
        return;
    }

    try {
        const storage = getStorage();
        const storageRef = ref(storage, `users/${user.uid}/${kidId}/images/profile-image/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
            (snapshot) => {
                // Optional: Show progress during upload
            }, 
            (error) => {
                // Handle unsuccessful uploads
                console.error("Error uploading file: ", error);
            }, 
            async () => {
                // Handle successful uploads on complete
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                // Update the kidData state with the image URL
                setKidData(prevState => ({
                    ...prevState,
                    image: downloadURL,
                }));

                // Now save the kid data to Firestore
                const userId = user.uid;
                const kidsRef = collection(db, `users/${userId}/kids`);
                await addDoc(kidsRef, kidData);
                alert('Kid added successfully!');
                setHasKids(true);
                navigate('/feed');
            }
        );

    } catch (error) {
        console.error("Error: ", error);
    }
};
