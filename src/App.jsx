import { useState, useEffect, createElement } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebase/firebase-config';
import Login from "./components/Login";
import LoginForm from "./components/LoginForm";
import Register from "./components/RegisterForm";
import { Footer } from "./components/Footer";
import { Feed } from "./components/Feed/Feed";
import { NewKid } from './components/NewKid';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false); 

  useEffect(() => {
    // Subscribe to user on mount
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user); // set user in state
      setIsAuthChecked(true); // set auth check flag to true
    });
    // Unsubscribe on cleanup
    return () => unsubscribe(); 
  }, []);

// Higher-order function to protect a component and redirect to "/login" if not authenticated
const protectedElement = (Component) => {
  return user ? <Component setUser={setUser} /> : <LoginForm setUser={setUser} />;
};

  return (
    <Router className="app">
      <Login user={user} setUser={setUser}/>
      {isAuthChecked && (
        <>
          <Routes>
            {/* Use protectedElement function to conditionally render Feed or LoginForm */}
            <Route path="/" element={protectedElement(Feed)} />
            <Route path="/login" element={<LoginForm setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/new-kid" element={<NewKid/>} />
          </Routes>
          {/* Conditionally render Footer if user exists */}
          {user && <Footer/>}
        </>
      )}
    </Router>
  );
}

export default App;
