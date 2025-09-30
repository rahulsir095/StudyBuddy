"use client";
import React, { FC, useState } from "react";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";

type Props = {
  data: any[];
  activeVideo?: number;
  setActiveVideo?: (id: number) => void;
  isDemo?: boolean;
};

const formatTime = (minutes: number) => {
  if (!minutes || minutes <= 0) return "0 m";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs > 0 ? `${hrs} hr ${mins} min` : `${mins} min`;
};

const CourseContentList: FC<Props> = ({ data, activeVideo, setActiveVideo, isDemo }) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  // Unique sections
  const videoSections: string[] = [...new Set(data.map((item: any) => item.videoSection))];

  const toggleSection = (section: string) => {
    const updated = new Set(visibleSections);
    if (updated.has(section)) {
      updated.delete(section);
    } else {
      updated.add(section);
    }
    setVisibleSections(updated);
  };

  return (
    <div
      className={`mt-4 w-full ${!isDemo &&
        "ml-[-3px] min-h-screen sticky top-24 left-0 z-30 overflow-y-auto mt-[100px]"
        }`}
    >
      {videoSections.map((section: string, sectionIndex: number) => {
        const sectionVideos: any[] = data.filter(
          (item: any) => item.videoSection === section
        );

        // total duration (in minutes)
        const totalMinutes = sectionVideos.reduce(
          (acc, video) => acc + (video.videoLength || 0),
          0
        );

        return (
          <div
            key={`section-${sectionIndex}`}
            className={`mb-4 ${!isDemo && "border-b dark:border-[#ffffff3a] pb-3"}`}
          >
            {/* Section Header */}
            <div
              className="w-full flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection(section)}
            >
              <div>
                <h2 className="text-[18px] font-semibold text-black dark:text-white">
                  {section}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {sectionVideos.length} Lessons • {formatTime(totalMinutes)}
                </p>
              </div>
              <button className="mr-5 text-black dark:text-white cursor-pointer">
                {visibleSections.has(section) ? (
                  <BsChevronUp size={20} />
                ) : (
                  <BsChevronDown size={20} />
                )}
              </button>
            </div>

            {/* Videos inside this section */}
            {visibleSections.has(section) && (
              <div className="mt-3 space-y-3">
                {sectionVideos.map((video: any, videoIndex: number) => {
                  const videoIndexGlobal = data.findIndex((v) => v._id === video._id);

                  const isActive = !isDemo && activeVideo === videoIndexGlobal;

                  return (
                    <div
                      key={video._id || `video-${sectionIndex}-${videoIndex}`}
                      onClick={() => {
                        if (!isDemo && setActiveVideo) {
                          setActiveVideo(videoIndexGlobal);
                        }
                      }}
                      className={`p-2 rounded-md transition cursor-pointer 
                        ${isActive
                          ? "bg-blue-100 dark:bg-slate-700"
                          : "hover:bg-gray-200 dark:hover:bg-slate-600"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <MdOutlineOndemandVideo
                          size={20}
                          className={`flex-shrink-0 ${isActive ? "text-blue-600" : "text-blue-500"}`}
                        />
                        <div>
                          <span className="block text-black dark:text-white">
                            {video.title}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatTime(video.videoLength)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;
