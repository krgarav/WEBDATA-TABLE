import React, { useState, useContext, useEffect } from "react";
import Select from "react-select";
import dataContext from "../Store/DataContext";
import {
  onGetTemplateHandler,
  fetchFilesAssociatedWithTemplate,
  onGetAllTasksHandler,
  REACT_APP_IP,
} from "../services/common";
import axios from "axios";
const NewSelect = (props) => {
  const [selectValue, setSelectValue] = useState(null);
  const [options, setOptions] = useState([]);
  const [fileOptions, setFileOptions] = useState([]);
  const [zipFileOptions, setZipFileOptions] = useState([]);
  const dataCtx = useContext(dataContext);

  const fetchFile = async (templateId) => {
    try {
      const response = await fetchFilesAssociatedWithTemplate(templateId);
      const csvOptions = response.map((item) => ({
        label: item.csvFile,
        value: item.id,
      }));
      const zipOptions = response.map((item) => ({
        label: item.zipFile,
        value: item.id,
      }));
      console.log(csvOptions, "csvOptions");
      setFileOptions(csvOptions);
      setZipFileOptions(zipOptions);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const templates = await onGetTemplateHandler();

        const options = templates.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        // console.log(options,"options")
        setOptions(options);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (props.label === "Select Template") {
      fetchData();
    } else if (
      (props.label === "Select Csv Files 2" ||
        props.label === "Select Zip Files") &&
      props.selectedTemplate
    ) {
      fetchFile(props.selectedTemplate);
    }
  }, [props.label, props.selectedTemplate]);

  const fetchHeaders = async (fileName) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/getUploadedFileHeader?fileName=${fileName}`
      );
      const headerData = res.data.headers;
      dataCtx.addToCsvHeader(headerData);
      // console.log("res", res);
    } catch (error) {
      console.error("Error fetching headers:", error);
    }
  };
  const handleChange = (selectedOption) => {
    setSelectValue(selectedOption.value);

    if (props.label === "Select Image Column") {
      dataCtx.setImageColName(selectedOption.value);
    } else if (props.label === "Select Primary Key") {
      dataCtx.addToPrimaryKey(selectedOption.value);
    } else if (props.label === "Select Template") {
      props.onTemplateSelect(selectedOption.value);
      fetchFile(selectedOption.value);
    } else if (props.label === "Select Csv Files 2") {
      dataCtx.addSecondInputFileName(selectedOption.label);
      fetchHeaders(selectedOption.label);
    } else if (props.label === "Select Zip Files") {
      dataCtx.setUploadZipImage(selectedOption.label);
      dataCtx.modifyFileId(selectedOption.value);
    }
  };
  const customStyles = {
    menu: (provided) => ({
      ...provided,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.6)",
    }),
  };
  const customDropdownStyles = {
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // Set a high z-index value
    }),
  };

  const optionsToShow =
    props.label === "Select Csv Files 2"
      ? fileOptions
      : props.label === "Select Zip Files"
      ? zipFileOptions
      : options;

  return (
    <Select
      value={optionsToShow.find((option) => option.value === selectValue)}
      onChange={handleChange}
      options={optionsToShow}
      styles={{ ...customStyles, ...customDropdownStyles }}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      className="w-[100%] pt-5 text-md leading-7"
      placeholder={props.label}
    />
  );
};

export default NewSelect;
