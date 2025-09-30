'use client';
import React, { FC, useState, useEffect } from 'react';
import SideBarProfile from "./SideBarProfile"
import { useLogOutQuery } from '@/redux/features/auth/authApi';
import { signOut } from 'next-auth/react';
import ProfileInfo from './ProfileInfo'
import ChangePasssword from './ChangePasssword'
import toast from 'react-hot-toast';
import { useGetUsersAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import CoursesCard from '../Course/CoursesCard';

type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);
  const [logout, setLogout] = useState(false);
  const [courses, setCourses] = useState<any>([]);

  const { data,isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const { } = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  });

  const logoutHandler = async () => {
    setLogout(true);
    await signOut();
    toast.success("Logout Successfully");
  };

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 85);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (data && user?.courses) {
      const filteredCourses = user.courses
        .map((userCourse: any) =>
          data.courses.find((course: any) => course._id === userCourse.courseId)
        )
        .filter((course: any) => course !== undefined);
      setCourses(filteredCourses);
    }
  }, [data,user]);

  return (
    <div className="w-[85%] flex mx-auto">
      {/* Sidebar */}
      <div
        className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-white bg-opacity-90 border border-[#00000014] rounded-[5px] shadow-sm mt-[160px] mb-[80px] sticky ${scroll ? "top-[120px]" : "top-[30px]"
          } left-[30px]`}
      >
        <SideBarProfile
          user={user}
          avatar={avatar}
          active={active}
          setActive={setActive}
          logoutHandler={logoutHandler}
        />
      </div>

      {/* Profile Tabs */}
      {active === 1 && (
        <div className="w-full h-full bg-transparent mt-[130px]">
          <ProfileInfo avatar={avatar} user={user} />
        </div>
      )}

      {active === 2 && (
        <div className="w-full h-full bg-transparent mt-[130px]">
          <ChangePasssword />
        </div>
      )}

      {active === 3 && (
        <div className="w-full pl-7 px-2 800px:px-10 800px:pl-18 mt-[165px]">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {courses && courses.length > 0 ? (
              courses.map((item: any, index: number) => (
                <CoursesCard
                  key={index}
                  item={item}
                  user={user}
                  isProfile={true}
                />
              ))
            ) : (
              <h1 className="text-center text-[18px] font-Poppins">
                You don't have any purchased courses!
              </h1>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
