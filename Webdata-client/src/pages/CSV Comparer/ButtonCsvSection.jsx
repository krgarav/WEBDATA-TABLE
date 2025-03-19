import React from "react";
import { ImZoomIn, ImZoomOut } from "react-icons/im";

const ButtonCsvSection = ({
  currentIndex,
  csvData,
  totalData,
  correctionData,
  zoomInHandler,
  onInialImageHandler,
  zoomOutHandler,
  currentImageIndex,
  imageUrls,
  currentData,
}) => {
  return (
    <div className="flex justify-evenly items-center ml-2">
      <h3 className="text-sm 2xl:text-lg font-semibold py-3 text-white mr-4">
        Data No : {currentIndex} out of {totalData}
      </h3>
      <div className="flex my-3">
        <button
          onClick={zoomInHandler}
          className="px-2 2xl:px-6 py-2 bg-blue-400 text-white rounded-lg mx-1 hover:bg-blue-500"
        >
          <ImZoomIn />
        </button>

        <button
          onClick={onInialImageHandler}
          className="px-2 2xl:px-6 py-2 bg-blue-400 text-white rounded-lg mx-1 hover:bg-blue-500"
        >
          Initial
        </button>
        <button
          onClick={zoomOutHandler}
          className="px-2 2xl:px-6 py-2 bg-blue-400 text-white rounded-lg mx-1 hover:bg-blue-500"
        >
          <ImZoomOut />
        </button>
      </div>
      <h3 className=" text-sm 2xlxl:text-lg font-semibold py-3 text-white px-4">
        Image Name - <span className="font-light">{imageUrls}</span>
      </h3>
    </div>
  );
};

export default ButtonCsvSection;
