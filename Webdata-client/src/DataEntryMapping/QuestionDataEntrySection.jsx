import React, { useEffect, useState } from "react";
import { dataEntryMetaData } from "../services/common";
import { toast } from "react-toastify";

const QuestionDataEntrySection = ({ data }) => {
  const [questionData, setQuestionData] = useState([]);
  const taskData = JSON.parse(localStorage.getItem("taskdata"));
  const [columnName, setColumnName] = useState(0);

  useEffect(() => {
    setQuestionData(
      Array.isArray(data.questionData) ? data.questionData : [data.questionData]
    );
  }, [data]);

  const getMetaDataHandler = async () => {
    try {
      const response = await dataEntryMetaData(taskData.templeteId, columnName);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (columnName > 0) {
      getMetaDataHandler();
    }
  }, [columnName, taskData]);

  return (
    <div className="w-full xl:w-2/3 xl:px-6 mx-auto text-white">
      <div className="my-4 w-full ">
        <label
          className="text-xl font-semibold ms-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="questions"
        >
          Questions:
        </label>
        <div
          className="flex overflow-auto max-h-[360px] mt-3 ms-2 xl:ms-2 flex-wrap"
          style={{ scrollbarWidth: "thin" }}
        >
          {Array.isArray(questionData) &&
          questionData.length > 0 &&
          questionData[0] ? (
            Object.entries(questionData[0]).map(([key, value], index) => {
              let red = false;
              if (value === " " || value === "*") {
                red = true;
              }
              return (
                <div key={index} className="flex">
                  <div className=" me-3 my-1 flex">
                    <label className="font-bold text-sm w-9 text-bold my-1">
                      {key}
                    </label>
                    <div className="flex rounded">
                      <input
                        type="text"
                        value={value}
                        className={`h-7 w-7 text-center text-black rounded text-sm ${
                          red ? "bg-red-500" : ""
                        } `}
                        onClick={() => {
                          if (key) {
                            setColumnName(
                              key.startsWith("Q")
                                ? Number(key.replace("Q", ""))
                                : Number(key)
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : questionData.length <= 0 ? (
            <div className="text-white">No Data Found</div>
          ) : (
            <div className="text-white">Loading..</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDataEntrySection;
