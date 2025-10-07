"use client";

import React, { FC, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Route/Hero"
import Heading from "./utils/Heading";
import Courses from "./components/Route/Courses";
import Reviews from "./components/Reviews/Reviews"
import FAQ from "./components/FAQ/FAQ"
import Footer from "./components/Footer/Footer"


const Page: FC = () => {
  const [open, setOpen] = useState(false);
  const [activeItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="StudyBuddy"
        description="StudyBuddy is a platform for students to learn and get help from teachers"
        keywords="Programming,MERN,Redux,Machine Learning"
      />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} route={route} />
      <div className="bg-[#f5f7fa] dark:bg-[#0d0f1a] transition-colors duration-300">
      <Hero />
      <Courses/>
      <Reviews/>
      <FAQ/>
      <Footer/>
      </div>
    </div>
  );
};

export default Page;