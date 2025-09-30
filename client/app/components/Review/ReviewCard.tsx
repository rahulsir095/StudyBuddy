import Ratings from '@/app/utils/Ratings';
import Image from 'next/image';
import React, { FC } from 'react';

type Props = {
  item: {
    name: string;
    avatar: string;
    profession: string;
    rating: number;
    comment: string;
  };
};

const ReviewCard: FC<Props> = ({ item }) => {
  return (
    <div className="w-full h-max bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-md p-5 transition hover:shadow-lg">
      
      {/* Top section with avatar + name */}
      <div className="flex items-center gap-4">
        <Image
          src={item.avatar}
          height={60}
          width={60}
          alt={item.name}
          className="rounded-full object-cover border border-gray-300 dark:border-slate-600"
        />
        <div>
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
            {item.name}
          </h5>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {item.profession}
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-3">
        <Ratings rating={item.rating} />
      </div>

      {/* Comment */}
      <div className="mt-4 bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg text-gray-800 dark:text-gray-200 font-family-poppins leading-relaxed">
        “{item.comment}”
      </div>
    </div>
  );
};

export default ReviewCard;
