import React, { useEffect, useRef, useState } from "react";
import ImageNotFound from "../../components/ImageNotFound/ImageNotFound";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  getRowCsvData,
  onGetTaskHandler,
  onGetTemplateHandler,
  onGetVerifiedUserHandler,
  REACT_APP_IP,
  updateCurrIndexData,
} from "../../services/common";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import ButtonSection from "../DataMatching/ButtonSection";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import CSVFormDataSection from "./CSVFormDataSection";
import CorrectionField from "./CorrectionField";
import { Button } from "@mui/material";
import ImageSectionCSV from "./IamgeSectionCSV";
import ButtonCsvSection from "./ButtonCsvSection";

const UserCorrectionData = () => {
  const [popUp, setPopUp] = useState(false);
  const [templateHeaders, setTemplateHeaders] = useState(null);
  const [csvCurrentData, setCsvCurrentData] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [imageColName, setImageColName] = useState("");
  const [imageColNames, setImageColNames] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTaskData, setCurrentTaskData] = useState(
    JSON.parse(localStorage.getItem("taskdata")) || null
  );
  const [selectedCoordintes, setSelectedCoordinates] = useState(false);
  const [modifiedKeys, setModifiedKeys] = useState({});
  const [imageNotFound, setImageNotFound] = useState(true);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [userRole, setUserRole] = useState();
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [currIndex, setCurrIndex] = useState(1);
  const [currentData, setCurrentData] = useState(null);
  const [subData, setSubData] = useState(null);
  const [maximum, setMaximum] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(
    JSON.parse(localStorage.getItem("taskdata")).currentIndex
  );
  const [headerData, setHeaderData] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState();
  const location = useLocation();
  const token = JSON.parse(localStorage.getItem("userData"));
  const [header, setHeader] = useState(null);
  const [filterResults, setFilterResults] = useState(null);
  const [mappedData, setMappedData] = useState([]);
  const [formData, setFormData] = useState(null);
  const [taskId, setTaskId] = useState(
    location.state !== null
      ? location.state.id
      : JSON.parse(localStorage.getItem("taskdata")).id
  );
  const [loading, setLoading] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const task = JSON.parse(localStorage.getItem("taskdata"));
  const navigate = useNavigate();

  useEffect(() => {
    const enableFullscreen = () => {
      const element = document.documentElement;
      if (!document.fullscreenElement) {
        element.requestFullscreen?.() ||
          element.mozRequestFullScreen?.() ||
          element.webkitRequestFullscreen?.() ||
          element.msRequestFullscreen?.();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        enableFullscreen();
      }
    };

    // Run fullscreen logic when component mounts
    enableFullscreen();

    // Listen for visibility change to restore fullscreen if needed
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentData]);

  // console.log(currentTaskData)
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const response = await axios.post(
  //           `http://${REACT_APP_IP}:4000/get/csvdata`,
  //           { taskData: currentTaskData },
  //           {
  //             headers: {
  //               token: token,
  //             },
  //           }
  //         );

  //         if (response.data.length === 1) {
  //           toast.warning("No matching data was found.");
  //           return;
  //         }
  //         console.log(response);
  //         setCsvData(response.data);
  //       } catch (error) {
  //         toast.error(error?.response?.data?.error);
  //       }
  //     };
  //     fetchData();
  //   }, []);

  // useEffect(() => {
  //   const fetchCurrentUser = async () => {
  //     try {
  //       const verifiedUser = await onGetVerifiedUserHandler();

  //       setUserRole(verifiedUser.user.role);
  //       const tasks = await onGetTaskHandler(verifiedUser.user.id);
  //       const templateData = await onGetTemplateHandler();

  //       const uploadTask = tasks.filter((task) => {
  //         return task.moduleType === "Data Entry";
  //       });
  //       const comTask = tasks.filter((task) => {
  //         return task.moduleType === "CSV Compare";
  //       });

  //       const updatedCompareTasks = comTask.map((task) => {
  //         const matchedTemplate = templateData.find(
  //           (template) => template.id === parseInt(task.templeteId)
  //         );
  //         if (matchedTemplate) {
  //           return {
  //             ...task,
  //             templateName: matchedTemplate.name,
  //           };
  //         }
  //         return task;
  //       });
  //       const updatedTasks = uploadTask.map((task) => {
  //         const matchedTemplate = templateData.find(
  //           (template) => template.id === parseInt(task.templeteId)
  //         );
  //         if (matchedTemplate) {
  //           return {
  //             ...task,
  //             templateName: matchedTemplate.name,
  //           };
  //         }
  //         return task;
  //       });
  //       setAllTasks(updatedTasks);
  //       setCompareTask(updatedCompareTasks);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchCurrentUser();
  // }, [popUp]);

  // useEffect(() => {
  //   const fetchTemplate = async () => {
  //     try {
  //       const response = await onGetTemplateHandler();

  //       const templateData = response.find(
  //         (data) => data.id === parseInt(currentTaskData.templeteId)
  //       );

  //       setTemplateHeaders(templateData);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchTemplate();
  // }, [currentTaskData]);

  // useEffect(() => {
  //   const req = async () => {
  //     const { data } = await axios.post(
  //       `http://${REACT_APP_IP}:4000/getCompareCsvData/${taskId}`,
  //       { currentIndex },
  //       {
  //         headers: {
  //           token: token,
  //         },
  //       }
  //     );

  //     setHeaderData(data?.data?.headers);
  //     setHeader(data?.data?.headers);
  //     setFilteredArray(data?.data?.filteredData);
  //     setMaximum(parseInt(data?.data?.max));
  //     setMinimum(parseInt(data?.data?.min));
  //     setCorrectionData(data?.data);
  //   };
  //   req();
  // }, [currentIndex]);

  // useEffect(() => {
  //   onImageHandler(
  //     "initial",
  //     currentIndex,
  //     correctionData?.filteredResults,
  //     JSON.parse(localStorage.getItem("taskdata"))
  //   );
  // }, []);

  useEffect(() => {
    const req = async (taskId, rowId) => {
      const response = await getRowCsvData(taskId, rowId);
      if (response?.data) {
        setFormData(response.data);
        setImageUrls(response.imageUrl);
      }
    };
    if (currentData) {
      req(taskId, currentData?.parentId);
    }
  }, [currentData, currIndex]);

  useEffect(() => {
    setLoading(true);
    const req = async () => {
      const response = await axios.post(
        `${window.SERVER_IP}/getCompareCsvData/${taskId}`,
        { currentIndex },
        {
          headers: {
            token: token,
          },
        }
      );
      setCurrentData(response?.data?.mainData);
      setSubData(response?.data?.subData);
      setTotalData(response?.data?.errorCount);
      setCurrIndex(response?.data?.currentIndex);
    };
    req();
  }, [currentIndex, currIndex]);
  // const onCsvUpdateHandler = async () => {
  //   if (!modifiedKeys) {
  //     onImageHandler("next", currentIndex, headerData, currentTaskData);
  //     toast.success("Data updated successfully.");
  //     return;
  //   }

  //   try {
  //     await axios.post(
  //       `http://${REACT_APP_IP}:4000/updatecsvdata/${parseInt(
  //         currentTaskData?.fileId
  //       )}`,
  //       {
  //         updatedData: csvCurrentData,
  //         index: csvCurrentData.rowIndex + 1,
  //         updatedColumn: modifiedKeys,
  //       },
  //       {
  //         headers: {
  //           token: token,
  //         },
  //       }
  //     );

  //     setCsvData((prevCsvData) => {
  //       const newCsvData = [...prevCsvData];
  //       newCsvData[currentIndex] = csvCurrentData;
  //       return newCsvData;
  //     });
  //     onImageHandler("next", currentIndex, headerData, currentTaskData);
  //     toast.success(`Data updated successfully .`);
  //   } catch (error) {
  //     console.error("API error:", error);
  //     toast.error(error.message);
  //   }
  // };

  // useEffect(() => {
  //   if (!popUp) {
  //     const handleKeyDown = (event) => {
  //       if (event.ctrlKey && event.key === "ArrowLeft") {
  //         setPopUp(true);
  //       } else if (event.altKey && (event.key === "s" || event.key === "S")) {
  //         setCsvCurrentData((prevData) => ({
  //           ...prevData,
  //         }));
  //         onCsvUpdateHandler();
  //       } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
  //         if (currentImageIndex > 0) {
  //           setCurrentImageIndex(currentImageIndex - 1);
  //           setSelectedCoordinates(false);
  //           setZoomLevel(1);

  //           if (imageRef.current) {
  //             imageRef.current.style.transform = "none";
  //             imageRef.current.style.transformOrigin = "initial";
  //           }
  //         } else {
  //           // onImageHandler("prev", currentIndex, csvData, currentTaskData);
  //           setCurrentImageIndex(0);
  //         }
  //       } else if (event.key === "ArrowRight" || event.key === "PageDown") {
  //         if (currentImageIndex < imageUrls.length - 1) {
  //           setCurrentImageIndex(currentImageIndex + 1);
  //           setSelectedCoordinates(false);
  //           setZoomLevel(1);
  //           if (imageRef.current) {
  //             imageRef.current.style.transform = "none";
  //             imageRef.current.style.transformOrigin = "initial";
  //           }
  //         } else {
  //           // onImageHandler("next", currentIndex, csvData, currentTaskData);
  //           setCurrentImageIndex(0);
  //         }
  //       } else if (event.shiftKey && event.key === "+") {
  //         zoomInHandler();
  //         setSelectedCoordinates(true);
  //       } else if (event.shiftKey && event.key === "-") {
  //         zoomOutHandler();
  //         setSelectedCoordinates(true);
  //       } else if (event.shiftKey && (event.key === "I" || event.key === "i")) {
  //         onInialImageHandler();
  //       } else if (event.shiftKey && (event.key === "p" || event.key === "P")) {
  //         onImageHandler("prev", currentIndex, headerData, currentTaskData);
  //       }
  //     };

  //     window.addEventListener("keydown", handleKeyDown);
  //     return () => {
  //       window.removeEventListener("keydown", handleKeyDown);
  //     };
  //   }
  // }, [csvData, currentTaskData, setCsvCurrentData, onCsvUpdateHandler]);

  // const onImageHandler = async (
  //   direction,
  //   currentIndex,
  //   filteredData,
  //   taskData
  // ) => {
  //   const headers = header?.[0];
  //   const getKeysByPattern = (object, pattern) => {
  //     const regex = new RegExp(pattern);
  //     return Object?.keys(object)?.filter((key) => regex?.test(object?.[key]));
  //   };

  //   const imageNames = [];
  //   let i = 1;
  //   while (true) {
  //     const keys = getKeysByPattern(headers, `Image${i}`);
  //     if (keys.length === 0) break;
  //     imageNames.push(...keys);
  //     i++;
  //   }

  //   setImageColNames(imageNames);
  //   // console.log(imageNames)
  //   try {
  //     let newIndex = currentIndex;

  //     let allImagePaths;
  //     if (direction === "initial") {
  //       const objects = filteredArray[newIndex];
  //       allImagePaths = imageNames.map((key) => objects[key]);

  //       setCsvCurrentData(objects);
  //     } else {
  //       newIndex = direction === "next" ? newIndex + 1 : newIndex - 1;
  //       if (newIndex >= minimum && newIndex <= maximum) {
  //         setCurrentIndex(newIndex);
  //         const objects = filteredArray[newIndex];
  //         allImagePaths = imageNames.map((key) => objects[key]);

  //         setCsvCurrentData(objects);
  //       } else {
  //         toast.warning(
  //           direction === "next"
  //             ? "All images have been processed."
  //             : "You are already at the first image."
  //         );
  //         return;
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Image not found!.");
  //     setImageNotFound(false);
  //   }
  // };

  const changeCurrentCsvDataHandler = (key, newValue) => {
    if (!imageNotFound) {
      return;
    }

    const csvDataKeys = Object.keys(headerData[0]);
    let matchedValue = null;

    for (const dataKey of csvDataKeys) {
      if (dataKey === key) {
        matchedValue = headerData[0][key];
        break;
      }
    }
    const matchedCoordinate = templateHeaders?.templetedata?.find(
      (data) => data.attribute === matchedValue
    );

    setCsvCurrentData((prevData) => {
      const previousValue = prevData[key];
      if (matchedCoordinate?.fieldType === "questionsField") {
        if (templateHeaders.isPermittedToEdit) {
          const validCharacters = templateHeaders?.typeOption?.split("-");
          newValue = newValue.trim();

          if (validCharacters.includes(newValue) || newValue === "") {
            setModifiedKeys((prevKeys) => ({
              ...prevKeys,
              [key]: [newValue, previousValue],
            }));

            return {
              ...prevData,
              [key]: newValue,
            };
          } else {
            return prevData;
          }
        } else {
          toast.warning("You do not have permission to edit this field.");

          return {
            ...prevData,
            [key]: previousValue,
          };
        }
      } else {
        const csvHeader = headerData[0];
        const formData = templateHeaders?.templetedata?.filter(
          (data) => data.fieldType === "formField"
        );

        const currentFormData = formData.find(
          (data) => data.attribute === csvHeader[key]
        );

        if (!currentFormData) {
          return prevData;
        }

        const { dataFieldType, fieldLength } = currentFormData;
        if (dataFieldType === "number") {
          if (!/^[0-9]+$/.test(newValue)) {
            return {
              ...prevData,
              [key]: newValue ? previousValue : "",
            };
          } else if (newValue.length > +fieldLength) {
            return {
              ...prevData,
              [key]: previousValue,
            };
          } else {
            setModifiedKeys((prevKeys) => ({
              ...prevKeys,
              [key]: [newValue, previousValue],
            }));

            return {
              ...prevData,
              [key]: newValue,
            };
          }
        } else if (dataFieldType === "text") {
          if (!/^[a-zA-Z]+$/.test(newValue)) {
            return {
              ...prevData,
              [key]: newValue ? previousValue : "",
            };
          } else if (newValue.length > +fieldLength) {
            return {
              ...prevData,
              [key]: previousValue,
            };
          } else {
            setModifiedKeys((prevKeys) => ({
              ...prevKeys,
              [key]: [newValue, previousValue],
            }));

            return {
              ...prevData,
              [key]: newValue,
            };
          }
        } else if (dataFieldType === "alphanumeric") {
          if (!/^[a-zA-Z0-9]+$/.test(newValue)) {
            return {
              ...prevData,
              [key]: newValue ? previousValue : "",
            };
          } else if (newValue.length > +fieldLength) {
            return {
              ...prevData,
              [key]: previousValue,
            };
          } else {
            setModifiedKeys((prevKeys) => ({
              ...prevKeys,
              [key]: [newValue, previousValue],
            }));

            return {
              ...prevData,
              [key]: newValue,
            };
          }
        }
        setModifiedKeys((prevKeys) => ({
          ...prevKeys,
          [key]: [newValue, previousValue],
        }));

        return {
          ...prevData,
          [key]: newValue,
        };
      }
    });
  };

  const imageFocusHandler = (headerName) => {
    let matchedValue = null;
    const data = JSON.parse(JSON.stringify(mappedData));
    const arrayOfObjects = Object.entries(data).map(([key, value]) => ({
      [key]: value,
    }));

    for (let i = 0; i < arrayOfObjects?.length; i++) {
      if (arrayOfObjects[i][headerName]) {
        matchedValue = arrayOfObjects[i][headerName];
        break;
      }
    }

    if (matchedValue === null) {
      toast.error("Header not found: " + headerName);
      return;
    }

    const matchedCoordinate = templateHeaders?.templetedata?.find(
      (data) => data.attribute === matchedValue
    );

    if (matchedCoordinate) {
      setCurrentImageIndex(matchedCoordinate.pageNo);
    }

    if (!imageNotFound) {
      return;
    }

    if (!imageUrls || !imageContainerRef || !imageRef) {
      setPopUp(true);
    }

    if (!filterResults.hasOwnProperty(headerName)) {
      toast.error("Header not found: " + headerName);
      return;
    }

    const { coordinateX, coordinateY, width, height } = matchedCoordinate;

    const containerWidth = imageContainerRef?.current?.offsetWidth;
    const containerHeight = imageContainerRef?.current?.offsetHeight;

    // Calculate the zoom level based on the container size and the selected area size
    const zoomLevel = Math.min(
      containerWidth / width,
      containerHeight / height
    );

    // Calculate the scroll position to center the selected area
    const scrollX =
      coordinateX * zoomLevel - containerWidth / 2 + (width / 2) * zoomLevel;
    const scrollY =
      coordinateY * zoomLevel - containerHeight / 2 + (height / 2) * zoomLevel;

    // Update the img element's style property to apply the zoom transformation
    imageRef.current.style.transform = `scale(${zoomLevel})`;
    imageRef.current.style.transformOrigin = `0 0`;

    // Scroll to the calculated position
    imageContainerRef.current.scrollTo({
      left: scrollX,
      top: scrollY,
      behavior: "smooth",
    });
    setSelectedCoordinates(true);
  };

  const onCompleteHandler = async () => {
    try {
      const response = await axios.get(
        `http://${REACT_APP_IP}:4000/download/correctedCsv/${taskId}`,
        {
          headers: {
            token: token,
          },
        }
      );

      await axios.post(
        `http://${REACT_APP_IP}:4000/taskupdation/${parseInt(
          currentTaskData?.id
        )}`,
        {
          taskStatus: true,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      setConfirmationModal(false);
      toast.success("task completed successfully.");
      navigate("/datamatching");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const zoomInHandler = () => {
    setZoomLevel((prevZoomLevel) => Math.min(prevZoomLevel * 1.1, 3));
  };

  const zoomOutHandler = () => {
    setZoomLevel((prevZoomLevel) => Math.max(prevZoomLevel * 0.9, 0.5));
  };

  const onInialImageHandler = () => {
    setZoomLevel(1);
    setSelectedCoordinates(false);
    if (imageRef.current) {
      imageRef.current.style.transform = "none";
      imageRef.current.style.transformOrigin = "initial";
    }
  };

  const compareHandler = () => {
    // onImageHandler("initial", currentIndex - 1, filteredArray, currentTaskData);
    setPopUp(false);
  };
  const modalClose = () => {
    setPopUp(false);
    navigate("/dataMatching");
  };
  const onTaskCompleteHandler = () => {
    setConfirmationModal(true);
  };
  const prevHandler = async () => {
    const response = await updateCurrIndexData(taskId, "prev");
    if (!response) {
      toast.error("Cannot go back. Already at the first index.");
      return;
    }
    setCurrIndex(response?.updatedIndex);
  };
  const nextHandler = async () => {
    const response = await updateCurrIndexData(taskId, "next");
    if (!response) {
      toast.error("Cannot proceed forward. Already at the last index.");
      return;
    }
    setCurrIndex(response?.updatedIndex);
  };
  return (
    <>
      {!popUp && (
        <div className=" flex flex-col lg:flex-row  bg-gradient-to-r from-blue-400 to-blue-500 dataEntry pt-16 2xl:pt-20 xl:h-screen">
          {/* LEFT SECTION */}
          {formData && (
            <CSVFormDataSection
              formCsvData={formData}

              // csvData={csvData}
              // filterResults={filterResults}
              // templateHeaders={templateHeaders}
              // imageColName={imageColName}
              // currentFocusIndex={currentFocusIndex}
              // inputRefs={inputRefs}
              // handleKeyDownJump={handleKeyDownJump}
              // changeCurrentCsvDataHandler={changeCurrentCsvDataHandler}
              // imageFocusHandler={imageFocusHandler}
            />
          )}

          {/* RIGHT SECTION */}
          <div className="w-full lg:w-[80%] xl:w-10/12 matchingMain">
            {!imageUrls?.length === 0 ? (
              <div className="flex justify-center items-center ">
                <div className="mt-10">
                  <ImageNotFound />

                  <h1 className="mt-8 text-2xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                    Please Select Image...
                  </h1>

                  <p className="mt-4 text-gray-100 text-center">
                    We can't find that page!!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-col">
                <ButtonCsvSection
                  currentIndex={currIndex}
                  csvData={csvData}
                  // correctionData={correctionData}
                  currentData={currentData}
                  max={maximum}
                  zoomInHandler={zoomInHandler}
                  onInialImageHandler={onInialImageHandler}
                  zoomOutHandler={zoomOutHandler}
                  currentImageIndex={currentImageIndex}
                  imageUrls={imageUrls}
                  totalData={totalData}
                />
                <div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div className="flex justify-center items-center">
                      <button
                        className="pl-4 pr-2 py-8 bg-blue-600 text-white rounded-3xl mx-2 hover:bg-blue-800"
                        onClick={prevHandler}
                      >
                        <ArrowBackIosIcon />
                      </button>
                    </div>
                    <div className="h-20vh">
                      <ImageSectionCSV
                        imageContainerRef={imageContainerRef}
                        currentImageIndex={currentImageIndex}
                        imageUrls={imageUrls}
                        imageRef={imageRef}
                        currentData={currentData}
                        zoomLevel={zoomLevel}
                        selectedCoordintes={selectedCoordintes}
                        templateHeaders={templateHeaders}
                      />
                    </div>
                    <div className="flex justify-center items-center">
                      <button
                        // disabled={loading}
                        className="pl-4 pr-2 py-8 bg-blue-600 text-white rounded-3xl mx-2 hover:bg-blue-800"
                        onClick={nextHandler}
                      >
                        <ArrowForwardIosIcon />
                      </button>
                    </div>
                  </div>

                  <section>
                    <div className=" flex justify-end mt-5 mr-5">
                      {Number(task.max) === currIndex && (
                        <div className="flex justify-center">
                          <button
                            onClick={() => onTaskCompleteHandler()}
                            className="px-4 py-2 bg-teal-600 mx-2 text-white rounded-3xl shadow hover:bg-teal-700"
                          >
                            Submit task
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => navigate("/datamatching")}
                        className=" px-6 py-2 bg-blue-600 text-white rounded-3xl mx-2 hover:bg-blue-700"
                      >
                        Back
                      </button>
                    </div>
                    <CorrectionField
                      // csvCurrentData={csvCurrentData} //whole row data
                      subData={subData} //error questions data
                      currentData={currentData} //error questions data
                      taskId={taskId}
                      nextHandler={nextHandler}
                      currIndex={currIndex}
                      // csvData={csvData}
                      // tableData={tableData}
                      // currentData={currentData}
                      // setCorrectionData={setCorrectionData}
                      // currentIndex={currentIndex} //error questions data
                      // setCurrentIndex={setCurrentIndex}
                      // maximum={maximum} //error questions data
                      // templateHeaders={templateHeaders} //template header already present
                      // imageColName={imageColName}
                      // currentFocusIndex={currentFocusIndex}
                      // inputRefs={inputRefs}
                      // handleKeyDownJump={handleKeyDownJump}
                      // onNextHandler={onNextHandler}
                      // changeCurrentCsvDataHandler={changeCurrentCsvDataHandler}
                      // imageFocusHandler={imageFocusHandler}
                    />
                  </section>
                </div>
              </div>
            )}
          </div>

          {/* CONFIRMATION MODAL */}
          <ConfirmationModal
            confirmationModal={confirmationModal}
            onSubmitHandler={onCompleteHandler}
            setConfirmationModal={setConfirmationModal}
            heading={"Confirm Task Completion"}
            message={
              "Please confirm if you would like to mark this task as complete."
            }
          />
        </div>
      )}
    </>
  );
};

export default UserCorrectionData;
