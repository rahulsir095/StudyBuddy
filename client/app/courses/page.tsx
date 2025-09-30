"use client";

import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import { styles } from "@/app/styles/style";
import Heading from "../utils/Heading";
import CoursesCard from "../components/Course/CoursesCard";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Footer from "../components/Footer/Footer";

type Props = {};

const CoursesPage = (props: Props) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");

  const { data, isLoading, error } = useGetUsersAllCoursesQuery(undefined, {});
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});

  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [courses, setCourses] = useState<any[]>([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (data?.courses) {
      let filtered = [...data.courses];

      if (category !== "All") {
        filtered = filtered.filter(
          (item: any) => item.categories === category
        );
      }

      if (search) {
        filtered = filtered.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setCourses(filtered);
    }
  }, [data, search, category]);

  const categories = categoriesData?.layout?.categories || [];

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-medium">
          ⚠️ Failed to load courses. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Heading
        title="All Courses - StudyBuddy"
        description="StudyBuddy is an E-Learning platform where students can explore courses, learn programming, and grow together."
        keywords="courses, studybuddy, programming, coding, MERN, Redux, Machine Learning"
      />

      <Header
        open={open}
        setOpen={setOpen}
        route={route}
        setRoute={setRoute}
        activeItem={1}
      />

      {/* Main content */}
      <main className="flex-grow">
        {/* Categories (scrollable on mobile) */}
        <div className="w-full overflow-x-auto mt-26">
          <div className="flex items-center gap-3 px-3 pb-2 min-w-max">
            {/* All Category */}
            <div
              className={`h-[35px] ${category === "All"
                  ? "bg-red-500 text-white"
                  : "bg-[#5050cb] text-white/90"
                } px-4 rounded-full flex items-center justify-center font-Poppins cursor-pointer text-sm whitespace-nowrap`}
              onClick={() => setCategory("All")}
            >
              All
            </div>

            {/* Dynamic Categories */}
            {categories.map((item: any, index: number) => (
              <div
                key={index}
                className={`h-[35px] ${category === item.title
                    ? "bg-red-500 text-white"
                    : "bg-[#5050cb] text-white/90"
                  } px-4 rounded-full flex items-center justify-center font-Poppins cursor-pointer text-sm whitespace-nowrap`}
                onClick={() => setCategory(item.title)}
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>

        {/* No Courses */}
        {courses.length === 0 ? (
          <p
            className={`${styles.label} justify-center min-h-[40vh] flex items-center text-center px-4`}
          >
            {search
              ? "No courses found for your search."
              : "No courses found in this category. Please try another one!"}
          </p>
        ) : (
          /* Courses Grid */
          <div className="w-full flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 px-4 sm:px-6 lg:px-0 mt-8 max-w-6xl w-full">
              {courses.map((item: any, index: number) => (
                <CoursesCard item={item} key={index} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer sticks to bottom */}
      <Footer />
    </div>
  );

};

export default CoursesPage;
