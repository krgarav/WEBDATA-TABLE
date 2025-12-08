import React, { useEffect, useRef, useState } from "react";
import { GrPrevious } from "react-icons/gr";
import { MdOutlineArrowForwardIos } from "react-icons/md";

const ImageDataEntrySection = ({
  data,
  imageData,
  prevHandler,
  nextHandler,
  imageRef,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [zoomLevel] = useState(1); // Keep it normal, no auto shrinking

  const imageContainerRef = useRef();

  useEffect(() => {
    setImageUrl(`${window.SERVER_IP}/images/${data.imageName}`);
  }, [data]);
  console.log(imageData)

  useEffect(() => {
    if (imageData && imageRef.current && imageContainerRef.current) {
      const { coordinateX, coordinateY, width, height } = imageData;

      const containerWidth = imageContainerRef.current.offsetWidth || 0;
      const containerHeight = imageContainerRef.current.offsetHeight || 0;

      // Keep zoom at 1 (normal scale)
      imageRef.current.style.transform = `scale(${zoomLevel})`;
      imageRef.current.style.transformOrigin = `0 0`;

      // Just scroll to center the selected field
      const scrollX = coordinateX - containerWidth / 2 + width / 2;
      const scrollY = coordinateY - containerHeight / 2 + height / 2;

      imageContainerRef.current.scrollTo({
        left: scrollX,
        top: scrollY,
        behavior: "smooth",
      });
    }
  }, [imageData, imageRef, zoomLevel]);

  console.log(imageData)

  return (
    <div className="flex gap-5 justify-center items-center">
      {/* Prev button */}
      {/* <div
        onClick={prevHandler}
        className="text-white px-3 py-8 bg-blue-400 rounded-3xl mx-2 hover:bg-blue-800 text-lg transition-all cursor-pointer"
      >
        <button>
          <GrPrevious />
        </button>
      </div> */}

      {/* Image container */}
      <div>
        <div
          className="bg-white rounded-lg shadow-lg"
          ref={imageContainerRef}
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
              ref={imageRef}
              alt="Selected"
              style={{
                width: "48rem", // fixed readable width
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

          {/* Highlight Box */}
          {imageData && (
            <div
              style={{
                border: "2px solid rgba(0, 123, 255, 0.8)",
                position: "absolute",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                left: `${imageData.coordinateX }px`,
                top: `${imageData.coordinateY }px`,
                width: `${imageData.width}px`,
                height: `${imageData.height}px`,
                borderRadius: "0.25rem",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            ></div>
          )}
        </div>
      </div>

      {/* Next button */}
      {/* <div
        onClick={nextHandler}
        className="text-white px-3 py-8 bg-blue-400 rounded-3xl mx-2 hover:bg-blue-800 text-lg transition-all cursor-pointer"
      >
        <button>
          <MdOutlineArrowForwardIos />
        </button>
      </div> */}
    </div>
  );
};

export default ImageDataEntrySection;
