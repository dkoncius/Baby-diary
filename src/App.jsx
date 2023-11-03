import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { doc, collection, query, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase/firebase-config';
import LoginForm from "./components/auth/Login";
import Register from "./components/auth/Register";
import FeedPage from './pages/FeedPage';
import { Kids } from './components/kids/Kids';
import { UpdateKid } from './components/kids/UpdateKid';
import NewKid from './components/new-kid/NewKid';
import { AddMemory } from './pages/AddMemory';


function App() {
  const [user, setUser] = useState(null);
  const [hasKids, setHasKids] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const hasKidsStatus = await checkIfUserHasKids(user.uid);
        setHasKids(hasKidsStatus);
      }
      setIsLoading(false);
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
  
  

  function ProtectedRouteWrapper({ component: Component, redirectTo, ...props }) {
    if (isLoading) {
        return null; // or return a loading spinner/component
    }

    return (
        user 
            ? (hasKids ? <Component {...props} /> : <Navigate to="/new-kid" replace />)
            : <Navigate to={redirectTo} replace />
    );
}
  

return (
  <Router className="app">
    {isLoading ? (
      <p>Loading...</p>
    ) : (
      <Routes>
        <Route path="/login" element={<LoginForm setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/" element={<ProtectedRouteWrapper component={Navigate} redirectTo="/login" to="/feed" replace />} />
        <Route path="/feed" element={<ProtectedRouteWrapper component={FeedPage} redirectTo="/login" user={user} setUser={setUser} />} />
        <Route path="/kids" element={<ProtectedRouteWrapper component={Kids} redirectTo="/login" key={location.state?.lastDeletedKidId} user={user} setUser={setUser}  />} />
        <Route path="/update-kid" element={user ? <UpdateKid user={user} setUser={setUser} /> : <Navigate to="/login" replace />} />
        <Route path="/new-kid" element={user ? <NewKid user={user} setUser={setUser} setHasKids={setHasKids} /> : <Navigate to="/login" replace />} />
        <Route path="/add-memory" element={<ProtectedRouteWrapper component={AddMemory} redirectTo="/login" user={user} setUser={setUser} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )}
  </Router>
);
}

export default App;
