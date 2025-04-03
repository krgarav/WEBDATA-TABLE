import React, { useEffect, useState } from "react";
import { dataEntryMetaData } from "../services/common";
import { toast } from "react-toastify";

const QuestionDataEntrySection = ({
  data,
  setImageData,
  saveHandler,
  setEditedData,
}) => {
  const [questionData, setQuestionData] = useState([]);
  const taskData = JSON.parse(localStorage.getItem("taskdata"));
  const [columnName, setColumnName] = useState("");
  const [editableData, setEditableData] = useState(null);
  useEffect(() => {
    setEditableData(data.questionData);
    setEditedData([]);
  }, [data]);
  // useEffect(() => {
  //   setQuestionData(
  //     Array.isArray(data.questionData) ? data.questionData : [data.questionData]
  //   );
  // }, [data]);
  // console.log(data.questionData);

  useEffect(() => {
    const handleAltSKey = (e) => {
      if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault(); // Prevents browser default action
        saveHandler(editableData); // Call save function directly
      }
    };

    document.addEventListener("keydown", handleAltSKey);
    return () => {
      document.removeEventListener("keydown", handleAltSKey);
    };
  }, [editableData, saveHandler]); // Ensure latest state values

  const handleInputChange = (key, newValue) => {
    setEditableData((prevData) => ({
      ...prevData,
      [key]: newValue,
    }));
    setEditedData((prev) => {
      const updatedData = [...prev];
      const existingIndex = updatedData.findIndex(
        (item) => Object.keys(item)[0] === key
      );

      if (existingIndex !== -1) {
        // If key exists, update its value
        updatedData[existingIndex] = { [key]: newValue };
      } else {
        // If key does not exist, add a new entry
        updatedData.push({ [key]: newValue });
      }

      return updatedData;
    });
  };
  // useEffect(() => {
  //   setImageData();
  // }, [columnName]);
  // const getMetaDataHandler = async () => {
  //   try {
  //     const response = await dataEntryMetaData(taskData.templeteId, columnName);
  //     return response.data;
  //   } catch (error) {
  //     toast.error(error?.message);
  //   }
  // };

  useEffect(() => {
    if (columnName !== "") {
      const fetchData = async () => {
        try {
          const response = await dataEntryMetaData(
            taskData.templeteId,
            columnName
          );
          const data = response.data;
          console.log(data);
          setImageData(data[0]);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
      //  const res =  getMetaDataHandler();
    }
  }, [columnName]);

  return (
    <div className="w-full 2xl:w-2/3 xl:px-6 mx-auto text-white">
      <div className="my-4 w-full ">
        <div className="flex items-center justify-between bg-transparent rounded-lg">
          <label
            className="text-xl font-semibold text-white ms-2 leading-none"
            htmlFor="questions"
          >
            Questions:
          </label>
          <button
            onClick={() => {
              saveHandler(editableData);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out mr-16"
            id="update"
          >
            Save
          </button>
        </div>

        <div
          className="flex overflow-auto max-h-[360px] mt-3 ms-2 xl:ms-2 flex-wrap h-44 2xl:h-full"
          style={{ scrollbarWidth: "thin" }}
        >
          {/* {Array.isArray(questionData) &&
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
                          setColumnName(key);
                        }}
                        onFocus={() => {
                          setColumnName(key);
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
          )} */}
          {/* {editableData && (
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(editableData).map(([key, value]) => {
                const red = value === " " || value === "*";

                return (
                  <div key={key} className="flex items-center">
                    <label className="font-bold text-sm w-12">{key}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className={`h-7 w-7 text-center text-black rounded text-sm ${
                        red ? "bg-red-500" : ""
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          )} */}

          {editableData ? (
            Object.entries(editableData).map(([key, value], index) => {
              const red = value === " " || value === "*";

              return (
                <div key={index} className="flex">
                  <div className="me-3 my-1 flex">
                    <label className="font-bold text-sm w-9 my-1">{key}</label>
                    <div className="flex rounded">
                      <input
                        type="text"
                        value={value}
                        className={`h-7 w-7 text-center text-black rounded text-sm ${
                          red ? "bg-red-500" : ""
                        }`}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        onClick={() => setColumnName(key)}
                        onFocus={() => setColumnName(key)}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : questionData.length === 0 ? (
            <div className="text-white">No Data Found</div>
          ) : (
            <div className="text-white">Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDataEntrySection;
