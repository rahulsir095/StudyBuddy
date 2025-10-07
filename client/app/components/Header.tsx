"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineMenu } from "react-icons/hi";
import { LiaUserCircleSolid } from "react-icons/lia";
import { CgCloseO } from "react-icons/cg";
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "../components/Auth/Verification";
import Image from "next/image";
import avatar from "../../public/assests/avatar.png";
import { useSession } from "next-auth/react";
import {
  useLogOutQuery,
  useSocialAuthMutation,
} from "../../redux/features/auth/authApi";
import toast from "react-hot-toast";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./Loader/Loader";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { data } = useSession();

  const { data: userData, isLoading, refetch } = useLoadUserQuery(undefined, {});
  const [socialAuth] = useSocialAuthMutation();
  const [logout] = useState(false);
  const { } = useLogOutQuery(undefined, { skip: !logout ? true : false });

  useEffect(() => {
    if (!isLoading) {
      if (!userData) {
        if (data) {
          socialAuth({
            email: data?.user?.email,
            name: data?.user?.name,
            avatar: data.user?.image,
          })
            .unwrap()
            .then(() => {
              refetch();
              toast.success("Login Successfully");
            });
        }
      }
    }
  }, [data, userData, isLoading, refetch, socialAuth]);

  useEffect(() => {
    const handleScroll = () => setActive(window.scrollY > 85);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "screen") {
      setOpenSidebar(false);
    }
  };

  return (
    <>
      {isLoading ? (<Loader />) : (
        <div className="w-full relative z-[1]">
          {/* Glassy Header */}
          <div
            className={`fixed top-0 left-0 w-full h-[80px] z-[80] transition duration-500 ${active
              ? "backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border-b border-white/20 dark:border-gray-700/40 shadow-lg"
              : "backdrop-blur-sm bg-white/20 dark:bg-gray-900/20 border-b border-white/10 dark:border-gray-700/20"
              }`}
          >
            <div className="w-[95%] 800px:w-[92%] mx-auto py-2 h-full flex items-center justify-between">
              {/* Logo */}
              <Link
                href="/"
                className="text-[25px] font-poppins font-medium text-black dark:text-white"
              >
                StudyBuddy
              </Link>

              {/* Nav Items & Controls */}
              <div className="flex items-center space-x-4">
                <NavItems activeItem={activeItem} isMobile={false} />
                <ThemeSwitcher />

                {/* Mobile Menu */}
                <div className="block 800px:hidden">
                  <HiOutlineMenu
                    size={25}
                    className="cursor-pointer text-black dark:text-white"
                    onClick={() => setOpenSidebar(true)}
                  />
                </div>

                {/* Profile */}
                {userData ? (
                  <Link href="/profile">
                    <Image
                      src={userData?.user.avatar ? userData?.user.avatar?.url : avatar}
                      alt="User Profile"
                      width={40}
                      height={40}
                      className="rounded-full cursor-pointer transition-all duration-300 border-[3px] border-[#5eff50b6]"
                    />
                  </Link>
                ) : (
                  <LiaUserCircleSolid
                    size={40}
                    className="cursor-pointer dark:text-white text-black"
                    onClick={() => setOpen(true)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Mobile Sidebar */}
          {openSidebar && (
            <div
              className="fixed w-full h-screen top-0 left-0 z-[99999] bg-black/30 backdrop-blur-sm"
              onClick={handleClose}
              id="screen"
            >
              <div className="w-[70%] fixed z-[999999] h-screen bg-white/30 dark:bg-gray-900/30 backdrop-blur-md dark:backdrop-blur-md top-0 right-0 shadow-lg">
                <div className="flex justify-end pt-6 pr-4">
                  <CgCloseO
                    size={25}
                    className="cursor-pointer text-red-500 dark:text-red-900"
                    onClick={() => setOpenSidebar(false)}
                  />
                </div>
                <NavItems activeItem={activeItem} isMobile={true} />
              </div>
            </div>
          )}

          {/* Auth Modals */}
          {route === "Login" && open && (
            <CustomModal open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} Component={Login} refetch={refetch} />
          )}
          {route === "Sign-Up" && open && (
            <CustomModal open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} Component={SignUp} />
          )}
          {route === "Verification" && open && (
            <CustomModal open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} Component={Verification} />
          )}
        </div>
      )}
    </>
  );
};

export default Header;
