import React, { FC, useState, Dispatch, SetStateAction } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BsPencil, BsLink45Deg } from "react-icons/bs";
import toast from "react-hot-toast";

type Link = {
  title: string;
  url: string;
};

type Content = {
  title: string;
  videoUrl: string;
  description: string;
  videoLength:string;
  links: Link[];
  videoSection: string;
  suggestion: string;
};

type Props = {
  courseContentData: Content[];
  setCourseContentData: Dispatch<SetStateAction<Content[]>>;
  active: number;
  setActive: (active: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

const CourseContent: FC<Props> = ({
  courseContentData,
  setCourseContentData,
  active,
  setActive,
  handleSubmit,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean[]>(
    Array(courseContentData.length).fill(false)
  );
  const [editingSection, setEditingSection] = useState<number | null>(null);

  const handleCollapseToggle = (index: number) => {
    setIsCollapsed((prev) =>
      prev.map((val, i) => (i === index ? !val : val))
    );
  };

  const handleDelete = (index: number) => {
    if (courseContentData.length === 1) return;
    setCourseContentData((prev) => prev.filter((_, i) => i !== index));
    setIsCollapsed((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    index: number,
    field: keyof Content,
    value: string
  ) => {
    setCourseContentData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleLinkChange = (
    contentIndex: number,
    linkIndex: number,
    field: keyof Link,
    value: string
  ) => {
    setCourseContentData((prev) =>
      prev.map((item, i) =>
        i === contentIndex
          ? {
              ...item,
              links: item.links.map((link, li) =>
                li === linkIndex ? { ...link, [field]: value } : link
              ),
            }
          : item
      )
    );
  };

  const addLink = (contentIndex: number) => {
    setCourseContentData((prev) =>
      prev.map((item, i) =>
        i === contentIndex
          ? {
              ...item,
              links: [...item.links, { title: "", url: "" }],
            }
          : item
      )
    );
  };

  const validateFields = () => {
    for (const section of courseContentData) {
      if (!section.title.trim() || !section.videoUrl.trim()) {
        toast.error("Please fill all required fields (Title & Video URL).");
        return false;
      }
    }
    return true;
  };

  const addNewContent = (sectionName: string) => {
    if (!validateFields()) return;
    setCourseContentData((prev) => [
      ...prev,
      {
        title: "",
        videoUrl: "",
        description: "",
        videoLength:"",
        links: [{ title: "", url: "" }],
        videoSection: sectionName,
        suggestion: "",
      },
    ]);
    setIsCollapsed((prev) => [...prev, true]);
  };

  const addNewSection = () => {
    if (!validateFields()) return;
    const sectionName = `Section ${courseContentData.length + 1}`;
    addNewContent(sectionName);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;
    setActive(active + 1);
    handleSubmit(e);
  };

  return (
    <div className="w-[80%] m-auto mt-24 p-3">
      <form onSubmit={handleNext}>
        {courseContentData?.map((item, index) => {
          const showSectionInput =
            index === 0 ||
            item.videoSection !== courseContentData[index - 1].videoSection;

          return (
            <div
              key={index}
              className={`w-full bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow ${
                showSectionInput ? "mt-10" : "mb-0"
              }`}
            >
              {/* Section Title */}
              {showSectionInput && (
                <div className="flex items-center justify-between mb-3">
                  {editingSection === index ? (
                    <input
                      type="text"
                      value={item.videoSection}
                      onChange={(e) =>
                        handleInputChange(index, "videoSection", e.target.value)
                      }
                      onBlur={() => setEditingSection(null)}
                      className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
                      autoFocus
                    />
                  ) : (
                    <h3 className="text-lg font-semibold text-black dark:text-white flex items-center">
                      {item.videoSection || "Untitled Section"}
                      <BsPencil
                        className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={() => setEditingSection(index)}
                      />
                    </h3>
                  )}
                </div>
              )}

              {/* Header Row (Delete + Collapse) */}
              <div className="flex w-full items-center justify-end">
                {courseContentData.length > 1 && (
                  <AiOutlineDelete
                    className="text-black dark:text-white text-[20px] mr-2 cursor-pointer hover:text-red-500 transition"
                    onClick={() => handleDelete(index)}
                  />
                )}
                <MdOutlineKeyboardArrowDown
                  className="text-black dark:text-white text-[35px] cursor-pointer hover:text-blue-500 transition"
                  style={{
                    transform: isCollapsed[index]
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                  onClick={() => handleCollapseToggle(index)}
                />
              </div>

              {/* Collapsed View */}
              {!isCollapsed[index] && (
                <div className="mt-3">
                  <ul className="list-decimal ml-6 text-sm text-gray-700 dark:text-gray-300">
                    <li>{item.title || "Untitled Video"}</li>
                  </ul>
                </div>
              )}

              {/* Expanded Form */}
              {isCollapsed[index] && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block font-medium mb-1 text-black dark:text-gray-200">
                      Video Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        handleInputChange(index, "title", e.target.value)
                      }
                      placeholder="Enter video title"
                      className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-black dark:text-gray-200">
                      Video URL
                    </label>
                    <input
                      type="text"
                      value={item.videoUrl}
                      onChange={(e) =>
                        handleInputChange(index, "videoUrl", e.target.value)
                      }
                      placeholder="Enter video URL"
                      className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-black dark:text-gray-200">
                      Video Length (in minutes)
                    </label>
                    <input
                      type="string"
                      value={item.videoLength}
                      onChange={(e) =>
                        handleInputChange(index, "videoLength", e.target.value)
                      }
                      placeholder="Enter video Length"
                      className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-black dark:text-gray-200">
                      Video Description
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        handleInputChange(index, "description", e.target.value)
                      }
                      placeholder="Enter video description"
                      className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  {/* Links */}
                  <div>
                    <label className="block font-medium mb-1 text-black dark:text-gray-200">
                      Source Code Links
                    </label>
                    {item.links.map((link, linkIndex) => (
                      <div key={linkIndex} className="mb-3">
                        <input
                          type="text"
                          value={link.title}
                          onChange={(e) =>
                            handleLinkChange(
                              index,
                              linkIndex,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Link Title"
                          className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600 mb-2"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) =>
                            handleLinkChange(
                              index,
                              linkIndex,
                              "url",
                              e.target.value
                            )
                          }
                          placeholder="Link URL"
                          className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addLink(index)}
                      className="flex items-center text-black dark:text-white mt-1 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400"
                    >
                      <BsLink45Deg className="mr-1" /> Add Link
                    </button>
                  </div>

                  {/* Add Content Inside Section */}
                  <div className="flex gap-3 mt-3">
                    <button
                      type="button"
                      onClick={() => addNewContent(item.videoSection)}
                      className="px-3 py-1 bg-green-600 text-white rounded transition transform hover:scale-105 hover:bg-green-700 shadow"
                    >
                      + Add New Content
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add New Section */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={addNewSection}
            className="px-3 py-2 bg-purple-600 text-white rounded transition transform hover:scale-105 hover:bg-purple-700 shadow"
          >
            + Add New Section
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setActive(active - 1)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg transition transform hover:scale-105 hover:bg-gray-700 shadow"
            >
              ← Previous
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg transition transform hover:scale-105 hover:bg-blue-700 shadow"
            >
              Next →
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CourseContent;