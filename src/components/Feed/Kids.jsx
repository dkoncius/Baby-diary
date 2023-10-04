import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOutUser } from '../../firebase/auth';
import { collection, getDocs, query, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { differenceInYears, differenceInMonths, differenceInDays, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

export const Kids = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [kids, setKids] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKids = async () => {
      try {
        if (!user) {
          return; // Exit early if there's no user
        }
        const kidsRef = collection(doc(db, 'users', user.uid), 'kids');
        const kidsQuery = query(kidsRef);
        const kidDocs = await getDocs(kidsQuery);

        const kidsData = kidDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setKids(kidsData);
      } catch (error) {
        console.error('Error fetching kids: ', error);
        setError('Failed to fetch kids data, please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchKids();
  }, [user]);

  const calculateAge = (birthDate) => {
    const birthdate = parseISO(birthDate);
    const years = differenceInYears(new Date(), birthdate);
    const months = differenceInMonths(new Date(), birthdate) % 12;
    const days = differenceInDays(new Date(), birthdate) % 30; // Approximation
    return `${years} years ${months} months ${days} days old`;
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOutUser();
    } catch (error) {
      console.error('Error signing out: ', error);
    } finally {
      setLoading(false);
    }
  };

  const goBackToFeed = () => {
      navigate("/feed")
  }

  // Animation
  const variants = {
    hidden: { opacity: 0, x: 200 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
    <motion.section 
    className="kids-section"
    variants={variants}
    initial="hidden"
    animate="visible"
    transition={{ duration: 0.5 }}
    >
      <nav className='kids-nav'>
        <p className='logout' onClick={handleSignOut} disabled={loading}>
          Atsijungti
        </p>
        <p className='kids-nav-back-to-feed' onClick={goBackToFeed}>X</p>
      </nav>
      <section className='kids-container'>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            {kids.map((kid) => (
              <div className='kid' key={kid.id}>
                <img className='kid-image' src='/assets/profile-1.jpg' alt={`profile-of-${kid.name}`} />
                <div className='kid-data'>
                  <h2 className='kid-name'>{kid.name}</h2>
                  <p className='kid-birthday'>{kid.birthDate}</p>
                  <p className='kid-age'>{calculateAge(kid.birthDate)}</p>
                </div>
              </div>
            ))}
            <button className='new-kid-button' onClick={() => navigate('/new-kid')}>
              + Pridėti vaiką
            </button>
          </>
        )}
      </section>
    </motion.section>
    
    </>
  );
};
