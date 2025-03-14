import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormDataEntrySection from "./FormDataSection";
import ButtonDataEntrySection from "./ButtonDataEntrySection";
import ImageDataEntrySection from "./ImageDataEntrySection";
import QuestionDataEntrySection from "./QuestionDataEntrySection";
import { updateCurrentIndex } from "../services/common";

const DataMapping = () => {
  const token = JSON.parse(localStorage.getItem("userData"));
  const taskData = JSON.parse(localStorage.getItem("taskdata"));

  const [data, setData] = useState([]);
  const [imageData, setImageData] = useState([]);
  const [currentIndex, setCurrenIndex] = useState(null);

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
  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-[100vh] pt-16">
      <div className=" flex flex-col lg:flex-row  bg-gradient-to-r from-blue-400 to-blue-600 dataEntry ">
        {/* FormData Section */}
        <FormDataEntrySection data={data} />

        <div className="flex-col w-full">
          {/* Button and Data */}
          <ButtonDataEntrySection data={data} />

          <ImageDataEntrySection
            data={data}
            imageData={imageData}
            nextHandler={nextHandler}
            prevHandler={prevHandler}
          />

          <QuestionDataEntrySection data={data} setImageData={setImageData} />
        </div>
      </div>
    </div>
  );
};

export default DataMapping;
