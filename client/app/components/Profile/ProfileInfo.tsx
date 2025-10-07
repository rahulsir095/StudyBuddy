'use client';

import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import avatarIcon from '../../../public/assests/avatar.png';
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from '@/redux/features/user/userApi';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import toast from 'react-hot-toast';

interface UserCourse {
  courseId: string;
}

interface User {
    _id: string;
  name: string;
  email:string;
  avatar:{
    url:string;
  }
  courses?: UserCourse[];
}
type Props = {
  user: User;
};

const ProfileInfo: FC<Props> = ({ user }) => {
  const [name, setName] = useState(user?.name || '');
  const [loadUser, setLoadUser] = useState(false);
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [editProfile, { isSuccess: success, error: updateError }] =
    useEditProfileMutation();

  useLoadUserQuery(undefined, { skip: loadUser ? false : true });

  const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          updateAvatar(fileReader.result);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (isSuccess || success) setLoadUser(true);
    if (error || updateError) console.log('Error updating:', error || updateError);
    if (success) toast.success('Profile Updated Successfully!');
  }, [isSuccess, error, success, updateError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) editProfile({ name });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[90%] 800px:w-[50%] mx-auto mt-8 bg-white dark:bg-slate-800 p-4 800px:p-8 rounded-lg shadow-md"
    >
      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <Image
            src={  user.avatar?.url || avatarIcon}
            alt="User Avatar"
            width={120}
            height={120}
            priority
            className="rounded-full object-cover w-[120px] h-[120px] border-[3px] border-[#5eff50b6]"
          />
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={imageHandler}
            className="hidden"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] bg-gray-800 dark:bg-gray-700 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer hover:bg-gray-600 transition">
              <AiOutlineCamera size={20} className="text-white" />
            </div>
          </label>
        </div>
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="block mb-2 text-sm 800px:text-base font-medium text-black dark:text-white">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-black dark:text-white rounded text-sm 800px:text-base"
          required
        />
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block mb-2 text-sm 800px:text-base font-medium text-black dark:text-white">
          Email Address
        </label>
        <input
          type="email"
          value={user?.email || ''}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-black dark:text-white rounded text-sm 800px:text-base opacity-70 cursor-not-allowed"
        />
      </div>

      {/* Update Button */}
      <button
        type="submit"
        className="w-full h-[40px] bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-sm 800px:text-base transition"
      >
        Update Profile
      </button>
    </form>
  );
};

export default ProfileInfo;
