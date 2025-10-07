"use client";

import React, { FC, useState } from "react";
import Protected from "../hooks/useProtected";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Profile from "../components/Profile/Profile"
import { useSelector } from "react-redux";
import Footer from "../components/Footer/Footer";

interface UserCourse {
  courseId: string;
}
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: {
    url: string;
  };
  courses?: UserCourse[];
}
interface RootState {
  auth: {
    user: User;
  };
}
const Page: FC = () => {
  const [open, setOpen] = useState(false);
  const [activeItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <div>
      <Protected>
        <Heading
          title={`${ user && user?.name} Profile - StudyBuddy`}
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Programming,MERN,Redux,Machine Learning"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <Profile user={user} />
        <br />
        <br />
        <Footer />
      </Protected>
    </div>
  );
};

export default Page;
