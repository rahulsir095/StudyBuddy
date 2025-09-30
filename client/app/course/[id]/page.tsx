'use client';

import React, { use } from "react";
import CourseDetailsPage from "../../components/Course/CourseDetailsPage";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  return (
    <div>
      <CourseDetailsPage id={id} />
    </div>
  );
};

export default Page;
