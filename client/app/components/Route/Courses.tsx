import { useGetUsersAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import React, { useEffect, useState } from 'react';
import CoursesCard from "../Course/CoursesCard";

// --- Define Course type ---
interface Course {
  _id:string;
  thumbnail:{
    url:string;
  };
  name:string;
  price:number;
  ratings:number;
  purchased:number;
  estimatedPrice:number;
  courseData:[];
}

const Courses = () => {
  const { data } = useGetUsersAllCoursesQuery({});
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (data?.courses) setCourses(data.courses);
  }, [data]);

  return (
    <div>
      <div className="w-[90%] 800px:w-[80%] m-auto">
        <h1 className='text-center font-family-poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white 800px:!leading-[60px] text-[#000] font-[700] tracking-tight'>
          Expand Your Career{" "}
          <span className='font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-700'>
            Opportunity
          </span><br />
          Opportunity With Your Courses
        </h1>
        <br />
        <br />
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
          {courses.map((item: Course, index: number) => (
            <CoursesCard
              item={item}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
