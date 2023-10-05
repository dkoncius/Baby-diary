// LoginForm.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase-config';
import { signOutUser, signInWithEmail, resetPassword } from '../../firebase/auth';
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const LoginForm = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [resetRequested, setResetRequested] = useState(false);

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
        setUser(user);
        navigate('/');
      }
    });
    return unsubscribe;
  }, [setUser, navigate]);

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
