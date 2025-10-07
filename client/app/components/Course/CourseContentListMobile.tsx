"use client";
import React, { FC, useState } from "react";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";

interface Data {
  _id: string;
  title: string;
  description: string;
  videoSection: string;
  videoLength: number;
  links?: { title?: string; url: string }[];
  videoUrl: string;
}
type Props = {
  data: Data[];
  activeVideo?: number;
  setActiveVideo?: (id: number) => void;

};

const formatTime = (minutes: number) => {
  if (!minutes || minutes <= 0) return "0 m";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs > 0 ? `${hrs} hr ${mins} min` : `${mins} min`;
};

const CourseContentListMobile: FC<Props> = ({ data, activeVideo, setActiveVideo }) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [openList, setOpenList] = useState(false);

  // Unique sections
  const sections = Array.from(new Set(data.map((v: Data) => v.videoSection)));

  const toggleSection = (section: string) => {
    const updated = new Set(openSections);
    if (updated.has(section)) updated.delete(section);
    else updated.add(section);
    setOpenSections(updated);
  };

  return (
    <div className="block 800px:hidden w-full">
      <button
        className="w-full p-3 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 text-gray-900 rounded font-semibold text-center"
        onClick={() => setOpenList(!openList)}
      >
        {openList ? "Hide Chapters" : "Show Chapters"}
      </button>

      {openList && (
        <div className="mt-2 max-h-[60vh] overflow-y-auto rounded p-2">
          {sections.map((section) => {
            const sectionVideos = data.filter((v) => v.videoSection === section);
            const totalMinutes = sectionVideos.reduce(
              (acc, video) => acc + (video.videoLength || 0),
              0
            );

            return (
              <div key={section} className="mb-3 border-b dark:border-gray-600 pb-2">
                {/* Section Header */}
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection(section)}
                >
                  <div>
                    <h2 className="text-lg font-semibold text-black dark:text-white">{section}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {sectionVideos.length} Lessons • {formatTime(totalMinutes)}
                    </p>
                  </div>
                  <div>
                    {openSections.has(section) ? (
                      <BsChevronUp size={18} className="text-black dark:text-white" />
                    ) : (
                      <BsChevronDown size={18} className="text-black dark:text-white" />
                    )}
                  </div>
                </div>

                {/* Videos */}
                {openSections.has(section) && (
                  <div className="mt-2 space-y-2">
                    {sectionVideos.map((video) => {
                      const idx = data.findIndex((v) => v._id === video._id);
                      const isActive = activeVideo === idx;
                      return (
                        <div
                          key={video._id}
                          onClick={() => setActiveVideo && setActiveVideo(idx)}
                          className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition ${
                            isActive
                              ? "bg-blue-100 dark:bg-slate-700"
                              : "hover:bg-gray-200 dark:hover:bg-slate-600"
                          }`}
                        >
                          <MdOutlineOndemandVideo
                            size={20}
                            className={`${isActive ? "text-blue-600" : "text-blue-500"}`}
                          />
                          <div>
                            <p className="text-black dark:text-white">{video.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatTime(video?.videoLength)}
                            </p>
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
      )}
    </div>
  );
};

export default CourseContentListMobile;
