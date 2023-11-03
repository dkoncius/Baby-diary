import React from 'react';

export const DescriptionArea = ({ description, setDescription }) => {
  return (
    <textarea
      placeholder="Add a description..."
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />
  );
};
