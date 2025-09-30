import { styles } from '@/app/styles/style';
import React, { FC } from 'react';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import toast from "react-hot-toast";

type Props = {
  benefits: { title: string }[];
  setBenefits: (benefits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: (prerequisites: { title: string }[]) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseData: FC<Props> = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}) => {
  //  Handlers for benefits
  const handleBenefitChange = (index: number, value: string) => {
    const updated = benefits.map((benefit, i) =>
      i === index ? { ...benefit, title: value } : benefit
    );
    setBenefits(updated);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "" }]);
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  //  Handlers for prerequisites
  const handlePrerequisiteChange = (index: number, value: string) => {
    const updated = prerequisites.map((pre, i) =>
      i === index ? { ...pre, title: value } : pre
    );
    setPrerequisites(updated);
  };

  const handleAddPrerequisite = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };

  const handleRemovePrerequisite = (index: number) => {
    setPrerequisites(prerequisites.filter((_, i) => i !== index));
  };

  //  Validation before moving to next
  const handleNext = () => {
    if (benefits.some((b) => !b.title.trim())) {
      toast.error("Please fill all benefit fields");
      return;
    }
    if (prerequisites.some((p) => !p.title.trim())) {
      toast.error("Please fill all prerequisite fields");
      return;
    }
    setActive(active + 1);
  };

  return (
    <div className="w-[80%] m-auto mt-24 block space-y-10">
      {/*  Benefits Section */}
      <div>
        <label className={`${styles.label} text-[20px]`}>
          What are the benefits for the student in this course?
        </label>
        <br />

        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-3 my-2">
            <input
              type="text"
              required
              className={`${styles.input}`}
              value={benefit.title}
              onChange={(e) => handleBenefitChange(index, e.target.value)}
              placeholder="You will be able to build amazing web applications"
            />
            {benefits.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveBenefit(index)}
                className="text-red-500 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddBenefit}
          className="flex items-center gap-2 text-blue-500 mt-2"
        >
          <AddCircleIcon /> Add Benefit
        </button>
      </div>

      {/*  Prerequisites Section */}
      <div>
        <label className={`${styles.label} text-[20px]`}>
          What are the prerequisites for this course?
        </label>
        <br />

        {prerequisites.map((pre, index) => (
          <div key={index} className="flex items-center gap-3 my-2">
            <input
              type="text"
              required
              className={`${styles.input}`}
              value={pre.title}
              onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
              placeholder="Basic knowledge of JavaScript"
            />
            {prerequisites.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemovePrerequisite(index)}
                className="text-red-500 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddPrerequisite}
          className="flex items-center gap-2 text-blue-500 mt-2"
        >
          <AddCircleIcon /> Add Prerequisite
        </button>
      </div>

      {/*  Navigation Buttons */}
      <div className="flex justify-between mt-10">
        <button
          type="button"
          onClick={() => setActive(active - 1)}
          className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default CourseData;
