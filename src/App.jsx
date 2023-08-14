// App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebase/firebase-config';
import Login from "./components/Login";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import { Footer } from "./components/Footer";
import { Months } from "./components/Months";

function App() {
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false); // add this line

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setIsAuthChecked(true);
    });
    // unsubscribe to the listener when unmounting
    return () => unsubscribe(); 
  }, []);
  


  return (
    <Router className="app">
      <Login user={user} setUser={setUser}/>
      <h1 className="title">Kūdikio dienoraštis</h1>
      {isAuthChecked && (
        <>
          <Routes>
            <Route path="/" element={
              <>
                {user && <Months/>}
              </>
            } />

            <Route path="/login" element={<LoginForm setUser={setUser} />} />
            <Route path="/signup" element={<SignUpForm setUser={setUser} />} />
          </Routes>

          {user && <Footer/>}
        </>
      )}
    </Router>
  );
}

export default App;
