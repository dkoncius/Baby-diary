// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, collection, query, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase-config';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hasKids, setHasKids] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);

      if (user) {
        const hasKids = await checkIfUserHasKids(user.uid);
        setHasKids(hasKids);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkIfUserHasKids = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const kidsCollection = collection(userDocRef, 'kids');
      const q = query(kidsCollection);
      const querySnapshot = await getDocs(q);

      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking if user has kids:', error);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ user, hasKids }}>
      {children}
    </UserContext.Provider>
  );
}
