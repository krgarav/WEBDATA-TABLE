import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSadCry } from "react-icons/fa";

const SettingModel = ({
  settingModel,
  setsettingModel,
  token,
  templateId,
  templatePermissions,
}) => {
  const [templateData, settemplateData] = useState();
  //   const [items, setItems] = useState([]);
  //   const [original, setOriginal] = useState([]);
  //   const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState();
  //   const token = localStorage.getItem("userData");

  useEffect(() => {
    const fetchTempData = async () => {
      const data = await axios.get(
        `${window.SERVER_IP}/get/templetedata/${templateId}`,
        {
          headers: {
            token: token,
          },
        }
      );
      const copy = data.data?.templetedata.map((d) => ({
        id: d.id,
        attribute: d.attribute,
        pattern: !!d.pattern,
        blank: !!d.blank,
        empty: !!d.empty,
      }));

      //   setItems(copy);
      //   setOriginal(copy);
      settemplateData(data.data?.templetedata);
    };
    fetchTempData();
  }, [templateId]);

  const handleCheckboxChange = (e, type, id) => {
    const checked = e.target.checked;

    console.log("Checkbox value:", checked);
    console.log("Type:", type); // "pattern"
    console.log("ID:", id); // data.id

    // Example update logic (modify as needed)
    settemplateData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [type]: checked } : item))
    );
  };
  const handleSubmit = async () => {
    try {
      // prepare updates array exactly as backend expects
      const updates = templateData.map((row) => ({
        id: row.id,
        pattern: row.pattern,
        blank: row.blank,
        empty: row.empty,
      }));

      const response = await axios.put(
        `${window.SERVER_IP}/batch`,
        { updates },
        {
          headers: {
            token: token,
          },
        }
      );

      console.log("Updated rows:", response.data);

      // optional: update UI with server response
      //   settemplateData(response.data);
      setsettingModel(false);
      toast.success("Updated successfully!");
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Something went wrong!");
    }
  };

  console.log(templatePermissions);
  return (
    <>
      {settingModel && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              onClick={() => setsettingModel(false)}
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal content */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  background: "#f9f9f9",
                  width: "100%",
                }}
              >
                {/* Pattern Definition */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 10px",
                    background: "white",
                    borderRadius: "6px",
                    border: "1px solid #eee",
                  }}
                >
                  <label style={{ fontWeight: "600", color: "#333" }}>
                    Pattern Definition:
                  </label>
                  <span
                    style={{
                      color: "#555",
                      marginLeft: "10px",
                      fontSize: "25px",
                    }}
                  >
                    {templatePermissions.patternDefinition || "— Not Defined —"}
                  </span>
                </div>

                {/* Blank Definition */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 10px",
                    background: "white",
                    borderRadius: "6px",
                    border: "1px solid #eee",
                  }}
                >
                  <label style={{ fontWeight: "600", color: "#333" }}>
                    Blank Definition:
                  </label>
                  <span
                    style={{
                      color: "#555",
                      marginLeft: "10px",
                      fontSize: "25px",
                    }}
                  >
                    {templatePermissions.blankDefination || "— Not Defined —"}
                  </span>
                </div>
              </div>

              {templateData
                .filter((field) => field.fieldType === "formField" && field)
                .map((data, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-5 border-b border-gray-300"
                  >
                    {/* Left Side - Attribute */}
                    <span className="text-xl font-medium">
                      {data.attribute}
                    </span>

                    {/* Right Side - Checkboxes */}
                    <div className="flex gap-10 items-center">
                      {/* Pattern */}
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={data.pattern}
                          onChange={(e) =>
                            handleCheckboxChange(e, "pattern", data.id)
                          }
                          className="w-5 h-5"
                        />
                        <span className="text-lg">Pattern</span>
                      </label>

                      {/* Blank */}
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={data.blank}
                          onChange={(e) =>
                            handleCheckboxChange(e, "blank", data.id)
                          }
                          className="w-5 h-5"
                        />
                        <span className="text-lg">Blank</span>
                      </label>

                      {/* Empty */}
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={data.empty}
                          onChange={(e) =>
                            handleCheckboxChange(e, "empty", data.id)
                          }
                          className="w-5 h-5"
                        />
                        <span className="text-lg">Empty</span>
                      </label>
                    </div>
                  </div>
                ))}
              <div className="flex justify-center m-5">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingModel;
