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
          loader={({ src }) => src}
          src={item.avatar}
          alt={item.name}
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full object-cover border border-gray-300 dark:border-slate-600"
          loading="lazy"
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
