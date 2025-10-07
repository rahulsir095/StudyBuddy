import React from 'react';
import Heading from '../utils/Heading';
import AdminSidebar from '../components/Admin/sidebar/AdminSidebar';
import AdminProtected from '../hooks/adminProtected';
import DashboardHero from "../components/Admin/DashboardHero"


const Page = () => {
  return (
    <div>
      <AdminProtected>                        
        <Heading
          title="Elearning - Admin"
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Programming, MERN, Redux, Machine Learning"
        />
        <div className="flex h-[100vh]">
          <div className="max-w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
           <DashboardHero isDashboard = {true}/>
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default Page;
