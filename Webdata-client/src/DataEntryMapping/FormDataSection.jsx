import React, { useEffect, useState } from "react";
import { dataEntryMetaData } from "../services/common";

const FormDataEntrySection = ({
  formData,
  setImageData,
  setFormData,
  setEditedData,
  inputRefs,
  imageData,
  editedData,
  templateData,
  setInvalidMap,
  invalidMap
}) => {
  const [columnName, setColumnName] = useState("");
  const taskData = JSON.parse(localStorage.getItem("taskdata"));

  useEffect(() => {
    if (columnName !== "") {
      const fetchData = async () => {
        try {
          const response = await dataEntryMetaData(
            taskData.templeteId,
            columnName
          );
          const data = response.data;
          setImageData(data[0]);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
      //  const res =  getMetaDataHandler();
    
    }
  }, [columnName]);
//  console.log(invalidMap)
  const handleInputChange = (key, newValue) => {

   
  // previous value from formData (fallback to empty string)
  const prevValue = (formData && formData[0] && formData[0][key]) || "";

  const isDeletion = newValue.length < prevValue.length;

  const patternDef = templateData?.[0]?.patternDefinition ?? "";
  const blankDef = templateData?.[0]?.blankDefination ?? "";
    const blank = blankDef==="space"? " ": blankDef
  // If it's an addition (not deletion), enforce forbidden rules.
console.log(blank)
   if(newValue.includes(patternDef)|| newValue.includes(patternDef)){
     setInvalidMap(prev=>({...prev,[key]:true}))

   }else{
    setInvalidMap(prev=>({...prev,[key]:false}))
   }
  if (!isDeletion) {
    // block if pattern not allowed and newValue contains the pattern
    if (!imageData.pattern && patternDef && newValue.includes(patternDef)) {
      return;
    }

    // block if blank not allowed and newValue contains blankDef
    if (!imageData.blank && blank && newValue.includes(blank)) {
      return;
    }

    // block empty only when user tries to set empty by typing (rare) or pasting.
    // Note: we still allow deletion to empty so backspace works — but you can change this behavior if you want.
    if (!imageData.empty && newValue.trim() === "") {
      // Option A (recommended UX): allow deletion but mark invalid
      // return; // <-- Uncomment this line to block typing into empty if you prefer

      // Example: set an error state instead and allow the UI to handle it
      // setErrorForKey(key, "Field cannot be empty");
      // We will allow deletion so backspace works.
    }
  }

  // Passed validation — update editedData
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

  // Update formData[0][key]
  setFormData((prevData) => {
    const updatedData = [...prevData];
    if (updatedData[0]) {
      updatedData[0] = { ...updatedData[0], [key]: newValue };
    } else {
      // If no data yet, create initial object
      updatedData[0] = { [key]: newValue };
    }
    return updatedData;
  });
};


// const transformingfn = ()=>{
//     if (
//     !Array.isArray(formData) ||
//     !formData[0] ||
//     !Array.isArray(templateData) ||
//     !templateData[0]
//   ) {
//     return; // wait for data
//   }

//   const patternDef = templateData[0].patternDefinition ?? "";
//   const blankDef   = templateData[0].blankDefination ?? "";
//   const blankChar  = blankDef === "space" ? " " : blankDef;

//   const initialState = Object.fromEntries(
//     Object.entries(formData[0]).map(([key, value]) => {
//       const val = value ?? "";

//       const isInvalid =
//         (patternDef && val.includes(patternDef)) ||
//         (blankChar && val.includes(blankChar));

//       return [key, isInvalid];
//     })
//   );

//   setInvalidMap(initialState);
// }
// useEffect(() => {
// transformingfn()
// }, [templateData,formData]);




  console.log(templateData);
  // console.log(formData);
  // console.log(invalidMap);
  return (
    <div className="border-e min-w-60 order-lg-1">
      <div className="">
        <article
          style={{ scrollbarWidth: "thin" }}
          className="py-10 mt-5 lg:mt-16 shadow transition hover:shadow-lg mx-auto lg:h-[80vh] rounded-lg flex flex-row lg:flex-col lg:items-center w-[95%] bg-blue-500"
        >
          {Array.isArray(formData) && formData.length > 0 && formData[0] ? (
            Object.entries(formData[0]).map(([key, value], index) => (
              <div
                key={index}
                className="w-5/6 px-3 lg:px-0 py-1 overflow-x font-bold justify-center items-center"
              >
                <label className="w-full overflow-hidden rounded-md font-semibold py-2 shadow-sm">
                  <span className="text-sm text-white font-bold flex">
                    {key}
                  </span>
                </label>
                <input
                  ref={(el) => {
                    if (value === " " || value === "*" || value.includes("*") || value.includes(templateData?.[0]?.patternDefinition) || value.includes(templateData?.[0]?.blankDefination)) {
                      inputRefs.current[key] = el;
                    } else {
                      delete inputRefs.current[key]; // Clean up any previous ref
                    }
                  }}
                  type="text"
                  value={value || ""}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className={`mt-1 border-none p-2 focus:border-transparent text-center rounded-lg focus:outline-none focus:ring-0 sm:text-sm w-48 ${
                     value.includes(templateData?.[0]?.patternDefinition) || value.includes(templateData?.[0]?.blankDefination)
                      ? "bg-red-500"
                      : ""
                  } `}
                  onFocus={() => setColumnName(key)}
                />
              </div>
            ))
          ) : formData.length <= 0 ? (
            <div className="text-white">No Data Found</div>
          ) : (
            <div className="text-white">Loading..</div>
          )}

          {/* <div className="w-5/6 px-3 lg:px-0 py-1 overflow-x font-bold justify-center items-center">
            <label className="w-full overflow-hidden rounded-md font-semibold py-2 shadow-sm">
              <span className="text-sm text-white font-bold flex">data 1</span>
            </label>
            <input
              type="text"
              className={`mt-1 border-none p-2 focus:border-transparent text-center rounded-lg focus:outline-none focus:ring-0 sm:text-sm w-48`}
            />
          </div> */}
        </article>
      </div>
    </div>
  );
};

export default FormDataEntrySection;
