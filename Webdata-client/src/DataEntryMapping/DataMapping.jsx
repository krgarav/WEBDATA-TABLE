import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import FormDataEntrySection from "./FormDataSection";
import ButtonDataEntrySection from "./ButtonDataEntrySection";
import ImageDataEntrySection from "./ImageDataEntrySection";
import QuestionDataEntrySection from "./QuestionDataEntrySection";
import { updateCsvData, updateCurrentIndex, onGetTemplateHandler } from "../services/common";

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
  const inputRefs = useRef({});
  const invalidIndex = useRef(0);
  console.log(inputRefs);
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

  // useEffect(() => {
  //   inputRefs.current = {};
  //   invalidIndex.current = 0; // Reset the index when currentIndex changes
  // }, [currentIndex]);
  

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

  useEffect(() => {
    const handleTabKey = (e) => {
      if (e.key === "Tab") {
        e.preventDefault(); // Stop normal tab behavior

        // Get all keys from inputRefs (which are the keys of invalid inputs)
        const invalidKeys = Object.keys(inputRefs.current);

        // Log the refs and keys if you want to debug
        console.log("inputRefs:", inputRefs.current);
        console.log("invalidKeys:", invalidKeys);

        // No invalid inputs? Do nothing
        if (invalidKeys.length === 0) return;

        // Reset index if out of bounds
        if (invalidIndex.current >= invalidKeys.length) {
          invalidIndex.current = 0;
        }

        const keyToFocus = invalidKeys[invalidIndex.current];
        const element = inputRefs.current[keyToFocus];

        if (element) {
          element.focus();
          invalidIndex.current += 1; // Move to next invalid input for next Tab
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
  }, [formData]);

  const prevHandler = async () => {
    try {
      const taskData = localStorage.getItem("taskdata");
      if (taskData) {
        const parsedData = JSON.parse(taskData);
        const taskId = parsedData.id;
        const res = await updateCurrentIndex(taskId, "prev");
        if (!res) {
          toast.error("No Previous Page!!");
          return;
        }
        setCurrenIndex(res);
        // inputRefs.current = {};
        // invalidIndex.current = 0;
      }
    } catch (error) {
      console.error(error);
    } finally {
      inputRefs.current = {};
      invalidIndex.current = 0;
    }
  };
  const nextHandler = async () => {
    try {
      const taskData = localStorage.getItem("taskdata");
      if (taskData) {
        const parsedData = JSON.parse(taskData);
        const taskId = parsedData.id;
        const res = await updateCurrentIndex(taskId, "next");
        if (!res) {
          toast.error("Last page reached");
          return;
        }
        console.log(res);
        setCurrenIndex(res);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      inputRefs.current = {};
      invalidIndex.current = 0;
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
  console.log(editedData);
  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-[100vh] pt-16">
      <div className=" flex flex-col lg:flex-row  bg-gradient-to-r from-blue-400 to-blue-600 dataEntry ">
        {/* FormData Section */}
        <FormDataEntrySection
          data={data}
          formData={formData}
          setFormData={setFormData}
          setEditedData={setEditedData}
          setImageData={setImageData}
          inputRefs={inputRefs}
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
            inputRefs={inputRefs}
            editedData={editedData}
           
          />
        </div>
      </div>
    </div>
  );
};

export default DataMapping;
