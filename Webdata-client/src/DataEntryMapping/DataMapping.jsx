import axios from "axios";
import React, { useEffect, useState } from "react";
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
    // console.log("called")
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
      templateId: taskData.id,
      parentId: data.id,
      // ...mergedData,
      updatedData: mergedData,
    };
    const res = await updateCsvData(obj);
    nextHandler();
    console.log(res);
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
          <ButtonDataEntrySection data={data} />

          <ImageDataEntrySection
            data={data}
            imageData={imageData}
            nextHandler={nextHandler}
            prevHandler={prevHandler}
          />

          <QuestionDataEntrySection
            data={data}
            saveHandler={saveHandler}
            setImageData={setImageData}
          />
        </div>
      </div>
    </div>
  );
};

export default DataMapping;
