import React, { useEffect } from 'react';
import NewKidContainer from './NewKidContainer';

const NewKid = ({ user }) => {
  return (
    <div className="new-kid-form-container">
      <div className="new-kid-form-image"></div>
      <NewKidContainer user={user} />
    </div>
  );
};

export default NewKid;