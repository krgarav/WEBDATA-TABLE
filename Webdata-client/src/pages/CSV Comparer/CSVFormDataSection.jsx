import React, { useEffect, useState } from "react";
import { fetchTemplateFormData } from "../../services/common";

const CSVFormDataSection = ({
  csvCurrentData,
  correctionData,
  csvData,
  headerData,
  templateHeaders,
  imageColName,
  currentFocusIndex,
  inputRefs,
  handleKeyDownJump,
  changeCurrentCsvDataHandler,
  imageFocusHandler,
  templeteId,
  filterResults,
}) => {
  // Ensure correctionData.filteredResults is properly set
  const filteredResults = filterResults || {};
  const [formData, setFormData] = useState([]);

  console.log(filterResults);
  useEffect(() => {
    const fetchDetails = async () => {
      const taskDetail = JSON.parse(localStorage.getItem("taskdata"));
      if (!taskDetail) return; // Ensure taskDetail exists

      const templateId = taskDetail.templateId;
      const headerData = Object.entries(filteredResults); // Get key-value pairs

      // Fetch form field data for each COLUMN_NAME in parallel

      const updatedData = await Promise.all(
        headerData.map(async ([key, item]) => {
          try {
            const isFormField = await fetchTemplateFormData(templateId, item);

            const type = isFormField?.templateData?.fieldType || "formField"; // Default to "formField"
            return [key, { ...item, type }]; // Preserve the key-value pair
          } catch (error) {
            console.error(
              `Error fetching data for ${item.COLUMN_NAME}:`,
              error
            );
            return [key, { ...item, type: "formField" }]; // Fallback in case of error
          }
        })
      );

      // Convert back to an object and filter only "formField" types
      const filteredFormFields = Object.fromEntries(
        updatedData.filter(([_, value]) => value.type === "formField")
      );

      setFormData(filteredFormFields);
    };

    if (filteredResults) {
      // fetchDetails();
    }
  }, [filteredResults]);
  // Runs when filteredResults changes

  // console.log(formData);
  // const checkData = () => {
  //   const prevData = correctionData?.previousData;
  //   const filterData = correctionData?.filteredResults;

  //   const result = filterData?.filter(
  //     (data, index) => data[prevData.PRIMARY_KEY] == prevData.PRIMARY
  //   );

  //   setFormData(result);
  // };

  // useEffect(() => {
  //   checkData();
  // }, []);

  return (
    <div className="border-e order-lg-1 w-60">
      <div className="overflow-hidden">
        <article
          style={{ scrollbarWidth: "thin" }}
          className="py-10 mt-5 lg:mt-16 shadow transition hover:shadow-lg mx-auto overflow-y-auto lg:h-[80vh] rounded-lg flex flex-row lg:flex-col lg:items-center w-[95%] bg-blue-500"
        >
          {Object.entries({ ...filteredResults }).map(([key, value], i) => {
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
                  className={`mt-1 border-none p-2 focus:border-transparent text-center rounded-lg focus:outline-none focus:ring-0 sm:text-sm w-48
                                ${
                                  filteredResults[key] === "" ||
                                  (filteredResults[key] &&
                                    typeof filteredResults[key] === "string" &&
                                    (filteredResults[key].includes(
                                      templateHeaders?.patternDefinition
                                    ) ||
                                      filteredResults[key].includes(" ")))
                                    ? "bg-red-500 text-white"
                                    : "bg-white"
                                }

                                ${
                                  i === currentFocusIndex ? "bg-yellow-300" : ""
                                }
                                `}
                  ref={(el) => (inputRefs.current[i] = el)}
                  value={filteredResults[key] || ""}
                  onKeyDown={(e) => handleKeyDownJump(e, i)}
                  onChange={(e) =>
                    changeCurrentCsvDataHandler(key, e.target.value)
                  }
                  onFocus={() => imageFocusHandler(key)}
                />
              </div>
            );
          })}
        </article>
      </div>
      {/* View image */}
    </div>
  );
};

export default CSVFormDataSection;
