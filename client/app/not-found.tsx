'use client';

import Image from "next/image";
import svg404 from "../public/404.svg";
import Header from "./components/Header";
import Heading from "./utils/Heading";
import Footer from "./components/Footer/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  const router = useRouter();
  const goHome = () => router.push("/");

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f7fa] dark:bg-[#0d0f1a] text-gray-900 dark:text-gray-100">

      {/* SEO / Head */}
      <Heading
        title="Page Not Found | StudyBuddy"
        description="StudyBuddy is a platform for students to learn and get help from teachers"
        keywords="Programming, MERN, Redux, Machine Learning"
      />

      {/* Header */}
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
        disableNavigation={true}
      />

      {/* Main content */}
      <main className="flex flex-col flex-grow items-center justify-center px-4 mt-10">
        <div className="flex flex-col items-center justify-center w-full" style={{ height: '50vh' }}>
          <Image
            src={svg404}
            alt="Not Found"
            className="object-contain w-full h-full"
            priority
          />

          <button
            onClick={goHome}
            className="800px:mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
