import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from "./components/auth/Login";
import Register from "./components/auth/Register";
import FeedPage from './pages/FeedPage';
import { Kids } from './components/kids/Kids';
import { UpdateKid } from './components/kids/UpdateKid';
import NewKid from './components/new-kid/NewKid';
import { AddMemory } from './pages/AddMemory';
import { fetchUser } from './components/redux/userThunks'; // Importing the fetchUser action

function App() {
   // Use dispatch from Redux to dispatch actions
   const dispatch = useDispatch();
  
   // Replace useState with useSelector to select state from the Redux store
   const user = useSelector(state => state.user.user);
   const hasKids = useSelector(state => state.user.hasKids);
   const isLoading = useSelector(state => state.user.isLoading);
 
   useEffect(() => {
    let unsubscribe;
  
    const fetchUserData = async () => {
      unsubscribe = await dispatch(fetchUser());
    };
  
    fetchUserData();
  
    // Cleanup logic
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [dispatch]);
  

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
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRouteWrapper component={Navigate} redirectTo="/login" to="/feed" replace />} />
          <Route path="/feed" element={<ProtectedRouteWrapper component={FeedPage} redirectTo="/login" />} />
          <Route path="/kids" element={<ProtectedRouteWrapper component={Kids} redirectTo="/login" />} />
          <Route path="/update-kid" element={<ProtectedRouteWrapper component={UpdateKid} redirectTo="/login" />} />
          <Route path="/new-kid" element={<ProtectedRouteWrapper component={NewKid} redirectTo="/login" />} />
          <Route path="/add-memory" element={<ProtectedRouteWrapper component={AddMemory} redirectTo="/login" />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
