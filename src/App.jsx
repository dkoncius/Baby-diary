// App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebase/firebase-config';
import Login from "./components/Login";
import LoginForm from "./components/LoginForm";
import Register from "./components/RegisterForm";
import { Footer } from "./components/Footer";
import { Feed } from "./components/Feed/Feed";

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
      {isAuthChecked && (
        <>
          <Routes>
            <Route path="/" element={
              <>
                {user && <Feed/>}
              </>
            } />

            <Route path="/login" element={<LoginForm setUser={setUser} />} />
            <Route path="/signup" element={<Register setUser={setUser} />} />
          </Routes>

          {user && <Footer/>}
        </>
      )}
    </Router>
  );
}

export default App;
