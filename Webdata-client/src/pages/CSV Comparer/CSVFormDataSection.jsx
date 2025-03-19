import React, { useEffect, useState } from "react";
import { fetchTemplateFormData } from "../../services/common";

const CSVFormDataSection = ({
  formCsvData,
  // correctionData,
  // csvData,
  // headerData,
  // templateHeaders,
  // imageColName,
  // currentFocusIndex,
  // inputRefs,
  // handleKeyDownJump,
  // changeCurrentCsvDataHandler,
  // imageFocusHandler,
  // templeteId,
  // filterResults,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (formCsvData) {
      setFormData(formCsvData);
    }
  }, [formCsvData]);

  const AllFormData = Object.entries(formCsvData).map(([key, value], i) => {
    return (
      <div
        key={i}
        className="w-5/6 px-3 lg:px-0 py-1  overflow-x font-bold justify-center items-center"
      >
        <label className=" w-full overflow-hidden  rounded-md  font-semibold  py-2 shadow-sm  ">
          <span className="text-sm text-white font-bold flex">
            {key?.toUpperCase()}
          </span>
        </label>
        <input
          type="text"
          // className={`mt-1 border-none p-2 focus:border-transparent text-center rounded-lg focus:outline-none focus:ring-0 sm:text-sm w-48
          //               ${
          //                 filteredResults[key] === "" ||
          //                 (filteredResults[key] &&
          //                   typeof filteredResults[key] === "string" &&
          //                   (filteredResults[key].includes(
          //                     templateHeaders?.patternDefinition
          //                   ) ||
          //                     filteredResults[key].includes(" ")))
          //                   ? "bg-red-500 text-white"
          //                   : "bg-white"
          //               }

          //               ${i === currentFocusIndex ? "bg-yellow-300" : ""}
          //               `}

          className={`mt-1 border-none p-2 focus:border-transparent text-center rounded-lg focus:outline-none focus:ring-0 sm:text-sm w-48
          ${
            formCsvData[key] &&
            typeof formCsvData[key] === "string" &&
            formCsvData[key].includes(" ")
              ? "bg-red-500 text-white"
              : "bg-white"
          }`}
          // ref={(el) => (inputRefs.current[i] = el)}
          value={formCsvData[key] || ""}
          // onKeyDown={(e) => handleKeyDownJump(e, i)}
          // onChange={(e) =>
          // changeCurrentCsvDataHandler(key, e.target.value)
          // }
          // onFocus={() => imageFocusHandler(key)}
        />
      </div>
    );
  });

  return (
    <div className="border-e order-lg-1 w-60">
      <div className="overflow-hidden">
        <article
          style={{ scrollbarWidth: "thin" }}
          className="py-10 mt-5 lg:mt-16 shadow transition hover:shadow-lg mx-auto overflow-y-auto lg:h-[80vh] rounded-lg flex flex-row lg:flex-col lg:items-center w-[95%] bg-blue-500"
        >
          {formData && AllFormData}
        </article>
      </div>
      {/* View image */}
    </div>
  );
};

export default CSVFormDataSection;
