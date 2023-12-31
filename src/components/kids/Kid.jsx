import React, { useCallback } from 'react';
import { FaBirthdayCake } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";
import { BsFillPencilFill } from "react-icons/bs";
import { BsTrash  } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { differenceInYears, differenceInMonths, differenceInDays, parseISO } from 'date-fns';

export const Kid = ({ kid}) => {
  const navigate = useNavigate();

  const calculateAge = useCallback((birthDate) => {
    const birthdate = parseISO(birthDate);
    const years = differenceInYears(new Date(), birthdate);
    const months = differenceInMonths(new Date(), birthdate) % 12;
    const days = differenceInDays(new Date(), birthdate) % 30; // Approximation
    return `${years} years, ${months} months, ${days} days`;
  }, []);

const handleEdit = (event) => {
  event.stopPropagation();
  navigate('/update-kid', { state: { kidToEdit: kid } });
};
  
const handleChangeKid = () => {
  navigate('/feed', { state: { kidToFeed: kid } });
};

  return (
    <div className='kid' key={kid.id} role="button" tabIndex={0} onClick={handleChangeKid}>
      <BsFillPencilFill className='edit' aria-hidden="true" onClick={(event) => handleEdit(event)}/>
      <img 
        className='kid-image' 
        src={kid.image || '/assets/profile-1.jpg'} 
        alt={`profile of ${kid.name}`} 
      />
      <div className='kid-data'>
        <h2 className='kid-name'>{kid.name}</h2>
        <p className='kid-birthday'>
          <FaBirthdayCake aria-hidden="true"/> 
          {kid.birthDate}
        </p>
        <p className='kid-age'>
          <GiSandsOfTime aria-hidden="true"/> 
          {calculateAge(kid.birthDate)}
        </p>
      </div>
    </div>
  );
};
