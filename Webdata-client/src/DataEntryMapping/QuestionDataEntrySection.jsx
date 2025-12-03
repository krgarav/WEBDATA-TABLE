import { useEffect, useState } from "react";
import {
  changeTaskStatus,
  dataEntryMetaData,
  onGetTemplateHandler,
} from "../services/common";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
const QuestionDataEntrySection = ({
  data,
  setImageData,
  saveHandler,
  setEditedData,
  inputRefs,
  inputIndexRef,
  invalidIndex,
  settemplateData,
  formData
}) => {
  const [questionData, setQuestionData] = useState([]);
  const taskData = JSON.parse(localStorage.getItem("taskdata"));
  const [columnName, setColumnName] = useState("");
  const [editableData, setEditableData] = useState(null);
  const [templateHeader, settemplateHeader] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    console.log(data)
    setEditableData(data?.questionData);
    setEditedData([]);
  }, [data]);
  console.log({data:data, setImageData:setImageData, saveHandler:saveHandler, setEditedData:setEditedData, taskData:taskData});
  // useEffect(() => {
  //   setQuestionData(
  //     Array.isArray(data.questionData) ? data.questionData : [data.questionData]
  //   );
  // }, [data]);
  // console.log(data.questionData);


//throttling

function throttle(func, delay) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}


//debouncing

function debounce(func, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}



  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await onGetTemplateHandler();

        settemplateHeader(
          response.filter((a) => a.id === parseInt(taskData.templeteId))
        );
        settemplateData(response.filter((a) => a.id === parseInt(taskData.templeteId)))
      } catch (error) {
        console.log(error);
      }
    };
    fetchTemplate();
  }, []);
  // console.log(templateHeader[0]);
  const allowedOptions = templateHeader[0]?.typeOption?.split("-") || [];
  allowedOptions.push(templateHeader[0]?.blankDefination);
  allowedOptions.push(templateHeader[0]?.patternDefinition);
  // console.log(parseInt(taskData.templeteId))
  useEffect(() => {
  // Create a debounced save function that always uses latest editableData
  const debouncedSave = debounce(() => {
    saveHandler(editableData);
  }, 100);

  const handleAltSKey = (e) => {
    if (e.altKey && e.key.toLowerCase() === "s") {
      e.preventDefault();
      debouncedSave();
    }
  };

  document.addEventListener("keyup", handleAltSKey);

  return () => {
    document.removeEventListener("keyup", handleAltSKey);
  };
}, [editableData]); // Ensure latest state values

  const handleInputChange = (key, newValue) => {
    // ✅ Remove any character not in the allowed list
    const filteredValue = newValue
      .toUpperCase() // optional: make case-insensitive
      .split("") // split into individual chars
      .filter((char) => allowedOptions.includes(char))
      .join("");

    setEditableData((prevData) => ({
      ...prevData,
      [key]: filteredValue, // ✅ only allowed chars are stored
    }));

    setEditedData((prev) => {
      const updatedData = [...prev];
      const existingIndex = updatedData.findIndex(
        (item) => Object.keys(item)[0] === key
      );

      if (existingIndex !== -1) {
        updatedData[existingIndex] = { [key]: filteredValue };
      } else {
        updatedData.push({ [key]: filteredValue });
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

  const submitHandler = async () => {
    const result = window.confirm("Are you sure you want to submit the task?");
    if (!result) {
      return; // Exit the function if the user cancels
    }
    try {
      const taskData = localStorage.getItem("taskdata");
      if (taskData) {
        const parsedData = JSON.parse(taskData);
        const taskId = parsedData.id;
        const res = await changeTaskStatus(taskId);
        if (!res) {
          toast.error("Error in submitting task");
        } else {
          navigate("/datamatching", { replace: true });
          toast.success("Task submitted successfully");
        }
      }
    } catch (error) {
      console.error("Error in submitting task:", error);
      toast.error("Error in submitting task");
    } finally {
      // Reset any necessary state or perform cleanup here
    }
  };
  const debouncedSave = debounce(() => saveHandler(editableData), 100);

  console.log(editableData);
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
          <div>
            <button
              onClick={debouncedSave}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out mr-5"
              id="update"
            >
              Save
            </button>
            {data.total_error === data.currentIndex && (
              <button
                onClick={submitHandler}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out mr-10 "
              >
                Submit Task
              </button>
            )}
          </div>
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
              const red = value === " " || value === "*" || value === "";

              return (
                <div key={index} className="flex">
                  <div className="me-3 my-1 flex">
                    <label className="font-bold text-sm w-9 my-1">{key}</label>
                    <div className="flex rounded">
                      <input
                        type="text"
                        ref={(el) => {
                          if (red) {
                            inputRefs.current[key] = el;
                          } else {
                            delete inputRefs.current[key];
                          }
                        }}
                        value={value}
                        className={`h-7 w-7 text-center text-black rounded text-sm ${
                          red ? "bg-red-500 text-white" : ""
                        }`}
                        onChange={(e) => {
                          const char = e.target.value.slice(0, 1); // ✅ Only keep first character
                          if (
                            allowedOptions.includes(char.toUpperCase()) ||
                            char === " " || // ✅ allow single space
                            char === "" // ✅ allow empty to clear
                          ) {
                            handleInputChange(
                              key,
                              char === " " ? " " : char.toUpperCase()
                            );
                          }
                        }}
                        onClick={() => {
                          setColumnName(key);
                          const invalidKeys = Object.keys(inputRefs.current);
                          const sortedData = [...invalidKeys].sort((a, b) => {
                            const isAAlphaOnly = /^[A-Za-z]+$/.test(a); // true if only letters
                            const isBAlphaOnly = /^[A-Za-z]+$/.test(b);

                            // 🟢 Step 1: Pure alphabets come first
                            if (isAAlphaOnly && !isBAlphaOnly) return -1;
                            if (!isAAlphaOnly && isBAlphaOnly) return 1;

                            // 🟡 Step 2: If both are alphabet-only, sort alphabetically
                            if (isAAlphaOnly && isBAlphaOnly)
                              return a.localeCompare(b);

                            // 🔵 Step 3: Otherwise (both have numbers), sort by prefix then number
                            const prefixA = a.match(/[A-Za-z]+/)[0];
                            const prefixB = b.match(/[A-Za-z]+/)[0];

                            if (prefixA !== prefixB)
                              return prefixA.localeCompare(prefixB);

                            const numA = parseInt(
                              a.match(/\d+/)?.[0] || "0",
                              10
                            );
                            const numB = parseInt(
                              b.match(/\d+/)?.[0] || "0",
                              10
                            );

                            return numA - numB;
                          });
                          console.log(sortedData);
                          const currentIndex = sortedData.indexOf(key);
                          if (currentIndex !== -1) {
                            invalidIndex.current = currentIndex;
                            console.log("Clicked cell index:", currentIndex);
                          }
                        }}
                        onFocus={() => {
                          setColumnName(key);
                          console.log("Focused index: ", index); // 👈 here’s your index
                        }}
                        onKeyDown={(e) => {
                          const rawKey = e.key; // actual key
                          const keyUpper = rawKey.toUpperCase();

                          if (
                            rawKey.length === 1 && // single-character keys only
                            !allowedOptions.includes(keyUpper) &&
                            rawKey !== " " // ✅ allow space
                          ) {
                            e.preventDefault(); // block invalid keys
                          }
                        }}
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
