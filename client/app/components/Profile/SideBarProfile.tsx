'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import avatarDefault from '../../../public/assests/avatar.png';
import { RiLockPasswordLine } from 'react-icons/ri';
import { SiCoursera } from 'react-icons/si';
import { AiOutlineLogout } from 'react-icons/ai';
import { RiAdminFill } from "react-icons/ri";
import Link from 'next/link';

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logoutHandler: any;
};

const SideBarProfile: FC<Props> = ({
  user,
  active,
  avatar,
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
          src={user?.avatar?.url || avatar || avatarDefault}
          alt="User Avatar"
          width={30}
          height={30}
          priority
          className="w-5 h-5 sm:w-7 800px:h-7 800px:w-7 rounded-full object-cover cursor-pointer border-[2px] border-[#37a39a]"
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