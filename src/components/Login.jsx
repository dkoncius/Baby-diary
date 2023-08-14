import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase-config';
import { signOutUser } from '../firebase/auth';

const Login = ({ user, setUser }) => {
  const [emailVerified, setEmailVerified] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      setUser(user);
      setEmailVerified(user ? user.emailVerified : false);
    });

    return () => {
      unsubscribeAuth();
    };
  }, [setUser]);

  const handleSignOut = async () => {
    await signOutUser();
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <header>
      <div className="container">
        {user ? 
        <button onClick={handleSignOut}>Atsijungti</button> : 
        <button onClick={handleSignIn}>Prisijungti</button>}
      </div>
    </header>
  );
};

export default Login;
