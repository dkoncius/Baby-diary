import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { KidsList } from './KidsList';
import { Nav } from './Nav';
import { collection, getDocs, query, doc, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const Kids = ({ user }) => {
  const location = useLocation(); 
  const [loading, setLoading] = useState(true);
  const [kids, setKids] = useState([]);
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

  return (
    <>
      <Nav user={user} />
      {loading ? 'Loading...' : error ? error : <KidsList kids={kids} setKids={setKids} user={user} />}
    </>
  );
};
