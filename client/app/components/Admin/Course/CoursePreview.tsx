import React, { FC } from "react";
import CoursePlayer from "../../../utils/CoursePlayer";
import { styles } from "@/app/styles/style";
import Ratings from "../../../utils/Ratings";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseData: any;
  handleCourseCreate: any;
  isEdit: boolean
};

const CoursePreview: FC<Props> = ({
  courseData,
  handleCourseCreate,
  active,
  setActive,
  isEdit
}) => {
  // Calculate discount
  const price = parseFloat(courseData?.price || "0");
  const estimatedPrice = parseFloat(courseData?.estimatedPrice || "0");

  const discountPercent =
    estimatedPrice > 0 && price < estimatedPrice
      ? Math.round(((estimatedPrice - price) / estimatedPrice) * 100)
      : 0;

  const createCourse = () => {
    handleCourseCreate();
  };

  return (
    <div className="w-[90%] m-auto py-5 mb-5">
      {/* Video Preview */}
      <div className="w-full relative">
        <div className="w-full mt-10">
          <CoursePlayer
            videoId={courseData?.demoUrl}
            title={courseData?.title}
          />
        </div>

        {/* Price Section */}
        <div className="flex items-baseline space-x-3">
          <h1 className="pt-5 text-[25px] font-bold text-gray-900 dark:text-white">
            {price === 0 ? "Free" : `₹${price}`}
          </h1>

          {courseData?.estimatedPrice && (
            <h5 className="text-[20px] mt-2 line-through opacity-70 text-gray-600 dark:text-gray-400">
              ₹{courseData?.estimatedPrice}
            </h5>
          )}

          {discountPercent > 0 && (
            <h4 className="pt-4 text-[22px] font-semibold text-green-600 dark:text-green-400">
              {discountPercent}% off
            </h4>
          )}
        </div>

        {/* Buy Now Button */}
        <div className="flex items-center">
          <div
            className={`${styles.button} !w-[150px] my-3 font-Poppins text-center ${price > 0 ? "!bg-crimson cursor-pointer" : "!bg-gray-500 cursor-not-allowed"
              }`}
          >
            Buy Now {price === 0 ? "Free" : `₹${price}`}
          </div>
        </div>

        {/* Discount Input + Apply Button */}
        <div className="flex items-center mt-4 space-x-3">
          <input
            type="text"
            placeholder="Discount code..."
            className="w-[160px] px-3 py-2 border border-gray-300 rounded-lg 
               text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
               dark:bg-gray-800 dark:border-gray-600 dark:text-white text-black"
          />
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium 
               transition hover:bg-blue-700 shadow"
          >
            Apply
          </button>
        </div>


        {/* Features List */}
        <ul className="list-disc list-inside space-y-1 mt-4 text-gray-800 dark:text-gray-300">
          <li>Source Code Included</li>
          <li>Full Lifetime Access</li>
          <li>Certificate of Completion</li>
          <li>Premium Support</li>
        </ul>

        {/* Course Title */}
        <div className="w-full mt-6 800px:pr-5">
          <h1 className="text-[25px] font-Poppins font-[600] text-gray-900 dark:text-white">
            {courseData?.name}
          </h1>

          {/* Ratings & Students */}
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center space-x-2">
              <Ratings rating={0} />
              <h5 className="text-gray-700 dark:text-gray-300">0 Reviews</h5>
            </div>
            <h5 className="text-gray-700 dark:text-gray-300">0 Students</h5>
          </div>

          <br />

          {/* What you will learn */}
          <h2 className="text-[25px] font-Poppins font-[600] text-gray-900 dark:text-white">
            What you will learn from this course?
          </h2>
        </div>

        {/* Benefits */}
        {courseData?.benefits?.map((item: any, index: number) => (
          <div className="w-full flex items-start py-2" key={index}>
            <div className="w-[20px] mr-2 flex-shrink-0">
              <IoCheckmarkDoneOutline size={20} className="text-green-500" />
            </div>
            <p className="pl-1 text-gray-800 dark:text-gray-300">
              {item.title}
            </p>
          </div>
        ))}
      </div>

      <br />
      <br />

      {/* Course description */}
      <div className="w-full">
        <h2 className="text-[25px] font-Poppins font-[600] text-gray-900 dark:text-white">
          Course Details
        </h2>
        <p className="text-[18px] mt-5 whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300">
          {courseData?.description}
        </p>
      </div>
      <div className="flex justify-between mt-8">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => setActive(active - 1)}
          className="px-5 py-2 rounded-xl font-medium bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 
               transition transform hover:scale-105 hover:bg-gray-300 dark:hover:bg-gray-600 shadow"
        >
          ← Previous
        </button>

        {/* Create Button */}
        <button
          onClick={createCourse}
          className="px-6 py-2 rounded-xl font-medium bg-blue-600 text-white 
               transition transform hover:scale-105 hover:bg-blue-700 shadow"
        >
          {isEdit ? "Update →" : "Create →"}
        </button>
      </div>
    </div>
  );
};

export default CoursePreview;