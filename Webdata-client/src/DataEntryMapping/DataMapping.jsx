import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import FormDataEntrySection from "./FormDataSection";
import ButtonDataEntrySection from "./ButtonDataEntrySection";
import ImageDataEntrySection from "./ImageDataEntrySection";
import QuestionDataEntrySection from "./QuestionDataEntrySection";
import { updateCsvData, updateCurrentIndex } from "../services/common";

const DataMapping = () => {
  const token = JSON.parse(localStorage.getItem("userData"));
  const taskData = JSON.parse(localStorage.getItem("taskdata"));

  const [data, setData] = useState([]);
  const [imageData, setImageData] = useState([]);
  const [currentIndex, setCurrenIndex] = useState(null);
  const [formData, setFormData] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [editedData, setEditedData] = useState([]);
  const imageRef = useRef(null);

  useEffect(() => {
    const enableFullscreen = () => {
      const element = document.documentElement;
      if (!document.fullscreenElement) {
        element.requestFullscreen?.() ||
          element.mozRequestFullScreen?.() ||
          element.webkitRequestFullscreen?.() ||
          element.msRequestFullscreen?.();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        enableFullscreen();
      }
    };

    // Run fullscreen logic when component mounts
    enableFullscreen();

    // Listen for visibility change to restore fullscreen if needed
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "ArrowLeft") {
        prevHandler();
      }
      if (event.ctrlKey && event.key === "ArrowRight") {
        nextHandler();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setFormData(Array.isArray(data.formdata) ? data.formdata : [data.formdata]);
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${window.SERVER_IP}/get/csvdata`,
          { taskData: taskData },
          {
            headers: {
              token: token,
            },
          }
        );
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        toast.error(error?.message);
      }
    };
    fetchData();
  }, [currentIndex]);

  const prevHandler = async () => {
    try {
      const taskData = localStorage.getItem("taskdata");
      if (taskData) {
        const parsedData = JSON.parse(taskData);
        const taskId = parsedData.id;
        const res = await updateCurrentIndex(taskId, "prev");
        setCurrenIndex(res);
      }
    } catch (error) {}
  };
  const nextHandler = async () => {
    try {
      const taskData = localStorage.getItem("taskdata");
      if (taskData) {
        const parsedData = JSON.parse(taskData);
        const taskId = parsedData.id;
        const res = await updateCurrentIndex(taskId, "next");
        console.log(res);
        setCurrenIndex(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveHandler = async (updatedData) => {
    const mergedData = {
      ...(Array.isArray(formData) && formData.length > 0
        ? formData[0]
        : formData),
      ...updatedData,
    };
    // console.log(updatedData);
    const obj = {
      taskId: taskData.id,
      templateId: taskData.templeteId,
      parentId: data.id,
      id: data,
      editedData: editedData,
      updatedData: mergedData,
    };
    const res = await updateCsvData(obj);
    nextHandler();
    console.log(res);
  };

  const zoomInHandler = () => {
    setZoomLevel((prevZoomLevel) => Math.min(prevZoomLevel * 1.1, 3));
  };

  const zoomOutHandler = () => {
    setZoomLevel((prevZoomLevel) => Math.max(prevZoomLevel * 0.9, 0.5));
  };

  const onInialImageHandler = () => {
    setZoomLevel(1);
    setSelectedCoordinates(false);
    if (imageRef.current) {
      imageRef.current.style.transform = "none";
      imageRef.current.style.transformOrigin = "initial";
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-[100vh] pt-16">
      <div className=" flex flex-col lg:flex-row  bg-gradient-to-r from-blue-400 to-blue-600 dataEntry ">
        {/* FormData Section */}
        <FormDataEntrySection
          data={data}
          formData={formData}
          setFormData={setFormData}
        />

        <div className="flex-col w-full">
          {/* Button and Data */}
          <ButtonDataEntrySection
            data={data}
            zoomInHandler={zoomInHandler}
            zoomOutHandler={zoomOutHandler}
            onInialImageHandler={onInialImageHandler}
          />

          <ImageDataEntrySection
            data={data}
            imageData={imageData}
            nextHandler={nextHandler}
            prevHandler={prevHandler}
            zoomLevel={zoomLevel}
            imageRef={imageRef}
          />

          <QuestionDataEntrySection
            data={data}
            saveHandler={saveHandler}
            setImageData={setImageData}
            setEditedData={setEditedData}
          />
        </div>
      </div>
    </div>
  );
};

export default DataMapping;
