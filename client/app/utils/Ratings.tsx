import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

type Props = {
  rating: number; // e.g. 4.5
  size?: number;  // star size (default: 20)
};

const Ratings: React.FC<Props> = ({ rating, size = 20 }) => {
  const stars = [];

  // loop through 5 stars
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} size={size} className="text-yellow-400 cursor-pointer" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} size={size} className="text-yellow-400 cursor-pointer" />);
    } else {
      stars.push(<FaRegStar key={i} size={size} className="text-yellow-400 cursor-pointer" />);
    }
  }

  return <div className="flex items-center space-x-1">{stars}</div>;
};

export default Ratings;
