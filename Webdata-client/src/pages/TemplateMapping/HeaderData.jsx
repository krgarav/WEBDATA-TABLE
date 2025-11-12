import React, { useState } from "react";

function HeaderData({
  csvHeaders,
  handleTemplateHeaderChange,
  templateHeaders,
  selectedAssociations,
  handleCsvHeaderChange,
}) {
  console.log(templateHeaders);

  const [tempValue, settempValue] = useState();

  return (
    <div className="relative">
      <div>
        <div className="flex w-full justify-around mb-4">
          <div className="w-1/3 text-center">
            <label className="block text-xl text-white font-semibold">
              CSV Header
            </label>
          </div>
          <div className="w-1/3 text-center">
            <label className="block text-xl text-white font-semibold">
              Template Header
            </label>
          </div>
        </div>
        <div className="h-[50vh] overflow-y-auto">
          {csvHeaders &&
            csvHeaders
              .filter(
                (csvHeader) =>
                  csvHeader !== "Previous Values" &&
                  csvHeader !== "Updated Values" &&
                  csvHeader !== "User Details" &&
                  csvHeader !== "Updated Col. Name"
              )
              .map((csvHeader, index) => {
                // Compute validValue INSIDE the map, per csvHeader
                const getValidValue = () => {
                  const current = selectedAssociations[csvHeader];
                  if (current && templateHeaders.includes(current)) {
                    return current;
                  }
                  return "UserFieldName";
                };

                return (
                  <div key={index} className="flex w-full justify-around mb-3">
                    {/* CSV Header Select */}
                    <select
                      className="block w-1/3 py-1 me-10 text-xl font-semibold text-center border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      aria-label="CSV Header Name"
                      onChange={(e) =>
                        handleCsvHeaderChange(csvHeader, e.target.value)
                      }
                      value={csvHeader}
                    >
                      <option disabled value="">
                        Select CSV Header Name
                      </option>
                      {csvHeaders
                        .filter(
                          (csvData) =>
                            csvData !== "User Details" &&
                            csvData !== "Updated Details"
                        )
                        .map((csvData, idx) => (
                          <option key={idx} value={csvData}>
                            {csvData}
                          </option>
                        ))}
                    </select>

                    {/* Template Header Select */}
                    <select
                      className="block w-1/3 py-1 ms-10 text-xl font-semibold text-center border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      aria-label="Template Header"
                      onChange={(e) =>
                        handleTemplateHeaderChange(csvHeader, e.target.value)
                      }
                      value={getValidValue()} // Now correct per row
                    >
                      <option value="UserFieldName">UserFieldName</option>
                      {templateHeaders?.map((template, idx) => (
                        <option key={idx} value={template}>
                          {template}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}

export default HeaderData;
