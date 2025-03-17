import React, { useEffect, useRef, useState } from "react";
import { GrPrevious } from "react-icons/gr";
import { MdOutlineArrowForwardIos } from "react-icons/md";

const ImageDataEntrySection = ({
  data,
  imageData,
  prevHandler,
  nextHandler,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const imageRef = useRef();
  const imageContainerRef = useRef();
  useEffect(() => {
    setImageUrl(`${window.SERVER_IP}/images/${data.imageName}`);
  });
  useEffect(() => {
    if (imageData) {
      const { coordinateX, coordinateY, width, height } = imageData;

      const containerWidth = imageContainerRef.current.offsetWidth || 0;
      const containerHeight = imageContainerRef.current.offsetHeight || 0;

      // Calculate the zoom level based on container size and area size
      const zoomLevel = Math.min(
        containerWidth / width,
        containerHeight / height
      );

      // Calculate the scroll position to center the selected area
      const scrollX =
        coordinateX * zoomLevel - containerWidth / 2 + (width / 2) * zoomLevel;
      const scrollY =
        coordinateY * zoomLevel -
        containerHeight / 2 +
        (height / 2) * zoomLevel;

      // Check if imageRef.current is available before updating style
      if (imageRef.current) {
        imageRef.current.style.transform = `scale(${zoomLevel})`;
        imageRef.current.style.transformOrigin = `0 0`;
      }

      // Scroll to the calculated position if container reference is available
      imageContainerRef.current?.scrollTo({
        left: scrollX,
        top: scrollY,
        behavior: "smooth",
      });
    }
  }, [imageData]);

  return (
    <div className="flex gap-5 justify-center items-center">
      <div
        onClick={() => {
          prevHandler();
        }}
        className="text-white px-3 py-8 bg-blue-400 rounded-3xl mx-2 hover:bg-blue-600 text-lg transition-all cursor-pointer"
      >
        <button>
          <GrPrevious />
        </button>
      </div>
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
              left: `${imageData?.coordinateX}px`,
              top: `${imageData?.coordinateY}px`,
              width: `${imageData?.width}px`,
              height: `${imageData?.height}px`,
              //   transform: `scale(${zoomLevel})`,
              transformOrigin: "center center",
              borderRadius: "0.25rem",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          ></div>
        </div>
      </div>
      <div
        onClick={() => {
          nextHandler();
        }}
        className="text-white px-3 py-8 bg-blue-400 rounded-3xl mx-2 hover:bg-blue-600 text-lg transition-all cursor-pointer"
      >
        <button>
          <MdOutlineArrowForwardIos />
        </button>
      </div>
    </div>
  );
};

export default ImageDataEntrySection;
