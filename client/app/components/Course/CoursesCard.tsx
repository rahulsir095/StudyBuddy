import Ratings from '@/app/utils/Ratings';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';
import { AiOutlineUnorderedList } from 'react-icons/ai';

import defaultThumbnail from '../../../public/assests/client-1.jpg';

interface Item { 
  _id:string;
  thumbnail:{
    url:string;
  };
  name:string;
  price:number;
  ratings:number;
  purchased:number;
  estimatedPrice:number;
  courseData:[];
}
type Props = {
  item: Item;
  isProfile?: boolean;
};

const CoursesCard: FC<Props> = ({ item, isProfile = false }) => {
  return (
    <Link
      href={!isProfile ? `/course/${item._id}` : `/course-access/${item._id}`}
    >
      <div className="w-full min-h-[38vh] bg-white dark:bg-[#0f172a] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 group cursor-pointer">
        {/* Thumbnail */}
        <div className="relative w-full h-[200px] overflow-hidden">
          <Image
            src={item?.thumbnail?.url || defaultThumbnail}
            alt={item?.name || 'Course Thumbnail'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Free / Paid Badge */}
          <div className="absolute top-3 left-3">
            {item.price === 0 ? (
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                Free
              </span>
            ) : (
              <span className="bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                Paid
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
            {item.name}
          </h2>

          {/* Ratings & Students */}
          <div className="w-full flex items-center justify-between pt-3">
            <Ratings rating={item.ratings} />
            {!isProfile && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.purchased} {item.purchased === 1 ? 'Student' : 'Students'}
              </span>
            )}
          </div>

          {/* Price & Lectures */}
          <div className="w-full flex items-center justify-between pt-4">
            <div className="flex items-end gap-2">
              {item.price === 0 ? (
                <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                  Free
                </span>
              ) : (
                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                  {item.price} ₹
                </span>
              )}
              {item.estimatedPrice && (
                <span className="text-sm line-through text-gray-500 dark:text-gray-400">
                  {item.estimatedPrice} ₹
                </span>
              )}
            </div>

            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <AiOutlineUnorderedList
                size={18}
                className="text-indigo-500 dark:text-indigo-400"
              />
              <span className="pl-2 text-sm">
                {item.courseData?.length || 0} Lectures
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CoursesCard;
