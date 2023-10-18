import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, doc, collection, query, getDocs, limit, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { getAuth } from 'firebase/auth';
import { UpdateKidForm } from "./UpdateKidForm"


export const UpdateKid = ({user}) => {
    const [loading, setLoading] = useState(true);
    const [kidData, setKidData] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();  // Add this line

    useEffect(() => {
        const fetchFirstKid = async () => {

        try {
          if (!user) {
            return;
          }
    
          const db = getFirestore(); // Make sure to initialize your Firestore
          const auth = getAuth(); // Only if you use Firebase Auth
          const currentUser = auth.currentUser; // Only if you use Firebase Auth
    
          const kidsRef = collection(doc(db, 'users', currentUser.uid), 'kids'); // Ensure you get the uid from Firebase Auth if you're using it
          const kidsQuery = query(kidsRef, limit(1));  // Limit the query to retrieve only the first document
          const kidDocs = await getDocs(kidsQuery);
    
          if (!kidDocs.empty) {
            const firstKidData = { id: kidDocs.docs[0].id, ...kidDocs.docs[0].data() };  // Get data of the first kid
            console.log(firstKidData)
            setKidData(firstKidData)
          } else {
            console.log('No kids data found');
          }
        } catch (error) {
          console.error('Error fetching first kid: ', error);
          setError('Failed to fetch first kid data, please try again later.');
        } finally {
          setLoading(false);
        }
      };
      
      // Check if kidToEdit data is passed through location state
      if (location.state && location.state.kidToEdit) {
        setKidData(location.state.kidToEdit);  // Set kidData with kidToEdit data
        setLoading(false);  // Set loading to false as data is already available
      } else {
        fetchFirstKid();  // No kidToEdit data provided, fetch data from Firestore
      }
      }, [user, location.state])


    const goBackToKids = () => {
        navigate('/kids');
      };

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setKidData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile && selectedFile instanceof Blob && selectedFile.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
              const dataUrl = event.target.result;
              setKidData(prevData => ({
                  ...prevData,
                  image: dataUrl,  // Updating image data in kidData
              }));
          };
          reader.readAsDataURL(selectedFile);
      } else {
          console.error('The selected file is not a valid image or no file was selected.');
      }
  };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const db = getFirestore();
            const userRef = doc(db, 'users', user.uid, 'kids', kidData.id);
            await setDoc(userRef, kidData, { merge: true });
            console.log('Kid data updated successfully');
            goBackToKids();  // Navigate back to feed after successful update
        } catch (error) {
            console.error('Error updating kid data:', error);
        }
    };

    const deleteKid = async (kidId) => {
      try {
        const kidRef = doc(db, 'users', user.uid, 'kids', kidId);
        await deleteDoc(kidRef);
        // Navigate back to /kids with a state to signal the list to refresh
        navigate('/kids', { state: { lastDeletedKidId: kidId } });
      } catch (error) {
        console.error("Error deleting kid:", error);
      }
    };

    return (
      <div className="new-kid-form-container">
          <div className="new-kid-form-image"></div>
          {!loading && (
              <UpdateKidForm
                  kidData={kidData}
                  handleInputChange={handleInputChange}
                  handleFormSubmit={handleFormSubmit}
                  handleImageChange={handleImageChange}
                  deleteKid={deleteKid}
                  goBackToKids={goBackToKids}
              />
          )}
      </div>
  );
}
