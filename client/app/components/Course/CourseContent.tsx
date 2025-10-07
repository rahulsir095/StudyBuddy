import { useGetCourseContentQuery } from '@/redux/features/orders/ordersApi';
import React, { useState } from 'react'
import Loader from '../Loader/Loader';
import Heading from '@/app/utils/Heading';
import CourseContentMedia from "./CourseContentMedia"
import Header from '../Header';
import CourseContentList from './CourseContentList';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar:{
    url:string;
  };
  role:string;
}

type Props = {
  id: string;
  user: User;
};

const CourseContent = ({ id, user }: Props) => {
  const { data: contentData, isLoading, refetch } = useGetCourseContentQuery(id, { refetchOnMountOrArgChange: true });
  const data = contentData?.content;
  const [activeVideo, setActiveVideo] = useState(0);
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  return (
    <>
      {isLoading ? (<Loader />) : (
        <>
          <Header
            activeItem={1}
            open={open}
            setOpen={setOpen}
            route={route}
            setRoute={setRoute}
          />
          <div className='w-full grid 800px:grid-cols-10'>
            <Heading
              title={data[activeVideo]?.title || "Untitled Video"}
              description='Video Description'
              keywords={data[activeVideo]?.tags}
            />
            <div className='col-span-7'>
              <CourseContentMedia
                data={data}
                id={id}
                activeVideo={activeVideo}
                setActiveVideo={setActiveVideo}
                user={user}
                refetch={refetch}
              />
            </div>
            <div className='hidden 800px:block 800px:col-span-3'>
              <CourseContentList
                setActiveVideo={setActiveVideo}
                data={data}
                activeVideo={activeVideo}
                isDemo={false}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default CourseContent