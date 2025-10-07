"use client";
import React, { useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import {
  useEditCourseMutation,
  useGetAllCoursesQuery,
} from "../../../../redux/features/courses/coursesApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type Props = {
  id: string;
};
type CourseType = {
  _id: string;
  name: string;
  description: string;
  price: string;
  estimatedPrice: string;
  tags: string[];
  category: string;
  level: string;
  demoUrl: string;
  thumbnail: { url: string };
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  courseData: {
    videoUrl: string;
    title: string;
    description: string;
    videoSection: string;
    videoLength: string;
    links: { title: string; url: string }[];
    suggestion: string;
  }[];
};


const EditCourse = ({ id }: Props) => {
  const router = useRouter();
  const [editCourse,{isSuccess,error}] = useEditCourseMutation();

  const { data } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const editCourseData = data && data.courses.find((course: CourseType) => course._id === id);

  const [active, setActive] = useState(0);
  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    estimatedPrice: "",
    tags: [] as string[],
    level: "",
    demoUrl: "",
    thumbnail: "",
  });

  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);

  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      videoLength:"",
      links: [
        {
          title: "",
          url: "",
        },
      ],
      suggestion: "",
    },
  ]);

  const [courseData, setCourseData] = useState({});

useEffect(() => {
  if (isSuccess) {
    toast.success("Course updated successfully!");
    router.push("/admin/courses");
  }
  if (error) {
    const err = error as FetchBaseQueryError;
    if ("data" in err) {
      const data = err.data as { message: string };
      toast.error(data.message);
    }
  }
}, [isSuccess, error, router]);


  // Pre-fill form with existing course data
  useEffect(() => {
    if (editCourseData) {
      setCourseInfo({
        name: editCourseData.name,
        description: editCourseData.description,
        price: editCourseData.price,
        category: editCourseData.category,
        estimatedPrice: editCourseData.estimatedPrice,
        tags: editCourseData.tags,
        level: editCourseData.level,
        demoUrl: editCourseData.demoUrl,
        thumbnail: editCourseData.thumbnail.url,
      });
      setBenefits(editCourseData.benefits || [{ title: "" }]);
      setPrerequisites(editCourseData.prerequisites || [{ title: "" }]);
      setCourseContentData(editCourseData.courseData || []);
    }
  }, [editCourseData]);

  const handleSubmit = () => {
    const formattedData = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: benefits.map((b) => ({ title: b.title })),
      prerequisites: prerequisites.map((p) => ({ title: p.title })),
      courseData: courseContentData.map((c) => ({
        videoUrl: c.videoUrl,
        title: c.title,
        description: c.description,
        videoSection: c.videoSection,
        videoLength:c.videoLength,
        links: c.links.map((l) => ({
          title: l.title,
          url: l.url,
        })),
        suggestion: c.suggestion || "",
      })),
    };

    setCourseData(formattedData);
  };

  const handleCourseUpdate = async () => {
      const data = courseData;
      await editCourse({id,data}); 
  };

  return (
    <div className="w-full flex min-h-screen">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}

        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}

        {active === 2 && (
          <CourseContent
            active={active}
            setActive={setActive}
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmit={handleSubmit}
          />
        )}

        {active === 3 && (
          <CoursePreview
            active={active}
            setActive={setActive}
            handleCourseCreate={handleCourseUpdate}
            courseData={courseData}
            isEdit={true}
          />
        )}
      </div>

      {/* Sidebar */}
      <div className="w-[20%] mt-[100px] h-screen fixed top-18 right-0">
        <CourseOptions active={active} />
      </div>
    </div>
  );
};

export default EditCourse;
