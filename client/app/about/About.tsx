"use client";
import React from "react";

type Props = {};

const About = (props: Props) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          About <span className="font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          StudyBuddy
        </span>
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          StudyBuddy is an interactive learning platform designed to help
          students learn smarter, stay organized, and achieve their academic
          goals. Whether you’re preparing for exams, practicing coding, or
          collaborating with peers, StudyBuddy provides the right tools and
          resources to support your journey.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-2xl">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              🚀 Easy Learning
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Access notes, tutorials, and practice questions anytime.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-2xl">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              🤝 Collaboration
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Connect with peers, share ideas, and solve problems together.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-2xl">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              📚 Smart Resources
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Curated study material to make learning effective and engaging.
            </p>
          </div>
        </div>

        <p className="mt-10 text-gray-700 dark:text-gray-400">
          Together, we make studying simpler, smarter, and more enjoyable!
        </p>
      </div>
    </div>
  );
};

export default About;
