"use client";

import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { HiPlus, HiMinus } from "react-icons/hi";
import { styles } from "@/app/styles/style";

type FAQItem = {
  _id: string;
  question: string;
  answer: string;
};

const FAQ = () => {
  const { data, isLoading, error } = useGetHeroDataQuery("FAQ", {});
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [questions, setQuestions] = useState<FAQItem[]>([]);

  useEffect(() => {
    if (data?.layout?.faq) {
      setQuestions(data.layout.faq);
    }
  }, [data]);

  const toggleQuestion = (id: string) => {
    setActiveQuestion((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          Loading FAQs...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-red-500">⚠️ Failed to load FAQs. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="w-[90%] 800px:w-[80%] m-auto mt-[50px]">
      <h1
        className={`${styles.title} 800px:text-[40px] text-center mb-10`}
      >
        Frequently Asked{" "}
        <span className="font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Questions
        </span>
      </h1>

      {questions.length > 0 ? (
        <dl className="space-y-6">
          {questions.map((q) => (
            <div
              key={q._id}
              className="border-t border-gray-200 dark:border-gray-700 pt-6"
            >
              <dt>
                <button
                  className="flex items-start justify-between w-full text-left focus:outline-none"
                  onClick={() => toggleQuestion(q._id)}
                >
                  <span className="font-medium text-lg text-black dark:text-white">
                    {q.question}
                  </span>
                  <span className="ml-6 flex-shrink-0">
                    {activeQuestion === q._id ? (
                      <HiMinus className="h-6 w-6 text-black dark:text-white cursor-pointer" />
                    ) : (
                      <HiPlus className="h-6 w-6 text-black dark:text-white cursor-pointer" />
                    )}
                  </span>
                </button>
              </dt>

              {activeQuestion === q._id && (
                <dd className="mt-3 pr-12">
                  <p className="text-base leading-relaxed font-poppins text-gray-700 dark:text-gray-300">
                    {q.answer}
                  </p>
                </dd>
              )}
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No FAQs available right now.
        </p>
      )}
    </div>
  );
};

export default FAQ;
