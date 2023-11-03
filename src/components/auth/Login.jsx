// LoginForm.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';  // Importing hooks from Redux
import { auth } from '../../firebase/firebase-config';
import { signOutUser, signInWithEmail, resetPassword } from '../../firebase/auth';
import { motion } from 'framer-motion';
import { setUser } from '../redux/userActions';  // Import the action from the split files


const variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetRequested, setResetRequested] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getErrorMessage = (firebaseError) => {
    switch (firebaseError) {
      case 'Firebase: Error (auth/wrong-password).':
        return 'Neteisingas slaptažodis';
      case 'Firebase: Error (auth/user-not-found).':
        return 'Vartotojas nerastas';
      default:
        return undefined;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user && user.emailVerified) {
        // Extract only the serializable properties you need
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          // ...any other properties you might need
        };
        dispatch(setUser(userData));  // Dispatch the serializable userData
        navigate('/');
      }
    });
    return () => unsubscribe();  // Cleanup function to unsubscribe
  }, [dispatch, navigate]);
  

  const handleSignIn = async (e) => {
    e.preventDefault();
    const response = await signInWithEmail(email, password);
    if (response.error) {
      setError(getErrorMessage(response.error));
      console.log(getErrorMessage(response.error))
      signOutUser();
    } else if (!auth.currentUser.emailVerified) {
      setError('Prašome patvirtinti paštą prieš prisijungiant.');
      signOutUser();
    } else {
      navigate('/'); 
    }
  };

  const handleResetPassword = async () => {
    const response = await resetPassword(email);
    if (response.success) {
      setResetRequested(true);
    } else {
      setError(response.error);
    }
  };

  return (
    <>
    <div className="login-form-image"></div>

    <motion.form
      onSubmit={handleSignIn}
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <h1>Prisijungimas</h1>
      <input type="email" placeholder="El. paštas" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Slaptažodis" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Prisijungti</button>
      
      {error === 'Neteisingas slaptažodis' && (
        <p className="userNotFound">
          {error}. <span onClick={handleResetPassword} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Pamiršote slaptažodį?</span>
        </p>
      )}
      {resetRequested && <p className="passwordReset">Slaptažodžio atstatymo nuoroda išsiųsta į {email}.</p>}
      {error && error !== 'Neteisingas slaptažodis' && <p className="userNotFound">{error}</p>}
      
      <p>Naujas vartotojas? <Link to="/register">Registruotis</Link></p>
    </motion.form>
    </>
   
  );
};

export default LoginForm;
