import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, checkIfUserHasKids } from '../firebase/firebase-config'

// Create a UserContext to provide user data to components
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hasKids, setHasKids] = useState(false);
  const [loading, setLoading] = useState(true);  // Set initially to true

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const hasKidsStatus = await checkIfUserHasKids(user.uid);
        setHasKids(hasKidsStatus);
      }

      setUser(user);
      setLoading(false);  // Set to false once everything is resolved
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, hasKids, loading, setUser, setHasKids }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUserContext = () => {
  return useContext(UserContext);
};