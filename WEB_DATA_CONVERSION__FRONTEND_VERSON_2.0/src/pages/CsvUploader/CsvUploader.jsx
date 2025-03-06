import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import UploadFile from "../../assets/images/CsvUploaderImg copy.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import dataContext from "../../Store/DataContext";
import ModalWithLoadingBar from "../../UI/Modal";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

import {
  onGetTemplateHandler,
  onGetVerifiedUserHandler,
} from "../../services/common";
import TemplateRemove from "./TemplateRemove";
import TemplateEdit from "./TemplateEdit";
import UploadSection from "./UploadSection";
import PreFilesModal from "./PreFilesModal";
import Papa from "papaparse";
const CsvUploader = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFolder, setImageFolder] = useState(null);
  const [selectedId, setSelectedId] = useState();
  const [allTemplates, setAllTemplates] = useState([]);
  const [templateName, setTemplateName] = useState("");
  const [imageNames, setImageNames] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [removeId, setRemoveId] = useState(null);
  const [removeModal, setRemoveModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [openPreFile, setOpenPreFile] = useState(false);
  const [confirmation, setConfirmationModal] = useState(false);
  const [preFiles, setPreFiles] = useState([]);
  const dataCtx = useContext(dataContext);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("userData"));

  const data = allTemplates?.find((item) => item.id === selectedId);

  // Tab Button disabled
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // getting all the templates and users
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await onGetTemplateHandler();
        const user = await onGetVerifiedUserHandler();
        setCurrentUser(user.user);
        const csvTemplates = response.filter(
          (data) => data.TempleteType === "Data Entry"
        );
        setAllTemplates(csvTemplates);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTemplate();
  }, []);

  const filteredTemplates = allTemplates?.filter((template) =>
    template.name.toLowerCase().includes(templateName.toLowerCase())
  );

  const onCsvFileHandler = (event) => {
    const fileInput = event.target.files[0];
    handleFileUpload(
      fileInput,
      ["csv", "xlsx"],
      "Please upload a CSV or Excel file.",
      setCsvFile
    );
  };

  const handleImageNameChange = (index, value) => {
    setImageNames((prevNames) => {
      const updatedNames = [...prevNames];
      updatedNames[index] = value;
      return updatedNames;
    });
  };

  const onImageFolderHandler = (event) => {
    const fileInput = event.target.files[0];
    console.log(fileInput);
    handleFileUpload(
      fileInput,
      ["zip", "folder", "rar"],
      "Please upload a ZIP file or a folder.",
      setImageFolder
    );
  };

  const handleFileUpload = (
    file,
    allowedExtensions,
    errorMessage,
    setFileState
  ) => {
    if (file) {
      const extension = file.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        toast.error(errorMessage);
        return;
      }
      setFileState(file);
    }
  };

  const uploadChunk = async (
    zipFile,
    chunkIndex,
    totalChunks,
    overallProgressCallback
  ) => {
    try {
      // Get the original name of the zip file
      const zipFileName = imageFolder?.name;

      const formData = new FormData();
      formData.append("chunk", zipFile); // Make sure 'chunk' matches with multer config
      formData.append("csvFile", csvFile);
      formData.append("chunkIndex", chunkIndex);
      formData.append("totalChunks", totalChunks);

      // Append the original zip file name
      formData.append("zipFileName", zipFileName);

      const imageNamesString = imageNames.join(",");

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_IP}/upload/${selectedId}?imageNames=${imageNamesString}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: token,
          },
          onUploadProgress: (progressEvent) => {
            // Calculate the progress of the current chunk
            const chunkProgress =
              (progressEvent.loaded / progressEvent.total) * 100;
            // Pass the calculated chunk progress to the callback
            overallProgressCallback(chunkProgress, chunkIndex);
          },
        }
      );

      return response.data; // Return the response from the server
    } catch (error) {
      throw new Error(error.response?.data?.error || "Upload failed.");
    }
  };

  const onSaveFilesHandler = async () => {
    setConfirmationModal(false);

    const chunkSize = 2 * 1024 * 1024 * 1024 - 1; // 1 byte less than 2GB
    const totalChunks = Math.ceil(imageFolder.size / chunkSize);
    let start = 0;
    let chunkIndex = 0;
    let overallProgress = 0;

    setLoading(true);
    dataCtx.modifyIsLoading(true);
    const imageNamesString = imageNames.join(",");
    try {
      let fileId;

      // Define the overall progress callback to calculate the total progress percentage
      const updateOverallProgress = (chunkProgress, chunkIndex) => {
        overallProgress =
          ((chunkIndex + chunkProgress / 100) / totalChunks) * 100;
        setProgress(Math.round(overallProgress));
      };

      while (start < imageFolder.size) {
        const chunk = imageFolder.slice(start, start + chunkSize);

        fileId = await uploadChunk(
          chunk,
          chunkIndex,
          totalChunks,
          updateOverallProgress
        );

        start += chunkSize;
        chunkIndex += 1;
      }

      // All chunks have been uploaded, navigate and finalize
      toast.success("Files uploaded successfully!");
      dataCtx.modifyIsLoading(false);
      navigate(`/csvuploader/duplicatedetector/${selectedId}`);
      localStorage.setItem("fileId", JSON.stringify(fileId));
      localStorage.setItem("pageCount", JSON.stringify(data.pageCount));
      localStorage.setItem("imageName", JSON.stringify(imageNamesString));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onTemplateEditHandler = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_IP}/edit/template/${id}`,
        {},
        {
          headers: {
            token: token,
          },
        }
      );

      if (response.data.imagePaths.length === 0) {
        toast.warning("No image found.");
        return;
      }
      const data = response.data.template;
      const templateData = {
        templateData: {
          name: data.name,
          pageCount: data.pageCount,
          id: data.id,
          typeOption: data.typeOption,
          patternDefinition: data.patternDefinition,
          blankDefination: data.blankDefination,
          isPermittedToEdit: data.isPermittedToEdit,
        },
        metaData: [...data.templetedata],
      };
      dataCtx.modifyTemplateData(templateData);
      localStorage.setItem("templateOption", JSON.stringify("updating"));
      localStorage.setItem("images", JSON.stringify(response.data.imagePaths));
      navigate("/imageuploader/scanner");
    } catch (error) {
      console.error("Error uploading files: ", error);
    }
  };

  const onTemplateRemoveHandler = async (id) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_IP}/delete/template/${id}`,
        {},
        {
          headers: {
            token: token,
          },
        }
      );
      const filteredTemplates = allTemplates.filter((data) => data.id !== id);
      setAllTemplates(filteredTemplates);
      setRemoveModal(false);
      toast.success("Succesfully template removed.");
    } catch (error) {
      console.log(error?.response?.data?.error);
      toast.warning(error?.response?.data?.error);
    }
  };

  const onGetCsvInfoHandler = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_IP}/getcsvinfo/${selectedId}`,
        {
          headers: {
            token: token,
          },
        }
      );
      setPreFiles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onDownloadFileHandler = async (file) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_IP}/download/csv/${file.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      a.download = file.csvFile;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const onFileHeaderDetailsHandler = async () => {
    if (!selectedId) {
      toast.error("Please select the template name.");
      return;
    }

    if (currentUser.role !== "Admin") {
      toast.warning("Access denied. Admins only.");
      return;
    }

    if (imageNames.length !== data.pageCount) {
      toast.error("Please fill in all image fields.");
      return;
    }

    if (!csvFile) {
      toast.error("Please upload the CSV file.");
      return;
    }

    if (!imageFolder) {
      toast.error("Please upload the image folder.");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_IP}/get/csvheader/${selectedId}`,
        {
          headers: { token },
        }
      );
     
      if (response.data?.data?.length === 0) {
        setConfirmationModal(true);
        return;
      }
      const expectedHeaders = response.data || [];

      // If expectedHeaders is empty, skip the validation
      if (expectedHeaders.length === 0) {
        setConfirmationModal(true);
        return;
      }

      // Parse the uploaded CSV file using PapaParse
      Papa.parse(csvFile, {
        complete: (result) => {
          if (!result || !result.data || result.data.length === 0) {
            toast.error("Invalid or empty CSV file.");
            return;
          }

          // Extract headers from the first row
          const uploadedHeaders = Object.keys(result.data[0]);

          // Check if headers match
          const isMatching =
            expectedHeaders.length === uploadedHeaders.length &&
            expectedHeaders.every(
              (header, index) => header === uploadedHeaders[index]
            );

          if (!isMatching) {
            toast.error(
              "Please upload the correct CSV file. Headers do not match."
            );
            return;
          }

          setConfirmationModal(true);
        },
        header: true,
        skipEmptyLines: true,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error fetching CSV headers.");
    }
  };

  return (
    <div className="flex justify-center items-center h-auto w-full ">
      <div className="w-full">
        <div className="csvuploader bg-gradient-to-r from-blue-400 to-blue-600 xl:h-[100vh] w-full flex flex-col justify-center items-center">
          <UploadSection
            onImageFolderHandler={onImageFolderHandler}
            setEditId={setEditId}
            setEditModal={setEditModal}
            data={data}
            templateName={templateName}
            setTemplateName={setTemplateName}
            imageNames={imageNames}
            filteredTemplates={filteredTemplates}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            setRemoveModal={setRemoveModal}
            setRemoveId={setRemoveId}
            handleImageNameChange={handleImageNameChange}
            UploadFile={UploadFile}
            csvFile={csvFile}
            onCsvFileHandler={onCsvFileHandler}
            imageFolder={imageFolder}
            setOpenPreFile={setOpenPreFile}
            onGetCsvInfoHandler={onGetCsvInfoHandler}
            onFileHeaderDetailsHandler={onFileHeaderDetailsHandler}
          />
        </div>

        {/* EDIT CONFIRMATION MODAL */}
        <TemplateEdit
          onTemplateEditHandler={onTemplateEditHandler}
          editModal={editModal}
          editId={editId}
          setEditModal={setEditModal}
        />

        {/* REMOVE CONFIRMATION MODAL */}
        <TemplateRemove
          removeModal={removeModal}
          onTemplateRemoveHandler={onTemplateRemoveHandler}
          setRemoveModal={setRemoveModal}
          removeId={removeId}
        />
      </div>
      <div>
        <ModalWithLoadingBar
          isOpen={loading}
          onClose={() => {}}
          progress={progress}
          message="Uploading csv and image zip the files..."
        />

        <PreFilesModal
          onDownloadFileHandler={onDownloadFileHandler}
          files={preFiles}
          setOpenPreFile={setOpenPreFile}
          openPreFile={openPreFile}
        />

        <ConfirmationModal
          confirmationModal={confirmation}
          onSubmitHandler={onSaveFilesHandler}
          setConfirmationModal={setConfirmationModal}
          heading="upload files confirmation"
          message={"This is for file upload"}
        />
      </div>
    </div>
  );
};

export default CsvUploader;
