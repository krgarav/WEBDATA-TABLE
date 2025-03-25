import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { MdDataSaverOn } from "react-icons/md";
import {
  fetchLatestTaskData,
  fetchTemplateFormData,
  REACT_APP_IP,
} from "../../services/common";
import { toast } from "react-toastify";
import Loader from "../../UI/Loader";

const CorrectionField = ({ subData, currentData, taskId, nextHandler }) => {
  // const [inputValues, setInputValues] = useState("");
  const taskData = JSON.parse(localStorage.getItem("taskdata"));
  const token = JSON.parse(localStorage.getItem("userData"));
  const [visitedCount, setVisitedCount] = useState(0);
  const [visitedRows, setVisitedRows] = useState({}); // Track visited rows
  const [dataRow, setDataRow] = useState(currentData);
  const [inputValue, setInputValue] = useState({});
  const inputRefs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    setDataRow(currentData);
    setInputValue({});
  }, [currentData]);
  useEffect(() => {
    setVisitedCount(0);
    setVisitedRows({});
  }, [currentData]);

  const handleVisit = (index) => {
    if (!visitedRows[index]) {
      setVisitedRows((prev) => ({ ...prev, [index]: true }));
      setVisitedCount((prev) => prev + 1);
    }
  };

  // useEffect(() => {
  //   const PRIMARY = currentData?.PRIMARY;
  //   const Primary_Key = currentData?.DATA?.Primary_Key;
  //   // When filteredData or PRIMARY changes, update the input values
  //   const initialValues = currentData.DATA.reduce((acc, dataItem) => {
  //     const key = `${PRIMARY?.trim()}-${dataItem?.COLUMN_NAME?.trim()}`;
  //     acc[key] = dataItem.CORRECTED || ""; // Default to empty string if CORRECTED is undefined
  //     return acc;
  //   }, {});
  //   // setInputValue(initialValues);
  // }, [currentData]);

  // useEffect(() => {
  //   const processTemplateData = async () => {
  //     try {
  //       if (!taskData?.templeteId || dataRow.length === 0) return;

  //       const templateId = taskData.templeteId;

  //       // Fetch form field data for each COLUMN_NAME in parallel
  //       const updatedData = await Promise.all(
  //         dataRow.map(async (item) => {
  //           try {
  //             const isFormField = await fetchTemplateFormData(
  //               templateId,
  //               item.COLUMN_NAME
  //             );
  //             const type = isFormField?.templateData?.fieldType || "formField"; // Use default "formField" if API fails or returns undefined
  //             return { ...item, type };
  //           } catch (error) {
  //             console.error(
  //               `Error fetching data for ${item.COLUMN_NAME}:`,
  //               error
  //             );
  //             return { ...item, type: "formField" }; // Fallback to "formField"
  //           }
  //         })
  //       );

  //       setUpdatedData(updatedData);
  //     } catch (error) {
  //       console.error("Error processing template data:", error);
  //     }
  //   };

  //   processTemplateData();
  // }, [dataRow]);

  useEffect(() => {
    setVisitedCount(0);
    setVisitedRows({});
  }, []);

  useEffect(() => {
    const handleAltSKey = (e) => {
      if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault(); // Prevents browser shortcuts (if any)
        document.getElementById("update").click();
      }
    };

    document.addEventListener("keydown", handleAltSKey);
    return () => document.removeEventListener("keydown", handleAltSKey);
  }, []);
  useEffect(() => {
    handleVisit(0);
  }, []);

  useEffect(() => {
    return () => setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleTabKey = (e) => {
      if (e.key === "Tab") {
        e.preventDefault(); // Prevent default tab behavior

        const focusableInputs = inputRefs.current.filter((el) => el);
        const currentIndex = focusableInputs.indexOf(document.activeElement);

        if (e.shiftKey) {
          // Shift + Tab (Move Backward)
          const prevIndex =
            (currentIndex - 1 + focusableInputs.length) %
            focusableInputs.length;
          focusableInputs[prevIndex]?.focus();
        } else {
          // Tab (Move Forward)
          const nextIndex = (currentIndex + 1) % focusableInputs.length;
          focusableInputs[nextIndex]?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, []);

  const handleInputChange = (e, key) => {
    setInputValue((prevValues) => ({
      ...prevValues,
      [key]: e.target.value,
    }));
  };

  const onUpdateHandler = async () => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;
    setIsLoading(true);

    try {
      const mappedData = subData.map((dataItem) => {
        return {
          id: dataItem.id,
          Column_Name: dataItem.Column_Name,
          Corrected: inputValue[dataItem.Column_Name],
        };
      });
      const filtered = mappedData.filter((item) => item.Corrected != null);

      const obj = {
        updated: filtered,
        parentId: currentData?.parentId,
        taskId: taskId,
      };

      const response = await axios.post(
        `${window.SERVER_IP}/csvUpdateData/${taskId}/batch`,
        obj,
        {
          headers: { token: token },
        }
      );
      if (response.data.success) {
        toast.success("Corrected Value Updated Successfully");
        nextHandler();
      }
    } catch (error) {
      console.error(
        "Error updating data:",
        error?.response?.data?.message || error
      );
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
      isUpdatingRef.current = false;
    }
  };

  const errorData = subData?.map((dataItem, index) => {
    const key = `${dataItem?.Column_Name?.trim()}`;
    // const updatedValue = dataItem.CORRECTED||"Null";
    // const questionAllowedValues = ["A", "B", "C", "D", "*", " "];
    // const formAllowed = //allvalues
    // Allowed values for different field types
    const questionAllowedValues = ["A", "B", "C", "D", "*", " "];
    const numberRegex = /^[0-9]*$/; // Allows only numbers (0-9)
    // const allowedValues = dataItem.type=== "formField"?questionAllowedValues  : "questionsField";

    return (
      <div
        key={index}
        className={`flex ${visitedRows[index] ? "bg-green-200" : "bg-red-200"}`}
      >
        <div className="py-2 px-4 border-b w-1/5">{dataRow?.Primary}</div>
        <div className="py-2 px-4 border-b w-1/5">{dataItem?.Column_Name}</div>
        <div className="py-2 px-4 border-b w-1/5">{dataItem?.File_1_data}</div>
        <div className="py-2 px-4 border-b w-1/5">{dataItem?.File_2_data}</div>
        <div className="py-2 px-4 border-b w-1/5 flex space-x-2">
          <input
            type="text"
            className="w-full border rounded-xl py-1 px-2 shadow"
            // value={inputValue[key] ?inputValue[key]:dataItem?.Corrected}
            value={
              inputValue[key] !== undefined
                ? inputValue[key]
                : dataItem?.Corrected
            }
            // value={dataItem?.Corrected ? dataItem?.Corrected : ""}
            // defaultValue={dataItem?.CORRECTED}
            placeholder={dataItem?.Column_Name}
            onChange={(e) => {
              const input = e.target.value.toUpperCase(); // Convert input to uppercase

              // Validate based on field type
              // if (
              //   (dataItem.type === "formField" && numberRegex.test(input)) || // Allow only numbers for form fields
              //   (dataItem.type !== "formField" &&
              //     (input === "" || questionAllowedValues.includes(input))) // Allow question field values
              // ) {
              //   handleInputChange(
              //     { ...e, target: { ...e.target, value: input } },
              //     key
              //   );
              // }
              handleInputChange(
                { ...e, target: { ...e.target, value: input } },
                key
              );
            }}
            onFocus={(e) => {
              // imageFocusHandler(dataItem.COLUMN_NAME); // First function
              handleVisit(index); // Second function
            }} // Mark row as visited
            ref={(el) => (inputRefs.current[index] = el)}
            maxLength={dataItem.type !== "formField" && 1}
          />

          {/* <div className="flex justify-center items-center">
            <MdDataSaverOn
              className="text-2xl text-teal-600"
              onClick={() =>
                onUpdateHandler(
                  PRIMARY?.trim(),
                  dataItem?.COLUMN_NAME?.trim()
                )
              }
            />
          </div> */}
        </div>
      </div>
    );
  });

  return (
    <div className="mx-4 bg-white xl:my-4 px-4 py-2 rounded-md">
      <div className="flex justify-between mb-6 mt-2">
        <h2 className="text-sm 2xl:text-xl mx-4 font-bold 2xl:pt-1 text-blue-500 bg-blue-200 p-2 rounded-lg border border-blue-400">
          {`${currentData?.Primary_Key} (Primary Key)`}
        </h2>
        <h3 className="text-sm 2xl:text-lg font-bold bg-red-100 text-red-600 p-2 rounded-md shadow-md border border-red-300">
          Total Errors:{" "}
          <span className="font-extrabold">{subData?.length}</span>
        </h3>

        {subData?.length === visitedCount && (
          <span className="text-sm 2xl:text-lg text-green-700 bg-green-200 font-semibold p-2 rounded-md shadow-md border border-green-400">
            ✅ All Visited
          </span>
        )}
        {subData?.length !== visitedCount && (
          <span className="flex items-center text-yellow-800 bg-yellow-200 font-semibold p-2 rounded-md shadow-md border border-yellow-400 text-sm 2xl:text-lg">
            ⚠️ Not Visited: {subData?.length - visitedCount}
          </span>
        )}

        <h3 className="text-sm 2xl:text-lg font-bold bg-blue-100 text-blue-600 p-2 rounded-md shadow-md border border-blue-300">
          Visited: <span className="font-extrabold">{visitedCount}</span>
        </h3>
        <button
          className="px-6 py-2 bg-teal-600 rounded-lg text-white flex items-center justify-center min-w-[120px] h-[40px]"
          disabled={isLoading}
          onClick={onUpdateHandler}
          id="update"
        >
          {isLoading && (
            <span className="flex">
              <Loader />
              {/* Updating */}
            </span>
          )}
          {!isLoading && <span>Update</span>}
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full bg-white">
          <div>
            <div className="flex text-center">
              <div className="py-2 px-4 border-b font-semibold w-1/5">
                {currentData?.Primary_Key}
              </div>
              <div className="py-2 px-4 border-b font-semibold w-1/5">
                Field name
              </div>
              <div className="py-2 px-4 border-b font-semibold w-1/5">
                File 1
              </div>
              <div className="py-2 px-4 border-b font-semibold w-1/5">
                File 2
              </div>
              <div className="py-2 px-4 border-b font-semibold w-1/5">
                Corrected Data
              </div>
            </div>
          </div>
          <div className="h-28 2xl:h-44 overflow-y-auto text-center">
            {errorData}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrectionField;
