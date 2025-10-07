"use client";
import React from "react";


const Policy = () => {
  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 mt-[80px]">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Privacy <span className="font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Policy
        </span>
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8 text-center">
          At <span className="font-semibold text-blue-600">StudyBuddy</span>, your
          privacy is very important to us. This Privacy Policy explains how we
          collect, use, and protect your personal information.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              1. Information We Collect
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We may collect personal details such as your name, email address,
              and study preferences when you register. We also collect usage
              data like pages visited, time spent on resources, and interaction
              with study materials to improve our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Your information helps us:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-600 dark:text-gray-300">
              <li>Personalize your study experience.</li>
              <li>Improve our learning resources and features.</li>
              <li>Send important updates and notifications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              3. Data Protection
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We implement strict security measures to keep your personal
              information safe. Your data is encrypted and never shared with
              third parties without your consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              4. Your Rights
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              You can request to view, update, or delete your personal
              information at any time. If you have concerns, please reach out to
              our support team.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              5. Updates to This Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We may update this policy from time to time to reflect changes in
              our practices. We encourage you to check this page regularly for
              updates.
            </p>
          </section>
        </div>

        <p className="mt-10 text-center text-gray-700 dark:text-gray-400">
          If you have any questions about this Privacy Policy, please contact us
          at <span className="font-medium">support@studybuddy.com</span>.
        </p>
      </div>
    </div>
  );
};

export default Policy;
