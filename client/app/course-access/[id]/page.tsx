"use client";

import Loader from '@/app/components/Loader/Loader';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import CourseContent from '../../components/Course/CourseContent';
import Footer from '@/app/components/Footer/Footer';
interface Course{
  courseId:string;
}
type Props = {
  params: Promise<{ id: string }>;
};

const Page = ({ params }: Props) => {
  const { id } = React.use(params);
  const { isLoading, data, error } = useLoadUserQuery(undefined, {});
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const isPurchased =
        data?.user?.courses?.some(
          (item: Course) => item.courseId.toString() === id.toString()
        );

      if (!isPurchased || error) {
        router.push('/');
      }
    }
  }, [data, error, id, isLoading, router]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <CourseContent id={id} user ={data?.user} />
          <Footer/>
        </div>
      )}
    </>
  );
};

export default Page;
