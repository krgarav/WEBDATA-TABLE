import React, { useEffect, useState } from "react";
import { GrPrevious } from "react-icons/gr";
import { MdOutlineArrowForwardIos } from "react-icons/md";

const ImageDataEntrySection = ({ data }) => {
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    setImageUrl(`${window.SERVER_IP}/images/${data.imageName}`);
  });
  return (
    <div className="flex gap-5 justify-center items-center">
      <div className="text-white px-3 py-8 bg-blue-400 rounded-3xl mx-2 hover:bg-blue-600 text-lg transition-all cursor-pointer">
        <button>
          <GrPrevious />
        </button>
      </div>
      <div>
        <div
          className="bg-white rounded-lg shadow-lg"
          style={{
            position: "relative",
            border: "2px solid #007bff",
            width: "55rem",
            height: "23rem",
            overflow: "auto",
            scrollbarWidth: "thin",
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Selected"
              style={{
                width: "48rem",
                // transform: `scale(${zoomLevel})`,
                transformOrigin: "center center",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.8)",
              }}
              draggable={false}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ff0000",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              Image not found
            </div>
          )}

          <div
            style={{
              border: "2px solid rgba(0, 123, 255, 0.8)",
              position: "absolute",
              backgroundColor: "rgba(0, 123, 255, 0.2)",
              //   left: `${data.coordinateX}px`,
              //   top: `${data.coordinateY}px`,
              //   width: `${data.width}px`,
              //   height: `${data.height}px`,
              //   transform: `scale(${zoomLevel})`,
              transformOrigin: "center center",
              borderRadius: "0.25rem",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          ></div>
        </div>
      </div>
      <div className="text-white px-3 py-8 bg-blue-400 rounded-3xl mx-2 hover:bg-blue-600 text-lg transition-all cursor-pointer">
        <button>
          <MdOutlineArrowForwardIos />
        </button>
      </div>
    </div>
  );
};

export default ImageDataEntrySection;
