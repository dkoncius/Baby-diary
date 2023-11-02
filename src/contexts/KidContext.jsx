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
  
      console.log("User from UserContext:", user); // Debug line
  
      if (!user) {
        console.log('No user signed in'); 
        setLoading(false);
        return;
      }
  
      try {
        const db = getFirestore(); 
        const kidId = user.uid; 
        console.log(`Looking for kidData at users/${user.uid}/kids/${kidId}`); // Debug line
        const docRef = doc(db, 'users', user.uid, 'kids', kidId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setKidData(docSnap.data());
        } else {
          console.log('No such document!'); 
        }
          } catch (error) {
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Firestore security rules:", error.serverResponse);

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
