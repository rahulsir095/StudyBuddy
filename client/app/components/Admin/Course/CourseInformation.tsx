import React, { FC, useEffect, useState } from "react";
import { styles } from "@/app/styles/style";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import Image from "next/image";

type CourseInfo = {
  name: string;
  description: string;
  categories: string;
  price: string;
  estimatedPrice: string;
  tags: string;
  level: string;
  demoUrl: string;
  thumbnail: string;
};


type Props = {
  courseInfo: CourseInfo;
  setCourseInfo: React.Dispatch<React.SetStateAction<CourseInfo>>;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
};

const CourseInformation: FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
}) => {
  const [dragging, setDragging] = useState(false);
  const { data } = useGetHeroDataQuery("Categories", {});
  const [categories, setCategories] = useState<{ title: string }[]>([]);

  useEffect(() => {
    if (data) {
      setCategories(data.layout.categories);
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24">
      <form onSubmit={handleSubmit}>
        {/* Course Name */}
        <div>
          <label htmlFor="name" className={styles.label}>
            Course Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={courseInfo.name}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, name: e.target.value })
            }
            placeholder="Enter course name"
            className={styles.input}
          />
        </div>

        <br />

        {/* Course Description */}
        <div className="mb-5">
          <label htmlFor="description" className={styles.label}>
            Course Description
          </label>
          <textarea
            id="description"
            cols={30}
            rows={6}
            required
            placeholder="Write something amazing..."
            className={`${styles.input} !h-min !py-2`}
            value={courseInfo.description}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
          />
        </div>

        <br />

        {/* Price & Estimated Price */}
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label htmlFor="price" className={styles.label}>
              Course Price
            </label>
            <input
              type="number"
              id="price"
              required
              value={courseInfo.price}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
              placeholder="2000"
              className={styles.input}
            />
          </div>
          <div className="w-[50%]">
            <label htmlFor="estimatedPrice" className={styles.label}>
              Estimated Price
            </label>
            <input
              type="number"
              id="estimatedPrice"
              required
              value={courseInfo.estimatedPrice}
              onChange={(e) =>
                setCourseInfo({
                  ...courseInfo,
                  estimatedPrice: e.target.value,
                })
              }
              placeholder="3000"
              className={styles.input}
            />
          </div>
        </div>

        <br />

        {/* Tags & Category */}
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label htmlFor="tags" className={styles.label}>
              Course Tags
            </label>
            <input
              type="text"
              id="tags"
              required
              value={courseInfo.tags}
              onChange={(e) =>
                setCourseInfo({
                  ...courseInfo,
                  tags: e.target.value,
                })
              }
              placeholder="MERN, NEXT, Tailwind, Material UI"
              className={styles.input}
            />

          </div>

          <div className="w-[50%]">
            <label htmlFor="category" className={styles.label}>
              Course Category
            </label>
            <select
              id="category"
              required
              value={courseInfo.categories || ""}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, categories: e.target.value })
              }
              className={styles.input}
            >
              <option value="">Select a category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <br />

        {/* Level & Demo URL */}
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label htmlFor="level" className={styles.label}>
              Course Level
            </label>
            <input
              type="text"
              id="level"
              required
              value={courseInfo.level}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
              placeholder="Beginner / Intermediate / Expert"
              className={styles.input}
            />
          </div>
          <div className="w-[50%]">
            <label htmlFor="demoUrl" className={styles.label}>
              Demo URL
            </label>
            <input
              type="text"
              id="demoUrl"
              required
              value={courseInfo.demoUrl}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
              }
              placeholder="68a20795396b42f2f6888f38"
              className={styles.input}
            />
          </div>
        </div>

        <br />

        {/* Thumbnail Upload */}
        <div className="w-full">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center cursor-pointer ${dragging ? "bg-blue-500" : "bg-transparent"
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {courseInfo.thumbnail ? (
              <Image
                src={courseInfo.thumbnail}
                alt="Thumbnail"
                width={800}
                height={400}
                className="max-h-full w-full object-cover"
              />
            ) : (
              <span className="text-black dark:text-white">
                Drag & drop your thumbnail here or click to browse
              </span>
            )}
          </label>
        </div>

        <br />

        {/* Next Button */}
        <div className="flex justify-end mt-2 mb-8">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Next →
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseInformation;