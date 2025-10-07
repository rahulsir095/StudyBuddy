'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import { RiLockPasswordLine } from 'react-icons/ri';
import { SiCoursera } from 'react-icons/si';
import { AiOutlineLogout } from 'react-icons/ai';
import { RiAdminFill } from "react-icons/ri";
import Link from 'next/link';
import Avatar from "../../../public/assests/avatar.png";
interface UserCourse {
  courseId: string;
}
interface User{
  _id: string;
  name: string;
  email:string;
  role:string;
  avatar: {
    url:string;
  };
  courses?: UserCourse[];
}
type Props = {
  user: User;
  active: number;
  setActive: (active: number) => void;
  logoutHandler: () => Promise<void>;
};

const SideBarProfile: FC<Props> = ({
  user,
  active,
  setActive,
  logoutHandler,
}) => {
  return (
    <div className="w-full">
      {/* My Account */}
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer  ${active === 1
          ? ' dark:bg-slate-800 bg-slate-300'
          : 'bg-transparent'
          }`}
        onClick={() => setActive(1)}
      >
        <Image
          src={user?.avatar?.url  || Avatar}
          alt="User Avatar"
          width={30}
          height={30}
          priority
          className="w-5 h-5 sm:w-7 800px:h-7 800px:w-7 rounded-full object-cover cursor-pointer border-[2px] border-[#5eff50b6]"
        />
        <h5 className="pl-2  800px:block hidden font-Poppins text-gray-900 dark:text-gray-100">
          My Account
        </h5>
      </div>

      {/* Change Password */}
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 2
          ? ' dark:bg-slate-800 bg-slate-300' : 'bg-transparent'
          }`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine
          size={20}
          className="text-gray-900 dark:text-gray-100"
        />
        <h5 className="pl-2  800px:block hidden font-Poppins text-gray-900 dark:text-gray-100">
          Change Password
        </h5>
      </div>

      {/* Enrolled Courses */}
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer  ${active === 3
          ? ' dark:bg-slate-800 bg-slate-300'
          : 'bg-transparent'
          }`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} className="text-gray-900 dark:text-gray-100" />
        <h5 className="pl-2  800px:block hidden font-Poppins text-gray-900 dark:text-gray-100">
          Enrolled Courses
        </h5>
      </div>
      {/* Admin Dashboard */}
      {
        user.role === "admin" && (
          <Link
            className={`w-full flex items-center px-3 py-4 cursor-pointer  ${active === 6
              ? ' dark:bg-slate-800 bg-slate-300'
              : 'bg-transparent'
              }`}
            href={"/admin"}
 
          >
            <RiAdminFill size={20} className="text-gray-900 dark:text-gray-100" />
            <h5 className="pl-2  800px:block hidden font-Poppins text-gray-900 dark:text-gray-100">
              Admin Dashboard
            </h5>
          </Link>
        )
      }

      {/* Log Out */}
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer  ${active === 4
          ? ' dark:bg-slate-800 bg-slate-300'
          : 'bg-transparent'
          }`}
        onClick={logoutHandler}
      >
        <AiOutlineLogout
          size={20}
          className="text-gray-900 dark:text-gray-100"
        />
        <h5 className="pl-2  800px:block hidden font-Poppins text-gray-900 dark:text-gray-100">
          Log Out
        </h5>
      </div>
    </div>
  );
};

export default SideBarProfile;