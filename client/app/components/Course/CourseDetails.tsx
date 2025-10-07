"use client";
import React, { useState } from "react";
import { format } from "timeago.js";
import Ratings from "@/app/utils/Ratings";
import Link from "next/link";
import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import { PiCertificate } from "react-icons/pi";
import { TbSourceCode } from "react-icons/tb";
import {
  MdWatchLater,
  MdOutlineWorkspacePremium,
  MdCheckCircle,
} from "react-icons/md";
import { RiBook2Line } from "react-icons/ri";
import { IoCloseOutline } from "react-icons/io5";
import CourseContentList from "../Course/CourseContentList";
import Avatar from "../../../public/assests/avatar.png";

// Stripe
import { Elements } from "@stripe/react-stripe-js";
import CheckOutForm from "../Payment/CheckOutForm";
import { Appearance } from '@stripe/stripe-js';
import Image from "next/image";
import { VscVerifiedFilled } from "react-icons/vsc";
import { Stripe } from "@stripe/stripe-js";
interface Benefit {
  title: string;
}

interface Prerequisite {
  title: string;
}

interface Reply {
  _id: string;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    role: string;
    avatar?: {
      url: string;
    };
  };
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: {
      url: string;
    };
  };
  commentReplies: Reply[];
}

interface CourseVideo {
  _id: string;
  title: string;
  description: string;
  videoSection: string;
  videoLength?: number;
}

interface CourseData {
  _id: string;
  name: string;
  title?: string;
  description?: string;
  overview?: string;
  demoUrl?: string;
  price: number;
  estimatedPrice: number;
  purchased: number;
  ratings: number;
  benefits?: Benefit[];
  prerequisites?: Prerequisite[];
  courseData: CourseVideo[];
  reviews?: Review[];
}

interface UserCourse {
  courseId: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
  };
  courses?: UserCourse[];
}

interface CourseDetailsProps {
  data: CourseData;
  stripePromise: Promise<Stripe | null>;
  clientSecret: string;
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
  user: User | null;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({
  data,
  clientSecret,
  stripePromise,
  setOpen: openAuthModel,
  setRoute,
  user,
}) => {

  const [open, setOpen] = useState(false);
  const isDarkMode =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const appearance: Appearance = {
    theme: isDarkMode ? "night" : "stripe",
    variables: {
      colorBackground: isDarkMode ? "#0f172a" : "#ffffff",
      colorPrimaryText: isDarkMode ? "#ffffff" : "#0f172a",
      colorText: isDarkMode ? "#e5e7eb" : "#374151",
      colorDanger: "#f87171",
      fontFamily: "Poppins, sans-serif",
    },
  };


  const discountPercentage = data?.estimatedPrice
    ? (
      ((data.estimatedPrice - data.price) / data.estimatedPrice) *
      100
    ).toFixed(0)
    : 0;

  const isPurchased =
    user && user.courses?.some(
      (item: UserCourse) => item.courseId.toString() === data._id.toString()
    );

  const handleOrder = () => {
    if (user) {
      setOpen(true);

    } else {
      setRoute("Login");
      openAuthModel(true);
    }
  };

  return (
    <>
      {/* COURSE DETAILS */}
      <div className="w-[90%] 800px:w-[85%] m-auto py-8 flex flex-col-reverse gap-10 lg:flex-row mt-[80px]">
        {/* LEFT SECTION */}
        <div className="w-full lg:w-[65%] lg:pr-6">
          {/* Title */}
          <h1 className="text-[26px] font-semibold font-Poppins text-black dark:text-white">
            {data?.name}
          </h1>

          {/* Ratings + Students */}
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-2">
              <Ratings rating={data?.ratings || 0} />
              <h5 className="text-black dark:text-white">
                {data?.reviews?.length || 0} Reviews
              </h5>
            </div>
            <h5 className="text-black dark:text-white">
              {data?.purchased || 0} Students
            </h5>
          </div>

          {/* Benefits */}
          <h2 className="mt-6 text-[22px] font-semibold text-black dark:text-white">
            What you will learn from this course?
          </h2>
          <div className="mt-3">
            {data.benefits?.map((item: Benefit, index: number) => (
              <div className="w-full flex items-center py-2" key={index}>
                <MdCheckCircle
                  size={20}
                  className="text-green-500 flex-shrink-0"
                />
                <p className="pl-2 text-black dark:text-white">{item.title}</p>
              </div>
            ))}
          </div>

          {/* Prerequisites */}
          <h2 className="mt-8 text-[22px] font-semibold text-black dark:text-white">
            What are the prerequisites for starting this course?
          </h2>
          <div className="mt-3">
            {data.prerequisites?.map((item: Prerequisite, index: number) => (
              <div className="w-full flex items-center py-2" key={index}>
                <RiBook2Line
                  size={20}
                  className="text-blue-500 flex-shrink-0"
                />
                <p className="pl-2 text-black dark:text-white">{item.title}</p>
              </div>
            ))}
          </div>

          {/* Course Overview */}
          <h2 className="mt-8 text-[22px] font-semibold text-black dark:text-white">
            Course Overview
          </h2>
          <CourseContentList data={data?.courseData} isDemo={true} />

          {/* Overview Text */}
          <p className="text-[16px] mt-3 whitespace-pre-line text-black dark:text-white">
            {data?.overview}
          </p>

          {/* Description */}
          <h2 className="mt-8 text-[22px] font-semibold text-black dark:text-white">
            Course Details
          </h2>
          <p className="text-[16px] mt-3 whitespace-pre-line text-black dark:text-white">
            {data?.description}
          </p>

          {/* Reviews */}
          <h2 className="mt-10 text-[22px] font-semibold text-black dark:text-white">
            Student Reviews
          </h2>
          <div className="mt-4">
            {data?.reviews && data.reviews.length > 0 ? (
              [...data.reviews].reverse().map((review: Review, i: number) => (
                <div
                  key={i}
                  className="w-full border-gray-300 dark:border-gray-600 py-4"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar initials */}
                    <Image
                      src={review.user.avatar ? review.user.avatar.url : Avatar}
                      width={50}
                      height={50}
                      alt="User_Avatar"
                      className="w-[50px] h-[50px] rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h5 className="text-[18px] text-black dark:text-white">
                          {review.user?.name}
                        </h5>
                        <Ratings rating={review.rating} />
                      </div>
                      <p className="text-black dark:text-white">
                        {review.comment}
                      </p>
                      <small className="text-gray-600 dark:text-gray-400">
                        {format(review.createdAt)}
                      </small>
                    </div>
                  </div>
                  {review.commentReplies.map((i: Reply, index: number) => (
                    <div key={index} className="w-full flex ml-16 my-5">
                      {/* Avatar */}
                      <div className="w-[50px] h-[50px]">
                        <Image
                          src={i.user.avatar ? i.user.avatar.url : Avatar}
                          width={50}
                          height={50}
                          alt="User_Avatar"
                          className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                      </div>

                      {/* Comment Content */}
                      <div className="pl-3">
                        <div className="flex items-center">
                          <h5 className="text-[20px]">{i.user.name}</h5> {i.user.role === "admin" && <VscVerifiedFilled className="text-blue-600 ml-1 text-[20px]" />}
                        </div>
                        <p>{i.comment}</p>
                        <small className="text-[#ffffff83]">
                          {format(i.createdAt, "Just now")}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="text-black dark:text-white">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full lg:w-[35%] relative">
          <div className="sticky top-[100px] w-full border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-4 bg-white dark:bg-slate-800">
            {/* Course Player */}
            <CoursePlayer videoId={data?.demoUrl} title={data?.title} />

            {/* Price + Discount */}
            <div className="flex items-center pt-5">
              <h1 className="text-[25px] font-bold text-black dark:text-white">
                {data?.price === 0 ? "Free" : `₹${data?.price}`}
              </h1>
              {data?.estimatedPrice > data?.price && (
                <>
                  <h5 className="pl-3 text-[20px] line-through opacity-70 text-black dark:text-white">
                    ₹{data.estimatedPrice}
                  </h5>
                  <h4 className="pl-5 text-[20px] text-green-600 font-semibold">
                    {discountPercentage}% Off
                  </h4>
                </>
              )}
            </div>

            {/* CTA */}
            <div className="pt-5">
              {isPurchased ? (
                <Link
                  href={`/course-access/${data._id}`}
                  className={`${styles.button} w-full text-center`}
                >
                  Enter Course
                </Link>
              ) : (
                <button
                  onClick={handleOrder}
                  className={`${styles.button} w-full bg-crimson text-white`}
                >
                  Buy Now {data?.price === 0 ? "" : `₹ ${data.price}`}
                </button>
              )}
            </div>

            {/* Right Side Benefits */}
            <div className="mt-6 space-y-3 text-black dark:text-white text-[15px]">
              <div className="flex items-center gap-2">
                <TbSourceCode size={20} className="text-blue-500" />
                <span>Source code included</span>
              </div>
              <div className="flex items-center gap-2">
                <MdWatchLater size={20} className="text-green-500" />
                <span>Full lifetime access</span>
              </div>
              <div className="flex items-center gap-2">
                <PiCertificate size={20} className="text-purple-500" />
                <span>Certificate of completion</span>
              </div>
              <div className="flex items-center gap-2">
                <MdOutlineWorkspacePremium size={20} className="text-yellow-500" />
                <span>Premium Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  Checkout Modal */}
      {open && (
        <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
          <div className="w-[500px] min-h-[500px] bg-white dark:bg-slate-800 rounded-xl shadow p-5">
            {/* Close Button */}
            <div className="w-full flex justify-end">
              <IoCloseOutline
                size={35}
                className="text-black dark:text-white cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>

            {/* Stripe Checkout */}
            <div className="w-full mt-3">
              {stripePromise && clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                  <CheckOutForm setOpen={setOpen} data={data} user={user || undefined} />
                </Elements>
              )}
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default CourseDetails;
