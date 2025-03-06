import React from "react";
import { GiCrossMark } from "react-icons/gi";

const PreFilesModal = ({ setOpenPreFile, openPreFile, files, onDownloadFileHandler }) => {
    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${openPreFile ? 'block' : 'hidden'} transition-opacity duration-300`}>
            <div className="max-w-lg w-full bg-white shadow-xl rounded-xl p-6 relative">
                {/* Close Button */}
                <button
                    onClick={() => setOpenPreFile(false)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
                >
                    <GiCrossMark />
                </button>

                {/* Modal Header */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Previous Files</h2>

                {/* File List */}
                <div className="max-h-72 overflow-y-auto space-y-3">
                    {files?.map((file, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center p-3 border border-gray-300 rounded-lg bg-gray-100 shadow-sm hover:shadow-md transition duration-300"
                        >
                            {/* File Name */}
                            <span className="text-gray-800 font-medium text-sm sm:text-base truncate w-3/4 break-words">
                                {file.csvFile}
                            </span>

                            {/* Download Button */}
                            <button
                                onClick={() => onDownloadFileHandler(file)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition">
                                Download
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PreFilesModal;
