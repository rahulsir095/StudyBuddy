"use client";
import React, { useEffect, useState } from "react";
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Image from "next/image";
import Avatar from "../../../public/assests/avatar.png";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";
import { useAddAnsInQuestionMutation, useAddNewQuestionMutation, useAddReplyInReviewMutation, useAddReviewInCourseMutation, useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import { format } from "timeago.js";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import { socket } from "@/app/utils/socket";

type Props = {
  data: any;
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  id: string;
  user: any;
  refetch: any;
};

const CourseContentMedia = ({
  data,
  id,
  activeVideo,
  setActiveVideo,
  user,
  refetch,
}: Props) => {
  const [activeBar, setActiveBar] = useState<number>(0);
  const [question, setQuestion] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(1);
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [reviews, setReviews] = useState<any[]>(data?.reviews || []);
  const [reply, setReply] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [addNewQuestion, { isSuccess, error, isLoading: questionCreationLoading },] = useAddNewQuestionMutation({});
  const [addAnsInQuestion, { isLoading: answerCreationLoadnig }] = useAddAnsInQuestionMutation();
  const [addReviewInCourse, { isLoading: isreviewLoading }] = useAddReviewInCourseMutation();
  const { data: courseData, refetch: reviewRefetch } = useGetCourseDetailsQuery(id, { refetchOnMountOrArgChange: true });
  const [addReplyInReview, { isSuccess: replySuccess, error: replyError, isLoading: replyLoading }] = useAddReplyInReviewMutation({});
  const course = courseData?.course;
  const isReviewExists = course?.reviews.find(
    (item: any) => (item.user._id === user._id)

  );
  const handleQuestion = () => {
    if (question.length === 0) {
      toast.error("Question can't be empty.");
    } else {
      addNewQuestion({
        question,
        courseId: id,
        contentId: data[activeVideo]._id,
      });
    }
  };
  const handleReviewReplySubmit = async () => {
    try {
      if (!reply.trim()) {
        toast.error("Reply can't be empty!");
        return;
      }

      await addReplyInReview({ comment: reply, reviewId, courseId: id }).unwrap();

      setReply("");  // clear input
      setReviewId("");
      toast.success("Reply submitted successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to submit reply");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setQuestion("");
      refetch();
      toast.success("Question Added Successfully!");
      socket.emit("notification", {
        title: "New question received.",
        message: `You have a new question in ${data[activeVideo].title}`,
        userId: user._id,
      });
    }
    if (error) {
      if ("data" in error) {
        const errorMsg = error.data as any;
        toast.error(errorMsg.message);
      }
    }
  }, [isSuccess, refetch, error]);

  const handleAnswerSubmit = async () => {
    if (!answer.trim()) return toast.error("Answer can't be empty!");

    try {
      await addAnsInQuestion({
        answer,
        courseId: id,
        contentId: data[activeVideo]._id,
        questionId,
      }).unwrap();

      setAnswer(""); // clear input
      toast.success("Answer submitted successfully!");
      refetch();
      socket.emit("notification", {
        title: "New question reply received.",
        message: `You have a new question reply in ${data[activeVideo].title}`,
        userId: user._id,
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to submit answer");
    }
  };


  // star rating renderer
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      return (
        <span
          key={index}
          onClick={() => setRating(starValue)}
          className="cursor-pointer text-[28px] transition"
        >
          {starValue <= rating ? (
            <AiFillStar className="text-yellow-400" />
          ) : (
            <AiOutlineStar className="text-yellow-400" />
          )}
        </span>
      );
    });
  };

  // handle review submit
  const handleReviewSubmit = async () => {
    if (!rating || !reviewText.trim()) {
      toast.error("Please give a rating and write a review!");
      return;
    }

    const newReview = {
      user: user,
      rating,
      comment: reviewText,
    };

    setReviews((prev) => [newReview, ...prev]);
    setReviewText("");
    setRating(0);

    // 🔥 Call backend API here to save review
    try {
      await addReviewInCourse({ review: reviewText, rating, courseId: id }).unwrap();
      reviewRefetch();
      toast.success("Review submitted successfully!");
      socket.emit("notification", {
        title: "New review received.",
        message: `A new user gave review in ${data[activeVideo].title}`,
        userId: user._id,
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  return (
    <>
      <div className="w-[90%] 800px:w-[86%] mt-[80px] py-4 m-auto">
        {/* Video Player */}
        <CoursePlayer
          title={data[activeVideo]?.title}
          videoId={data[activeVideo]?.videoUrl}
        />

        {/* Navigation Buttons */}
        <div className="w-full mt-6 flex items-center justify-between my-3 ">
          {/* Prev Lesson */}
          <div
            className={`px-4 py-2 rounded-md bg-blue-600 text-white flex items-center cursor-pointer transition 
            ${activeVideo === 0 ? "!cursor-not-allowed opacity-60" : ""}`}
            onClick={() =>
              setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
            }
          >
            <AiOutlineArrowLeft className="mr-2" />
            Prev Lesson
          </div>

          {/* Next Lesson */}
          <div
            className={`px-4 py-2 rounded-md bg-blue-600 text-white flex items-center cursor-pointer transition 
            ${data.length - 1 === activeVideo ? "!cursor-not-allowed opacity-60" : ""}`}
            onClick={() =>
              setActiveVideo(
                data && data.length - 1 === activeVideo
                  ? activeVideo
                  : activeVideo + 1
              )
            }
          >
            Next Lesson
            <AiOutlineArrowRight className="ml-2" />
          </div>
        </div>

        {/* Video Title */}
        <h1 className="pt-2 text-[25px] font-[600] dark:text-white text-gray-900">
          {data[activeVideo]?.title}
        </h1>
        <br />

        {/* Tabs */}
        <div className="w-full p-4 flex items-center justify-between bg-gray-200 dark:bg-gray-800 bg-opacity-40 backdrop-blur rounded shadow-inner">
          {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
            <h5
              key={index}
              className={`text-[18px] 800px:text-[20px] cursor-pointer transition 
              ${activeBar === index
                  ? "text-green-500 font-semibold"
                  : "dark:text-gray-200 text-gray-800"
                }`}
              onClick={() => setActiveBar(index)}
            >
              {text}
            </h5>
          ))}
        </div>

        <br />

        {/* Tab Content */}
        {activeBar === 0 && (
          <p className="text-[18px] whitespace-pre-line mb-3 dark:text-gray-200 text-gray-900">
            {data[activeVideo]?.description}
          </p>
        )}

        {activeBar === 1 && (
          <div>
            {data[activeVideo]?.links?.map((item: any, index: number) => (
              <div key={index} className="mb-5">
                <h2 className="text-[18px] 800px:text-[20px] inline-block 
                  dark:text-gray-200 text-gray-900 font-semibold">
                  {item.title && item.title + " :"}
                </h2>
                <a
                  className="inline-block ml-2 text-blue-500 text-[18px]"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.url}
                </a>
              </div>
            ))}
          </div>
        )}

        {activeBar === 2 && (
          <>
            <div className="w-full flex ">
              <Image
                src={user.avatar ? user.avatar.url : Avatar}
                width={50}
                height={50}
                alt="User_Avatar"
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
              <textarea
                name="question"
                id="question"
                cols={40}
                rows={5}
                placeholder="Write Your Question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="outline-none bg-transparent ml-3 border 
                border-gray-300 dark:border-gray-600 
                800px:w-full p-2 rounded w-[90%] 
                dark:text-gray-200 text-gray-900
                800px:text-[18px] font-family-poppins"
              ></textarea>
            </div>
            <div className="w-full flex justify-end">
              <div
                className={`${styles.button} !w-[120px] !h-[40px] text-[18px] mt-5 ${questionCreationLoading && "cursor-not-allowed"
                  }`}
                onClick={questionCreationLoading ? () => { } : handleQuestion}
              >
                Submit
              </div>
            </div>
            <br />
            <div className="w-full h-[1px] bg-gray-300 dark:bg-gray-600 "></div>
            <div>
              <CommentReply
                data={data}
                activeVideo={activeVideo}
                user={user}
                answer={answer}
                setAnswer={setAnswer}
                handleAnswerSubmit={handleAnswerSubmit}
                setQuestionId={setQuestionId}
              />
            </div>
          </>
        )}

        {activeBar === 3 && (
          <>
            {!isReviewExists && (
              <div className="w-full flex items-start">
                <Image
                  src={user.avatar ? user.avatar.url : Avatar}
                  width={50}
                  height={50}
                  alt="User_Avatar"
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />

                <div className="ml-3 w-full">
                  {/* Rating Stars */}
                  <h5 className="text-[16px] font-[500] dark:text-gray-200 text-gray-900 mb-2">
                    Give a Rating <span className="text-red-500">*</span>
                  </h5>
                  <div className="flex mb-3">{renderStars()}</div>

                  {/* Review Textarea */}
                  <textarea
                    name="review"
                    id="review"
                    cols={40}
                    rows={5}
                    placeholder="Write your review..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="outline-none bg-transparent border border-gray-300 dark:border-gray-600 
              800px:w-full p-2 rounded w-[90%] 
              dark:text-gray-200 text-gray-900
              800px:text-[18px] font-family-poppins"
                  ></textarea>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <div
                      className={`${styles.button} !w-[120px] !h-[40px] text-[18px] mt-5 cursor-pointer ${isreviewLoading && "cursor-not-allowed"
                        }`}
                      onClick={isreviewLoading ? () => { } : handleReviewSubmit}
                    >
                      Submit
                    </div>
                  </div>
                </div>
              </div>
            )}

            <br />
            <div className="w-full h-[1px] bg-gray-300 dark:bg-gray-600" />

            {/* Reviews List */}
            <div className="mt-5">
              <h3 className="text-[20px] font-semibold mb-3 dark:text-gray-200 text-gray-900">
                Reviews
              </h3>
              {course?.reviews.length === 0 ? (
                <p className="dark:text-gray-300 text-gray-700">No reviews yet.</p>
              ) : (
                course?.reviews.map((rev: any, index: number) => (
                  <div
                    key={index}
                    className="mb-5 p-3 border-gray-300 dark:border-gray-600"
                  >
                    <div className="flex items-center mb-2">
                      <Image
                        src={rev.user.avatar ? rev.user.avatar.url : Avatar}
                        width={40}
                        height={40}
                        alt="User_Avatar"
                        className="w-[40px] h-[40px] rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <h5 className="font-semibold dark:text-gray-200 text-gray-900">
                          {rev.user.name}
                        </h5>
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) =>
                            i < rev.rating ? (
                              <AiFillStar key={i} className="text-yellow-400" />
                            ) : (
                              <AiOutlineStar key={i} className="text-yellow-400" />
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="dark:text-gray-300 text-gray-700">{rev.comment}</p>

                    {user.role === "admin" && (
                      <span
                        className={`${styles.label} !ml-10 cursor-pointer`}
                        onClick={() =>
                          setReviewId(reviewId === rev._id ? null : rev._id)
                        }
                      >
                        {reviewId === rev._id ? "Cancel Reply" : "Add Reply"}
                      </span>
                    )}

                    {/* Reply Box - only shows for the active review */}
                    {reviewId === rev._id && (
                      <div className="w-full relative flex">
                        <input
                          type="text"
                          placeholder="Enter your reply..."
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          className="block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-gray-300 dark:border-gray-600 p-[5px] w-[95%] dark:text-gray-200 text-gray-900 "
                        />
                        <button
                          type="submit"
                          className="absolute right-0 bottom-1 text-blue-500"
                          onClick={handleReviewReplySubmit}
                          disabled={!reply.trim()}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                    {rev.commentReplies.map((i: any, index: number) => (
                      <div key={index} className="w-full flex ml-16 my-5">
                        {/* Avatar */}
                        <div className="w-[50px] h-[50px]">
                          <Image
                            src={i.user.avatar ? i.user.avatar.url : Avatar}
                            width={50}
                            height={50}
                            alt="User_Avatar"
                            className="w-[50px] h-[50px] rounded-full object-cover"
                          />
                        </div>

                        {/* Comment Content */}
                        <div className="pl-3 text-gray-900 dark:text-white">
                          <div className="flex items-center ">
                            <h5 className="text-[20px] ">{i.user.name}</h5> {i.user.role === "admin" && <VscVerifiedFilled className="text-blue-600 ml-1 text-[20px]" />}
                          </div>
                          <p>{i.comment}</p>
                          <small className="text-gray-600 dark:text-gray-500">
                            {format(i.createdAt, "Just now")}
                          </small>
                        </div>
                      </div>
                    ))}

                  </div>
                ))
              )}
            </div>
          </>
        )}

      </div>

    </>
  );
};

const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  user,
  setQuestionId,
  answerCreationLoadnig
}: any) => {
  if (!data || !data[activeVideo]) return null;

  return (
    <div className="w-full my-3">
      {data[activeVideo].questions?.map((item: any, index: number) => (
        <CommentItem
          key={index}
          data={data}
          activeVideo={activeVideo}
          item={item}
          index={index}
          answer={answer}
          setAnswer={setAnswer}
          handleAnswerSubmit={handleAnswerSubmit}
          user={user}
          setQuestionId={setQuestionId}
          answerCreationLoadnig={answerCreationLoadnig}
        />
      ))}
    </div>
  );
};

const CommentItem = ({
  item,
  answer,
  setAnswer,
  handleAnswerSubmit,
  setQuestionId,
  answerCreationLoadnig
}: any) => {
  const [replyActive, setReplyActive] = useState(false);

  return (
    <div className="my-4">
      <div className="flex mb-2">
        {/* Avatar */}
        <div>
          <Image
            src={item.user.avatar ? item.user.avatar.url : Avatar}
            width={50}
            height={50}
            alt="User_Avatar"
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
        </div>

        {/* Comment Content */}
        <div className="pl-3">
          <h5 className="text-[20px] font-medium text-gray-900 dark:text-white">
            {item?.user?.name}
          </h5>
          <p className="text-[15px] dark:text-gray-200 text-gray-900">
            {item?.question}
          </p>
          <small className="text-gray-500 dark:text-gray-400">
            {item?.createdAt ? format(item.createdAt) : "Just now"}
          </small>
        </div>
      </div>

      {/* Reply toggle */}
      <div className="w-full flex">
        <span
          className="800px:pl-16 text-gray-500 dark:text-gray-400 cursor-pointer mr-2"
          onClick={() => { setReplyActive(!replyActive), setQuestionId(item._id) }}
        >
          {!replyActive
            ? item.questionReplies.length !== 0
              ? "All Replies"
              : "Add Reply"
            : "Hide Replies"}
        </span>
        <BiMessage
          size={20}
          className=" cursor-pointer text-gray-500 dark:text-gray-400"
        />
        <span className="pl-1 mt-[-4px] cursor-pointer text-gray-500 dark:text-gray-400">
          {item.questionReplies.length}
        </span>
      </div>

      {/* Replies Section */}
      {replyActive && (
        <>
          {item.questionReplies.map((reply: any, idx: number) => (
            <div
              key={idx}
              className="w-full flex 800px:ml-16 my-5 text-gray-900 dark:text-white"
            >
              <div>
                <Image
                  src={reply.user.avatar ? reply.user.avatar.url : Avatar}
                  width={50}
                  height={50}
                  alt="User_Avatar"
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
              </div>
              <div className="pl-3">
                <div className="flex items-center">
                  <h5 className="text-[20px]">{reply.user.name}</h5> {reply.user.role === "admin" && <VscVerifiedFilled className="text-blue-600 ml-1 text-[20px]" />}
                </div>
                <p className="dark:text-gray-200 text-gray-900" >{reply.answer}</p>
                <small className="text-gray-500 dark:text-gray-400">
                  {reply?.createdAt ? format(reply.createdAt) : "Just now"}
                </small>
              </div>
            </div>
          ))}

          {/* Reply Input */}
          <div className="w-full flex relative text-gray-900 dark:text-white">
            <input
              type="text"
              placeholder="Enter your answer..."
              value={answer}
              onChange={(e: any) => setAnswer(e.target.value)}
              className={`block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-gray-300 dark:border-gray-600 p-[5px] w-[95%] ${!answer.trim() || answerCreationLoadnig && "cursor-not-allowed"}`}
            />
            <button
              type="submit"
              className="absolute right-0 bottom-1 text-blue-500"
              onClick={handleAnswerSubmit}
              disabled={!answer.trim() || answerCreationLoadnig}
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseContentMedia;
