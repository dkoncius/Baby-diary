import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Re-introduce useDispatch
import { setKidsList } from '../redux/userActions'; // Import the action creator
import { useLocation } from 'react-router-dom';
import { KidsList } from './KidsList';
import { KidsNav } from './KidsNav';
import { collection, getDocs, query, doc, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';



export const Kids = () => {
   const user = useSelector(state => state.user);
  const dispatch = useDispatch(); // To dispatch actions;
  const location = useLocation(); 
  const [loading, setLoading] = useState(true);
  const [kids, setKids] = useState([]);
  const [kidData, setKidData] = useState(null)
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKids = async () => {
      try {
        if (!user) {
          return; 
        }

        const db = getFirestore(); // Make sure to initialize your Firestore
        const auth = getAuth(); // Only if you use Firebase Auth
        const currentUser = auth.currentUser; // Only if you use Firebase Auth
        
        const kidsRef = collection(doc(db, 'users', currentUser.uid), 'kids'); // Ensure you get the uid from Firebase Auth if you're using it
        const kidsQuery = query(kidsRef);
        const kidDocs = await getDocs(kidsQuery);

        const kidsData = kidDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setKids(kidsData);
      } catch (error) {
        console.error('Error fetching kids: ', error);
        setError('Failed to fetch kids data, please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchKids();
  }, [user]);


  
  useEffect(() => {
    if (location.state) {
      setKidData(location.state.selectedKid);
    } else {
      console.log("Kids component");
    }
  }, [user, location.state]);

  return (
    <>
      <KidsNav user={user} kidData={kidData} />
      {loading ? 'Loading...' : error ? error : <KidsList kids={kids} setKids={setKids} user={user} />}
    </>
  );
};
