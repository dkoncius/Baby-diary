import React, { createContext, useState, useEffect, useContext } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useUserContext } from './UserContext';

export const KidContext = createContext();

export const KidProvider = ({ children }) => {
  const { user } = useUserContext();
  const [kidData, setKidData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKidData = async () => {
      setLoading(true);
      if (!user) {
        console.log('No user signed in');
        setLoading(false);
        return;
      }

      try {
        const db = getFirestore();
        const kidId = user.uid;
        const docRef = doc(db, 'users', user.uid, 'kids', kidId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setKidData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching kid data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKidData();
  }, [user]);


  return (
    <KidContext.Provider value={{ kidData, setKidData, loading }}>
      {children}
    </KidContext.Provider>
  );
};


export const useKidContext = () => {
  return useContext(KidContext);
};
