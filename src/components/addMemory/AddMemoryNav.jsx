import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RxCross1 } from "react-icons/rx";

export const AddMemoryNav = ({newKidData}) => {
  const navigate = useNavigate();

  const goBackToFeed = () => {
    return navigate('/feed', { state: { kidToFeed: newKidData} });
  }
  
  return (
    <nav className="add-memory-nav">
      <h2>Pridėti prisiminimą</h2>
      <div className="icon" onClick={goBackToFeed}>
        <RxCross1/>
      </div>
    </nav>
  );
};
