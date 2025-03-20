import React from "react";

const DuplicateImage = ({ currentImageIndex, currentRowData, imageUrl }) => {
  return (
    <div className="mx-auto max-w-screen-xl px-2 lg:py-1 sm:px-6 lg:px-8">
      <h2 className="text-center text-lg my-3 font-bold text-white w-full ">
        {/* {currentImageIndex + 1} out of {currentRowData?.imagePaths.length} */}
      </h2>

      {/* <div className=" flex justify-center ">
        <div className="">
          {imageUrl && (
            <div
              style={{
                position: "relative",
              }}
              className="w-full overflow-y-auto pb-4"
            >
              <img
                src={`${window.SERVER_IP}/images/${imageUrl}`}
                alt="Selected"
                style={{
                  width: "48rem",
                  height: "49rem",
                }}
                draggable={false}
              />
            </div>
          )}
        </div>
      </div> */}
      <div className="flex justify-center">
        <div className="max-w-full max-h-[49rem] overflow-auto">
          {imageUrl && (
            <div
              style={{
                position: "relative",
              }}
              className="w-full overflow-auto"
            >
              <img
                src={`${window.SERVER_IP}/images/${imageUrl}`}
                alt="Selected"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
                draggable={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DuplicateImage;
