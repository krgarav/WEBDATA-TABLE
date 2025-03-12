import React, { useEffect, useState } from "react";

const ButtonDataEntrySection = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [imageName, setImageName] = useState("");

  useEffect(() => {
    setCurrentIndex(data.currentIndex);
    setTotalErrors(data.total_error);
    setImageName(data.imageName);
  }, [data]);

  return (
    <div className="flex justify-between h-16 items-center w-full px-4">
      <h3 className="ms-5 text-sm 2xl:text-lg font-semibold py-3 text-white">
        Data No : {currentIndex} out of {totalErrors}
      </h3>
      <div className="flex justify-center my-3 ">
        <button className="px-6 py-2 bg-blue-400 text-white rounded-3xl mx-2 hover:bg-blue-600 transition-all text-sm 2xl:text-lg">
          Zoom In
        </button>
        <button className="px-6 py-2 bg-blue-400 text-white rounded-3xl mx-2 hover:bg-blue-600 transition-all text-sm 2xl:text-lg">
          Initial
        </button>
        <button className="px-6 py-2 bg-blue-400 text-white rounded-3xl mx-2 hover:bg-blue-600 transition-all text-sm 2xl:text-lg">
          Zoom Out
        </button>
      </div>
      <h3 className="font-semibold py-3 text-white text-sm 2xl:text-lg">
        {" "}
        Image Name : {imageName}
      </h3>
    </div>
  );
};

export default ButtonDataEntrySection;
