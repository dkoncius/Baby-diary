import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { doc, collection, query, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase/firebase-config';
import LoginForm from "./components/auth/Login";
import Register from "./components/auth/Register";
import FeedPage from './pages/FeedPage';
import { Kids } from './components/kids/Kids';
import NewKid from './components/new-kid/NewKid';
import { AddMemory } from './components/feed/AddMemory';



function App() {
  const [user, setUser] = useState(null);
  const [hasKids, setHasKids] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);  // For managing loading state
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setIsLoading(true);  // Set loading to true when checking user data
      
      if (user) {
        const hasKids = await checkIfUserHasKids(user.uid);
        setHasKids(hasKids);
      }

      setIsAuthChecked(true);
      setIsLoading(false);  // Set loading to false after user data is checked
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
  
  function ProtectedRouteWrapper({ children, redirectTo }) {
    return (
      user 
        ? (hasKids ? children : <Navigate to="/new-kid" replace />)
        : <Navigate to={redirectTo} replace />
    );
  }
  

  return (
      <Router className="app">
        {isAuthChecked ? (
          <Routes>
            <Route path="/login" element={<LoginForm setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/" element={
              <ProtectedRouteWrapper redirectTo="/login">
                <Navigate to="/feed" replace />
              </ProtectedRouteWrapper>
            }/>
            <Route path="/feed" element={
              <ProtectedRouteWrapper redirectTo="/login">
                <FeedPage user={user} setUser={setUser} />
              </ProtectedRouteWrapper>
            }/>
            <Route path="/kids" element={
              <ProtectedRouteWrapper redirectTo="/login">
                <Kids user={user} setUser={setUser} />
              </ProtectedRouteWrapper>
            }/>
            <Route path="/new-kid" element={
              user 
                ? <NewKid user={user} setUser={setUser} setHasKids={setHasKids} />
                : <Navigate to="/login" replace />
            }/>
            <Route path="/add-memory" element={
              <ProtectedRouteWrapper redirectTo="/login">
                <AddMemory user={user} setUser={setUser} />
              </ProtectedRouteWrapper>
            }/>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <p>Loading...</p>
        )}
      </Router>
  );
}

export default App;
