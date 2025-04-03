import React, { useEffect, useState } from "react";

const FormDataEntrySection = ({ formData, setFormData,setEditedData }) => {
  const handleInputChange = (key, value) => {
    setEditedData((prev) => {
      const updatedData = [...prev];
      const existingIndex = updatedData.findIndex((item) => Object.keys(item)[0] === key);
  
      if (existingIndex !== -1) {
        // If key exists, update its value
        updatedData[existingIndex] = { [key]: value };
      } else {
        // If key does not exist, add a new entry
        updatedData.push({ [key]: value });
      }
  
      return updatedData;
    });
    setFormData((prevData) => {
      const updatedData = [...prevData];
      if (updatedData[0]) {
        updatedData[0] = { ...updatedData[0], [key]: value };
      }
      return updatedData;
    });
  };
console.log(formData)
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
                  type="text"
                  value={value || ""}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="mt-1 border-none p-2 focus:border-transparent text-center rounded-lg focus:outline-none focus:ring-0 sm:text-sm w-48"
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
