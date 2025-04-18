import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import {
  onGetTaskHandler,
  onGetTemplateHandler,
  onGetVerifiedUserHandler,
  REACT_APP_IP,
} from "../../services/common";
import { useNavigate } from "react-router-dom";

const UserTaskAssined = () => {
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [taskType, setTaskType] = useState("ALL");
  const [compareTask, setCompareTask] = useState([]);
  const [currentTaskData, setCurrentTaskData] = useState({});
  const [os, setOs] = useState("Unknown OS");
  const [userRole, setUserRole] = useState();
  const navigate = useNavigate();



  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const verifiedUser = await onGetVerifiedUserHandler();
        console.log(verifiedUser)
        setUserRole(verifiedUser.user.role);
        const tasks = await onGetTaskHandler(verifiedUser.user.id);
        console.log(tasks)
        const templateData = await onGetTemplateHandler();
        const uploadTask = tasks.filter((task) => {
          return task.moduleType === "Data Entry";
        });
        const comTask = tasks.filter((task) => {
          return task.moduleType === "CSV Compare";
        });

        const updatedCompareTasks = comTask.map((task) => {
          const matchedTemplate = templateData.find(
            (template) => template.id === parseInt(task.templeteId)
          );
          if (matchedTemplate) {
            return {
              ...task,
              templateName: matchedTemplate.name,
            };
          }
          return task;
        });
        const updatedTasks = uploadTask.map((task) => {
          const matchedTemplate = templateData.find(
            (template) => template.id === parseInt(task.templeteId)
          );
          if (matchedTemplate) {
            return {
              ...task,
              templateName: matchedTemplate.name,
            };
          }
          return task;
        });
        setAllTasks(updatedTasks);
        setCompareTask(updatedCompareTasks);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCurrentUser();
  }, []);


  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    if (platform.includes("Win")) {
      setOs("Windows");
    } else if (platform.includes("Mac")) {
      setOs("macOS");
    } else if (userAgent.includes("Ubuntu")) {
      setOs("Ubuntu");
    } else if (platform.includes("Linux") || userAgent.includes("Linux")) {
      setOs("Linux");
    } else if (/Android/.test(userAgent)) {
      setOs("Android");
    } else if (/iPhone|iPad|iPod/.test(userAgent)) {
      setOs("iOS");
    }
  }, []);


  const handleStartClick = (taskData) => {
    if (taskData?.taskStatus) {
      toast.warning("Task is already completed.");
      return;
    }

    if (taskData.moduleType === "Data Entry") {
      localStorage.setItem("taskdata", JSON.stringify(taskData));
      navigate(`/datamatching/${taskData.id}`, { state: taskData });
    }
  };

  const onCompareTaskStartHandler = (taskdata) => {
    if (taskdata.taskStatus) {
      toast.warning("Task already completed");
      return
    }
    localStorage.setItem("taskdata", JSON.stringify(taskdata));
    navigate("/datamatching/correct_compare_csv", { state: taskdata });
  };


  const onTaskStartHandler = async (taskData) => {
    try {
      const response = await axios.post(
        `${window.SERVER_IP}/get/csvdata`,
        { taskData: taskData },
        {
          headers: {
            token: token,
          },
        }
      );

      if (response.data.length === 1) {
        toast.warning("No matching data was found.");
        return;
      }

      setCsvData(response.data);
      let matchingIndex;
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i]["rowIndex"] == taskData.currentIndex) {
          matchingIndex = i;
          break;
        }
      }

      if (matchingIndex === undefined || matchingIndex === 0) {
        matchingIndex = 1;
      }
      setCurrentIndex(matchingIndex);
      onImageHandler("initial", matchingIndex, response.data, taskData);
      setPopUp(false);
    } catch (error) {
      setConfirmationModal(true);
      toast.error(error?.response?.data?.error);
    }
  };


  const filteredTasks =
    taskType === "ALL"
      ? allTasks
      : taskType === "pending"
        ? allTasks?.filter((task) => task?.taskStatus === false)
        : taskType === "completed"
          ? allTasks?.filter((task) => task?.taskStatus === true)
          : allTasks;



  return (
    <div className="h-[100vh] flex justify-center bg-gradient-to-r from-blue-400 to-blue-600 items-center templatemapping">
      <div className="">
        {/* MAIN SECTION  */}
        <section className="mx-auto max-w-5xl  px-10 py-10 bg-white rounded-xl w-[100vw]">
          <div className="flex flex-col space-y-4  md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h2 className="text-3xl font-semibold">Assigned Tasks</h2>
            </div>
          </div>
          <div className="hidden sm:block mt-4">
            <nav className="flex gap-6" aria-label="Tabs">
              <button
                onClick={() => setTaskType("All")}
                className={`shrink-0 rounded-lg p-2 text-sm border-2  font-medium ${taskType === "All" && "bg-sky-100 text-sky-600"
                  } hover:bg-sky-100 hover:text-gray-700`}
              >
                ALL TASKS
              </button>

              <button
                onClick={() => setTaskType("completed")}
                className={`shrink-0 rounded-lg p-2 text-sm border-2  font-medium ${taskType === "completed" && "bg-sky-100 text-sky-600"
                  } hover:bg-sky-100 hover:text-gray-700`}
              >
                COMPLETED
              </button>

              <button
                onClick={() => setTaskType("pending")}
                className={`shrink-0 border-2  rounded-lg ${taskType === "pending" && "bg-sky-100 text-sky-600"
                  } p-2 text-sm font-medium hover:bg-sky-100`}
                aria-current="page"
              >
                PENDING
              </button>
            </nav>
          </div>
          <div className="mt-6 flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block  py-2 align-middle md:px-6 ">
                <div className=" border border-gray-200 md:rounded-lg">
                  <div className="divide-y divide-gray-200 ">
                    <div className="bg-gray-50 w-full">
                      <div className="flex">
                        <div className=" py-3.5 px-4 text-center text-xl font-semibold text-gray-700 w-[150px]">
                          <span>Templates</span>
                        </div>
                        <div className=" py-3.5 px-4 text-center text-xl font-semibold text-gray-700 w-[150px]">
                          <span>Task Name</span>
                        </div>
                        <div className=" py-3.5 px-4 text-center  text-xl font-semibold text-gray-700 w-[100px]">
                          Min
                        </div>

                        <div className=" py-3.5 px-4 text-center text-xl font-semibold text-gray-700 w-[100px]">
                          Max
                        </div>
                        <div className=" py-3.5 px-4 text-center text-xl font-semibold text-gray-700 w-[150px]">
                          Module
                        </div>
                        <div className=" py-3.5 px-4 text-center text-xl font-semibold text-gray-700 w-[150px]">
                          Status
                        </div>
                        <div className=" px-4 py-3.5 text-center text-xl font-semibold text-gray-700 w-[150px]">
                          Start Task
                        </div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200 bg-white overflow-y-auto max-h-[300px]">
                      {filteredTasks?.map((taskData) => (
                        <>
                          <div key={taskData.id} className="flex  py-2 w-full">
                            <div className="whitespace-nowrap w-[150px] px-4">
                              <div className="text-md text-center">
                                {taskData.templateName}
                              </div>
                            </div>

                            <div className="whitespace-nowrap w-[150px] px-4">
                              <div className="text-md text-center">
                                {taskData.taskName}
                              </div>
                            </div>
                            <div className="whitespace-nowrap w-[100px] px-4">
                              <div className="text-md text-center">
                                {taskData.min}
                              </div>
                            </div>
                            <div className="whitespace-nowrap w-[100px] px-4">
                              <div className="text-md text-center">
                                {taskData.max}
                              </div>
                            </div>

                            <div className="whitespace-nowrap w-[150px] px-4">
                              <div className="text-md text-center font-semibold py-1 border-2">
                                {taskData.moduleType}
                              </div>
                            </div>

                            <div className="whitespace-nowrap w-[150px] px-4">
                              <div className="text-md text-center">
                                <span
                                  className={`inline-flex items-center justify-center rounded-full ${!taskData.taskStatus
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-emerald-100 text-emerald-700"
                                    } px-2.5 py-0.5 `}
                                >
                                  {!taskData.taskStatus ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth="1.5"
                                      stroke="currentColor"
                                      className="-ms-1 me-1.5 h-4 w-4"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth="1.5"
                                      stroke="currentColor"
                                      className="-ms-1 me-1.5 h-4 w-4"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  )}
                                  <p className="whitespace-nowrap text-sm">
                                    {taskData.taskStatus
                                      ? "Completed"
                                      : "Pending"}
                                  </p>
                                </span>
                              </div>
                            </div>
                            <div
                              className="whitespace-nowrap text-center w-[150px] px-4"
                              key={taskData.id}
                            >
                              <button
                                onClick={() => handleStartClick(taskData)}
                                type="button"
                                disabled={loadingTaskId === taskData.id}
                                className={`relative rounded-3xl border border-indigo-500 bg-indigo-500 px-6 py-1 font-semibold text-white ${loadingTaskId === taskData.id
                                  ? "opacity-50 cursor-not-allowed"
                                  : taskData.taskStatus
                                    ? "before:content-[''] before:absolute before:inset-0 before:bg-white before:opacity-20 before:blur-sm"
                                    : ""
                                  }`}
                              >
                                {loadingTaskId === taskData.id ? (
                                  <div className="flex items-center justify-center">
                                    <span className="mr-2">Loading...</span>
                                    <div className="animate-spin rounded-full border-b-2 border-white"></div>
                                  </div>
                                ) : (
                                  "Start"
                                )}
                              </button>
                            </div>
                          </div>
                        </>
                      ))}
                     
                      {compareTask?.map((taskData) => (

                        <>
                          <div key={taskData.id} className="flex  py-2 w-full">
                            <div className="whitespace-nowrap w-[150px] px-4">
                              <div className="text-md text-center">
                                {taskData.templateName}
                              </div>
                            </div>

                            <div className="whitespace-nowrap w-[150px] px-4">
                              <div className="text-md text-center">
                                {taskData.taskName}
                              </div>
                            </div>
                            <div className="whitespace-nowrap w-[100px] px-4">
                              <div className="text-md text-center">
                                {taskData.min}
                              </div>
                            </div>
                            <div className="whitespace-nowrap w-[100px] px-4">
                              <div className="text-md text-center">
                                {taskData.max}
                              </div>
                            </div>

                            <div className="whitespace-nowrap w-[150px] px-4">
                              <div className="text-md text-center font-semibold py-1 border-2">
                                {taskData.moduleType}
                              </div>
                            </div>

                            <div className="whitespace-nowrap w-[150px] px-4">
                              <div className="text-md text-center">
                                <span
                                  className={`inline-flex items-center justify-center rounded-full ${!taskData.taskStatus
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-emerald-100 text-emerald-700"
                                    } px-2.5 py-0.5 `}
                                >
                                  {!taskData.taskStatus ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth="1.5"
                                      stroke="currentColor"
                                      className="-ms-1 me-1.5 h-4 w-4"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth="1.5"
                                      stroke="currentColor"
                                      className="-ms-1 me-1.5 h-4 w-4"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  )}
                                  <p className="whitespace-nowrap text-sm">
                                    {taskData.taskStatus
                                      ? "Completed"
                                      : "Pending"}
                                  </p>
                                </span>
                              </div>
                            </div>
                            <div
                              className="whitespace-nowrap text-center w-[150px] px-4"
                              key={taskData.id}
                            >
                              <button
                                onClick={() =>
                                  onCompareTaskStartHandler(taskData)
                                }
                                type="button"
                                // disabled
                                disabled={loadingTaskId === taskData.id}
                                className={`relative rounded-3xl border border-indigo-500 bg-indigo-500 px-6 py-1 font-semibold text-white ${loadingTaskId === taskData.id
                                  ? "opacity-50 cursor-not-allowed"
                                  : taskData.taskStatus
                                    ? "before:content-[''] before:absolute before:inset-0 before:bg-white before:opacity-20 before:blur-sm"
                                    : ""
                                  }`}
                              >
                                {loadingTaskId === taskData.id ? (
                                  <div className="flex items-center justify-center">
                                    <span className="mr-2">Loading...</span>
                                    <div className="animate-spin rounded-full border-b-2 border-white"></div>
                                  </div>
                                ) : (
                                  "Start"
                                )}
                              </button>
                            </div>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserTaskAssined;
