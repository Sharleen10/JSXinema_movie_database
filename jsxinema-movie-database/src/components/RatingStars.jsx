import React, { useState } from 'react';

const RatingStars = ({ value = 0, onChange, readonly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleMouseOver = (index) => {
    if (readonly) return;
    setHoverRating(index);
  };
  
  const handleMouseLeave = () => {
    setHoverRating(0);
  };
  
  const handleClick = (index) => {
    if (readonly) return;
    onChange(index);
  };
  
  return (
    <div 
      className="rating-stars"
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map(index => (
        <span
          key={index}
          className={`star ${(hoverRating || value) >= index ? 'filled' : ''}`}
          onMouseOver={() => handleMouseOver(index)}
          onClick={() => handleClick(index)}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStars;