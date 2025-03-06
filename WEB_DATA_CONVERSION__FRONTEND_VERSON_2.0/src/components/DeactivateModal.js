import React, { useState } from "react";
import { FaCloudDownloadAlt } from "react-icons/fa";
import axios from "axios";
import { REACT_APP_IP } from "../services/common";
const token = JSON.parse(localStorage.getItem("userData"));

const DeactivateModal = ({ isOpen, onClose, taskId }) => {
  const [errorLoading, setErrorLoading] = useState(false);
  const [correctLoading, setCorrectLoading] = useState(false);

  const ErrorCorrectedFileHandler = async () => {
    try {
      setErrorLoading(true);
      const response = await axios.get(
        `http://${REACT_APP_IP}:4000/download/errorCorrectedCsv/${taskId}`,
        {
          responseType: "blob", // Important for handling binary data
          headers: {
            token: token,
          },
        }
      );

      // Extract the filename from the response headers
      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "error_corrected_file";

      // Append the current timestamp to the filename
      const timestamp = new Date().toISOString().replace(/:/g, "-");
      const fullFileName = `${fileName}_${timestamp}.csv`;

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link element and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fullFileName); // Use the filename with timestamp
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file", error);
    } finally {
      setErrorLoading(false);
    }
  };

  const CorrectedFileHandler = async () => {
    try {
      setCorrectLoading(true);
      // Fetch the corrected file from the server
      const response = await axios.get(
        `http://${REACT_APP_IP}:4000/download/correctedCsv/${taskId}`,
        {
          responseType: "blob", // Important for downloading files
          headers: {
            token: token,
          },
        }
      );

      // Log all response headers for debugging
      console.log("Response Headers:", response.headers);

      // Extract the original filename from the response headers
      const originalFilenameWithTimestamp =
        response.headers["x-original-filename"] || "corrected_file.csv";
      console.log("Original Filename:", originalFilenameWithTimestamp);

      // Remove everything before the underscore, including the underscore itself
      const filenameWithUnderscore = originalFilenameWithTimestamp.replace(
        /^[^_]*_/,
        ""
      );

      // Append the new timestamp to the filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fullFileName = `${filenameWithUnderscore}_${timestamp}.csv`;

      // Create a URL for the file and initiate download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fullFileName); // Specify the file name with new timestamp
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Optionally, release the URL object
    } catch (error) {
      console.error("Error downloading the file:", error);
    } finally {
      setCorrectLoading(false);
    }
  };

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:px-2 sm:py-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <h3
                    className="text-2xl font-semibold leading-6 text-gray-700"
                    id="modal-title"
                  >
                    Download File
                  </h3>
                  <div className="mt-6 px-6">
                    <div className="flex justify-between my-3 gap-2">
                      <h3
                        className="text-lg font-semibold leading-6 text-blue-500 w-40"
                        id="modal-title"
                      >
                        Error Corrected File
                      </h3>
                      {errorLoading ? (
                        <button
                          className="rounded-3xl border border-indigo-500 bg-indigo-400 px-4 py-1 font-semibold text-white flex justify-center items-center"
                          disabled={errorLoading}
                        >
                          <svg
                        className="mr-2 h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                          Compiling & Downloading..
                        </button>
                      ) : (
                        <button
                          className="rounded-3xl border border-indigo-500 bg-indigo-500 px-4 py-1 font-semibold text-white"
                          onClick={ErrorCorrectedFileHandler}
                        >
                          <FaCloudDownloadAlt />
                        </button>
                      )}
                    </div>
                    <div className="flex justify-between my-3 gap-2">
                      <h3
                        className="text-lg font-semibold leading-6 text-blue-500 w-40"
                        id="modal-title"
                      >
                        Corrected File
                      </h3>
                      {correctLoading ? (
                        <button
                          className="rounded-3xl border border-indigo-500 bg-indigo-400 px-4 py-1 font-semibold text-white flex justify-center items-center"
                          disabled={correctLoading}
                        >
                          <svg
                        className="mr-2 h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                          Compiling & Downloading..
                        </button>
                      ) : (
                        <button
                          className="rounded-3xl border border-indigo-500 bg-indigo-500 px-4 py-1 font-semibold text-white"
                          onClick={CorrectedFileHandler}
                        >
                          <FaCloudDownloadAlt />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() => onClose()}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeactivateModal;
