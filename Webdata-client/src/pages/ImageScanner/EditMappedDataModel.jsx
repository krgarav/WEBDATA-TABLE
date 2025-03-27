import React, { useEffect, useState } from "react";
import HeaderData from "../TemplateMapping/HeaderData";
import HeaderMappedReview from "../TemplateMapping/HeaderMappedReview";
import { useNavigate, useParams } from "react-router-dom";
import {
  checkMappedDataExits,
  fetchHeadersInDuplicate,
  onGetTemplateHandler,
  submitMappedData,
} from "../../services/common";
import { toast } from "react-toastify";

const EditMappedDataModel = ({ isOpen, onClose, selectedCoordinates }) => {
  if (!isOpen) return null; // Don't render if modal is not open

  const [csvHeaders, setCsvHeaders] = useState([]);
  const [templateHeaders, setTemplateHeaders] = useState([]);
  const [selectedAssociations, setSelectedAssociations] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [prevValue, setPrevValue] = useState([]);

  let { fileId } = JSON.parse(localStorage.getItem("fileId")) || "";
  let token = JSON.parse(localStorage.getItem("fileId"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await checkMappedDataExits(token.templeteId);
        console.log(response.records);
        const keys = response.records.map((item) => item.key);
        console.log(keys);
        const values = response.records.map((item) => item.value);
        setCsvHeaders(keys);
        const latestData = selectedCoordinates.map((item) => item.attribute);
        console.log(selectedCoordinates);
        setTemplateHeaders(latestData);
        setPrevValue(values);
        const associatedData = response.records.map((item) => ({
          [item.key]: item.value,
        }));

        const obj = Object.assign({}, ...associatedData);

        setSelectedAssociations(obj);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTemplate();
  }, []);

  const handleCsvHeaderChange = (csvHeader, index) => {
    const updatedAssociations = { ...selectedAssociations };
    updatedAssociations[csvHeader] = index;
    setSelectedAssociations(updatedAssociations);

    csvHeaders.forEach((header) => {
      if (!(header in updatedAssociations)) {
        updatedAssociations[header] = "";
      }
    });

    setSelectedAssociations(updatedAssociations);
  };

  const handleTemplateHeaderChange = (csvHeader, templateHeader) => {
    const updatedAssociations = { ...selectedAssociations };

    if (templateHeader.includes("--")) {
      const [min, max] = templateHeader.split("--");
      const newMin = parseInt(min);
      const newMax = parseInt(max);
      // Loop through all headers

      Object.keys(selectedAssociations).forEach((header) => {
        const questionNumber = parseInt(header.replace(/\D/g, ""));
        if (questionNumber >= newMin && questionNumber <= newMax) {
          updatedAssociations[header] = templateHeader;
        }
      });
    } else if (templateHeader === "UserFieldName") {
      updatedAssociations[csvHeader] = "";
    } else {
      updatedAssociations[csvHeader] = templateHeader;
    }
    // Ensure all headers are included in updatedAssociations
    csvHeaders.forEach((header) => {
      if (!(header in updatedAssociations)) {
        updatedAssociations[header] = "";
      }
    });

    setSelectedAssociations(updatedAssociations);
  };

  const onMapSubmitHandler = async () => {
    const mappedvalues = Object.values(selectedAssociations);

    for (let i = 1; i <= templateHeaders.pageCount; i++) {
      if (!mappedvalues.includes(`Image${i}`)) {
        toast.error("Please select all the field properly.");
        return;
      }
    }
    setSubmitLoading(true);
    const associationData = [];
    const obj = { ...selectedAssociations };
    for (let i = 0; i < csvHeaders.length; i++) {
      const header = csvHeaders[i];
      if (obj.hasOwnProperty(header)) {
        associationData.push({
          key: header,
          value: obj[header],
        });
      }
    }

    const mappedData = {
      associationData: associationData,
      fileId: fileId,
    };

    try {
      const response = await submitMappedData(mappedData);
      console.log(response);
      if (response.success) {
        toast.success("Mapping Updated Successfully.");
        onClose();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[50%]">
        <div className="flex justify-between items-start">
          <h1 className="text-blue-800 text-4xl text-center mb-10">Mapping</h1>
          <button onClick={onClose} className="text-3xl text-red-500 font-bold">
            X
          </button>
        </div>
        <HeaderData
          csvHeaders={csvHeaders}
          prevValue={prevValue}
          handleTemplateHeaderChange={handleTemplateHeaderChange}
          templateHeaders={templateHeaders}
          selectedAssociations={selectedAssociations}
          handleCsvHeaderChange={handleCsvHeaderChange}
        />
        <HeaderMappedReview
          onMapSubmitHandler={onMapSubmitHandler}
          setShowModal={setShowModal}
          showModal={showModal}
          selectedAssociations={selectedAssociations}
          submitLoading={submitLoading}
        />
      </div>
    </div>
  );
};

export default EditMappedDataModel;
