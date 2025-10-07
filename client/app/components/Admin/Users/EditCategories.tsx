"use client";

import { useEditLayoutMutation, useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";
import { IoMdAddCircle } from "react-icons/io";

type Category = {
  title: string;
};

const EditCategories: React.FC = () => {
  const { data, isLoading } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout] = useEditLayoutMutation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [originalCategories, setOriginalCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (data?.layout?.categories) {
      setCategories(data.layout.categories as Category[]);
      setOriginalCategories(data.layout.categories as Category[]);
    }
  }, [data]);

  const areCategoriesUnchanged = (): boolean => {
    return JSON.stringify(categories) === JSON.stringify(originalCategories);
  };

  const hasEmptyCategory = (): boolean => {
    return categories.some((c) => !c.title.trim());
  };

  const handleChange = (index: number, value: string) => {
    setCategories((prev) =>
      prev.map((c, i) => (i === index ? { ...c, title: value } : c))
    );
  };

  const deleteCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const addCategory = () => {
    if (categories.length > 0 && !categories[categories.length - 1].title.trim()) {
      toast.error("Please fill the previous category before adding a new one");
      return;
    }
    setCategories((prev) => [...prev, { title: "" }]);
  };

  const handleSave = async () => {
    if (hasEmptyCategory()) {
      toast.error("Category title cannot be empty");
      return;
    }

    try {
      await editLayout({
        type: "Categories",
        categories: categories.map(({ title }) => ({ title })),
      }).unwrap();

      toast.success("Categories updated successfully!");
      setOriginalCategories(categories);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || "Failed to update categories");
    }
  };

  const disableSave = areCategoriesUnchanged() || hasEmptyCategory();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${styles.title}`}>All Categories</h1>

          {/* Categories List */}
          <div className="mt-6 flex flex-col gap-4 items-center">
            {categories.map((category, index) => (
              <div key={index} className="p-3 w-full max-w-[500px]">
                <div className="flex items-center w-full justify-center gap-3">
                  <input
                    className={`${styles.input} !w-[unset] !border-none !text-[20px] text-black dark:text-white`}
                    value={category.title}
                    onChange={(e) => handleChange(index, e.target.value)}
                    placeholder="Enter category title..."
                  />
                  <AiOutlineDelete
                    className="dark:text-white text-black text-[20px] cursor-pointer"
                    onClick={() => deleteCategory(index)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add Category Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={addCategory}
              className="flex items-center dark:text-amber-50 text-black"
            >
              <IoMdAddCircle className="text-[28px]" />
            </button>
          </div>

          {/* Save Button fixed at bottom-right */}
          <div
            className={`fixed bottom-30 right-10 w-[120px] h-[48px] flex items-center justify-center rounded ${
              disableSave
                ? "cursor-not-allowed bg-gray-400"
                : "cursor-pointer bg-[#42d383]"
            }`}
            onClick={() => {
              if (!disableSave) handleSave();
            }}
          >
            Save
          </div>
        </div>
      )}
    </>
  );
};

export default EditCategories;
