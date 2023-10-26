import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, checkIfUserHasKids } from '../firebase/firebase-config'
import { Navigate } from 'react-router-dom';

// Create a UserContext to provide user data to components
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hasKids, setHasKids] = useState(false);
  const [kidData, setKidData] = useState(null);  // Add these lines
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setLoading(true);

      if (user) {
        const hasKidsStatus = await checkIfUserHasKids(user.uid);
        setHasKids(hasKidsStatus);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, hasKids, loading, setUser, setHasKids, kidData, setKidData }}>
    {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};