import React from 'react';
import { Kid } from './Kid';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase-config';
import { deleteDoc, getFirestore, doc } from 'firebase/firestore';


export const KidsList = ({ user, kids, setKids }) => {
  const navigate = useNavigate();
  
  const handleAddKid = () => {
    navigate('/new-kid');
  };

  const deleteKid = async (kidId) => {
    try {
      // Assuming the user is logged in and their ID is available in some user object
      const kidRef = doc(db, 'users', user.uid, 'kids', kidId);
      await deleteDoc(kidRef);
      
      // Optionally: Remove the kid from local state to avoid refetching from DB
      setKids((prevKids) => prevKids.filter(k => k.id !== kidId));
    } catch (error) {
      console.error("Error deleting kid:", error);
    }
  };
  
  return (
    <section className='kids-container'>
      {kids.map((kid) => (
        <Kid key={kid.id} kid={kid} onDelete={deleteKid} />
        ))}
      <button className='new-kid-button' onClick={handleAddKid}>
        + Add Kid
      </button>
    </section>
  );
};
