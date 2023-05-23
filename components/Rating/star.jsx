import React, { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';

const StarRating = () => {
  const [rating, setRating] = useState(0);

  const handleRatingChange = (value) => {
    setRating(value);
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          className={`mr-1 focus:outline-none ${
            value <= rating ? 'text-yellow-500' : 'text-gray-400'
          }`}
          onClick={() => handleRatingChange(value)}
        >
          <AiFillStar className="h-8 w-8" />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
