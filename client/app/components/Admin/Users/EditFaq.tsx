"use client";

import { useEditLayoutMutation, useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import Loader from "../../Loader/Loader";

type FaqType = {
  _id?: string;
  question: string;
  answer: string;
  active?: boolean;
};

const EditFaq = () => {
  const { data, isLoading } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout] = useEditLayoutMutation();
  const [questions, setQuestions] = useState<FaqType[]>([]);

  useEffect(() => {
    if (data?.layout?.faq) {
      setQuestions(
        data.layout.faq.map((q: any) => ({
          ...q,
          active: false,
        }))
      );
    }
  }, [data]);

  // Toggle expand/collapse
  const toggleQuestion = (id?: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === id ? { ...q, active: !q.active } : q))
    );
  };

  // Handle input changes
  const handleQuestionChange = (id?: string, value?: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === id ? { ...q, question: value || "" } : q
      )
    );
  };

  const handleAnswerChange = (id?: string, value?: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === id ? { ...q, answer: value || "" } : q
      )
    );
  };

  // Add new FAQ
  const newFaqHandler = () => {
    setQuestions((prev) => [
      ...prev,
      {
        _id: Date.now().toString(), // temporary ID for UI
        question: "",
        answer: "",
        active: true,
      },
    ]);
  };

  // Delete FAQ
  const deleteFaq = (id?: string) => {
    setQuestions((prev) => prev.filter((q) => q._id !== id));
  };

  // Helpers
  const areQuestionsUnchanged = (
    original: FaqType[],
    updated: FaqType[]
  ) => {
    return (
      JSON.stringify(
        original.map(({ _id, question, answer }) => ({
          _id,
          question,
          answer,
        }))
      ) ===
      JSON.stringify(
        updated.map(({ _id, question, answer }) => ({
          _id,
          question,
          answer,
        }))
      )
    );
  };

  const isAnyQuestionEmpty = (qs: FaqType[]) => {
    return qs.some(
      (q) => q.question.trim() === "" || q.answer.trim() === ""
    );
  };

  // Save
  const handleSave = async () => {
    try {
      await editLayout({
        type: "FAQ",
        faq: questions.map(({ _id, question, answer }) => ({
          _id,
          question,
          answer,
        })),
      }).unwrap();

      toast.success("FAQs updated successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update FAQs");
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-[90%] 800px:w-[80%] m-auto mt-[120px]">
          <div className="mt-12">
            <dl className="space-y-8">
              {questions.map((q, index) => (
                <div
                  key={q._id}
                  className={`${
                    index !== 0 ? "border-t" : ""
                  } border-gray-600 pt-6`}
                >
                  <dt className="text-lg">
                    <button
                      className="flex items-start justify-between w-full text-left focus:outline-none"
                      onClick={() => toggleQuestion(q._id)}
                    >
                      <input
                        className="p-2 w-full rounded focus:border-transparent focus:outline-none text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        value={q.question}
                        onChange={(e) =>
                          handleQuestionChange(q._id, e.target.value)
                        }
                        placeholder="Add your question..."
                      />
                      <span className="ml-6 flex-shrink-0">
                        {q.active ? (
                          <HiMinus className="text-gray-600 dark:text-white h-6 w-6" />
                        ) : (
                          <HiPlus className="text-gray-600 dark:text-white h-6 w-6" />
                        )}
                      </span>
                    </button>
                  </dt>

                  {q.active && (
                    <dd className="mt-2 pr-12 flex items-center gap-4">
                      <input
                        className="p-2 w-full rounded focus:border-transparent focus:outline-none text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        value={q.answer}
                        onChange={(e) =>
                          handleAnswerChange(q._id, e.target.value)
                        }
                        placeholder="Add your answer..."
                      />
                      <AiOutlineDelete
                        className="text-black dark:text-white text-[18px] cursor-pointer"
                        onClick={() => deleteFaq(q._id)}
                      />
                    </dd>
                  )}
                </div>
              ))}
            </dl>

            {/* Add new FAQ */}
            <div className="mt-6">
              <IoMdAddCircleOutline
                className="dark:text-white text-black text-[25px] cursor-pointer"
                onClick={newFaqHandler}
              />
            </div>

            {/* Save button */}
            <div
              className={`w-[120px] h-[48px] flex items-center justify-center rounded absolute bottom-12 right-12 
              ${
                areQuestionsUnchanged(data?.layout?.faq || [], questions) ||
                isAnyQuestionEmpty(questions)
                  ? "cursor-not-allowed bg-gray-400"
                  : "cursor-pointer bg-[#42d383]"
              }`}
              onClick={
                areQuestionsUnchanged(data?.layout?.faq || [], questions) ||
                isAnyQuestionEmpty(questions)
                  ? undefined
                  : handleSave
              }
            >
              Save
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditFaq;
