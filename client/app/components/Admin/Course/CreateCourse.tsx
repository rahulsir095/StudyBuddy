"use client";
import React, { useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useCreateCourseMutation } from "../../../../redux/features/courses/coursesApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Define types
type CourseInfo = {
  name: string;
  description: string;
  category: string;
  price: string;
  estimatedPrice: string;
  tags: string[];
  level: string;
  demoUrl: string;
  thumbnail: string;
};

type BenefitOrPrerequisite = { title: string };

type CourseContentItem = {
  videoUrl: string;
  title: string;
  description: string;
  videoSection: string;
  videoLength: string;
  links: { title: string; url: string }[];
  suggestion: string;
};

type FormattedCourseData = {
  name: string;
  description: string;
  price: string;
  estimatedPrice: string;
  tags: string[];
  thumbnail: string;
  category: string;
  level: string;
  demoUrl: string;
  totalVideos: number;
  benefits: BenefitOrPrerequisite[];
  prerequisites: BenefitOrPrerequisite[];
  courseData: CourseContentItem[];
};

const CreateCourse = () => {
  const [createCourse, { isLoading, isSuccess, error }] = useCreateCourseMutation();

  useEffect(() => {
  if (isSuccess) {
    toast.success("Course Created Successfully!");
    redirect("/admin/courses");
  }

  if (error) {
    const err = error as FetchBaseQueryError;
    if ("data" in err) {
      const message = (err.data as { message: string }).message;
      toast.error(message);
    } else {
      toast.error(err.error || "Something went wrong!");
    }
  }
}, [isLoading, isSuccess, error]);

  const [active, setActive] = useState<number>(0);
  const [courseInfo, setCourseInfo] = useState<CourseInfo>({
    name: "",
    description: "",
    category: "",
    price: "",
    estimatedPrice: "",
    tags: [],
    level: "",
    demoUrl: "",
    thumbnail: "",
  });

  const [benefits, setBenefits] = useState<BenefitOrPrerequisite[]>([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState<BenefitOrPrerequisite[]>([{ title: "" }]);

  const [courseContentData, setCourseContentData] = useState<CourseContentItem[]>([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      videoLength: "",
      links: [{ title: "", url: "" }],
      suggestion: "",
    },
  ]);

  const [courseData, setCourseData] = useState<FormattedCourseData | null>(null);

  const handleSubmit = async () => {
    const formattedBenefits = benefits.map((b) => ({ title: b.title }));
    const formattedPrerequisites = prerequisites.map((p) => ({ title: p.title }));

    const formattedCourseContentData = courseContentData.map((content) => ({
      videoUrl: content.videoUrl,
      title: content.title,
      description: content.description,
      videoLength: content.videoLength,
      videoSection: content.videoSection,
      links: content.links.map((link) => ({ title: link.title, url: link.url })),
      suggestion: content.suggestion || "",
    }));

    const data: FormattedCourseData = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      category: courseInfo.category,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseData: formattedCourseContentData,
    };

    setCourseData(data);
  };

  const handleCourseCreate = async () => {
    if (!isLoading && courseData) {
      await createCourse(courseData);
    }
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
            handleCourseCreate={handleCourseCreate}
            courseData={courseData!}
            isEdit={false}
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

export default CreateCourse;
