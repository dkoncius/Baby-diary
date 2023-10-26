import React from 'react';
import { Kid } from './Kid';
import { useNavigate } from 'react-router-dom';


export const KidsList = ({ kidData }) => {
  const navigate = useNavigate();

  const handleAddKid = () => {
    navigate('/new-kid');
  };
  
  return (
    <section className='kids-container'>
      {kidData.map((kid) => (
        <Kid key={kid.id} kid={kid} />
        ))}
      <button className='new-kid-button' onClick={handleAddKid}>
        + Add Kid
      </button>
    </section>
  );
};
