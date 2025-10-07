"use client";

import { styles } from "@/app/styles/style";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";
import Avatar from "../../../../public/assests/Hero.png";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const EditHero = () => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const { data, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data) {
      setImage(data?.layout?.banner?.image?.url || "");
      setTitle(data?.layout?.banner?.title || "");
      setSubTitle(data?.layout?.banner?.subTitle || "");
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Hero updated successfully!");
    }

    if (error) {
      const fetchError = error as FetchBaseQueryError;
      if ("data" in fetchError && fetchError.data && typeof fetchError.data === "object") {
        const message =
          (fetchError.data as { message?: string }).message || "Something went wrong";
        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
    }
  }, [isSuccess, error, refetch]);

  const handleEdit = async () => {
    await editLayout({
      type: "Banner",
      image,
      title,
      subTitle,
    });
  };

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col 1000px:flex-row items-center justify-center px-6 py-12">
      {/* Background Circle Animation */}
      <div className="absolute top-[120px] 1000px:top-[unset] h-[50vh] w-[50vh] 1100px:h-[500px] 1100px:w-[500px] 1500px:h-[700px] 1500px:w-[700px] hero-animation rounded-full 1100px:left-[18rem] 1500px:left-[21rem]"></div>

      {/* Left - Image Section */}
      <div className="w-full 1000px:w-[40%] flex items-center justify-center relative z-10">
        <div className="relative">
          <Image
            src={image || Avatar}
            alt="banner"
            width={400}
            height={400}
            className="object-contain w-[85%] max-w-[400px] h-auto rounded-xl shadow-md"
          />
          <input
            type="file"
            id="banner"
            accept="image/*"
            className="hidden"
            onChange={handleUpdate}
          />
          <label
            htmlFor="banner"
            className="absolute bottom-4 right-6 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg cursor-pointer hover:scale-105 transition"
          >
            <AiOutlineCamera className="text-black dark:text-white text-xl" />
          </label>
        </div>
      </div>

      {/* Right - Editable Text Section */}
      <div className="w-full 1000px:w-[60%] flex flex-col items-center 1000px:items-start text-center 1000px:text-left mt-12 1000px:mt-0 space-y-6 z-10">
        <textarea
          placeholder="Improve Your Online Learning Experience Instantly"
          className="font-family-poppins dark:text-white text-black text-[26px] 1000px:text-[50px] 1500px:text-[60px] font-bold w-full resize-none bg-transparent border-none focus:outline-none px-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={2}
        />

        <textarea
          placeholder="We have 40k+ online courses & 500k+ registered students. Find your desired course now."
          className="font-family-josefin dark:text-gray-300 text-gray-700 text-[16px] 1000px:text-[20px] w-full resize-none bg-transparent border-none focus:outline-none font-Josefin leading-relaxed px-2"
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
          rows={3}
        />

        <div
          className={`${styles.button} !w-[120px] !h-[45px] dark:text-white text-black ${
            data?.layout?.banner?.title !== title ||
            data?.layout?.banner?.subTitle !== subTitle ||
            data?.layout?.banner?.image?.url !== image
              ? "cursor-pointer !bg-[#42d383] hover:opacity-90"
              : "!cursor-not-allowed opacity-60"
          }`}
          onClick={
            data?.layout?.banner?.title !== title ||
            data?.layout?.banner?.subTitle !== subTitle ||
            data?.layout?.banner?.image?.url !== image
              ? handleEdit
              : () => null
          }
        >
          Save
        </div>
      </div>
    </div>
  );
};

export default EditHero;
