import React, { useState, useEffect } from "react";
import { MdOutlineRestartAlt } from "react-icons/md";
import { FaCloudDownloadAlt, FaRegEdit, FaChevronDown } from "react-icons/fa";
import { MdOutlineTaskAlt } from "react-icons/md";
import axios from "axios";
import {
  onGetAllUsersHandler,
  SERVER_IP,
  assignTasksToUsers,
} from "../../services/common";

const AdminMatchingTasks = ({
  onCompleteHandler,
  matchingTask,
  onDownloadHandler,
  onSelectedDownloadHandler,
  setTaskEdit,
  setTaskEditId,
  taskType,
  selectedDate,
  setMatchingTask,
  taskstatus,
  setdownloadBox,
  downloadBox,
}) => {
  const token = JSON.parse(localStorage.getItem("userData"));
  const [status, setstatus] = useState({});
  const [openBox, setOpenBox] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [allusers, setallusers] = useState([]);
  const [newTask, setnewTask] = useState([]);

  const toggleReassignBox = (taskId) => {
    setOpenBox(null);
    setActiveTaskId((prev) => (prev === taskId ? null : taskId));
    console.log(activeTaskId);
  };
  const toggleDownloadBox = (taskId) => {
    setdownloadBox((prev) => (prev === taskId ? null : taskId));
  };

  const toggleBox = (taskId) => {
    setActiveTaskId(null);
    setOpenBox(taskId);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await onGetAllUsersHandler();
        setallusers(response.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  console.log(allusers);

  const createNewTask = async (taskData, user) => {
    if (!user || !taskData) return;

    // build the payload expected by the backend (an array of tasks)
    const payload = [
      {
        fileId: taskData.fileId,
        templeteId: taskData.templeteId,
        userId: user.id ?? user._id ?? user.userId, // adjust according to user shape
        min: taskData.min,
        max: taskData.max,
        userName: user.userName || user.name,
        taskName: taskData.taskName,
        // any other required fields from your API
      },
    ];

    try {
      // call service directly with payload
      const response = await assignTasksToUsers(payload);
      console.log("assign response:", response);

      // optional: update UI — mark task as assigned or remove from list etc.
      // Example: close the assign box and clear active
      setOpenBox(null);
      setActiveTaskId(null);

      // optional: show toast or set status state
      // setstatus({ ...status, [taskData.id]: 'assigned' });

      // refresh tasks if backend returns updated data or call parent handler
      // e.g., fetch tasks again or update matchingTask state
    } catch (err) {
      console.error("assignTasksToUsers failed", err);
      // show user error toast or set state
    }
  };

  const completeHandler = async (taskId) => {
    const response = await axios.get(
      `${window.SERVER_IP}/submitTask/${taskId}`,
      {
        headers: {
          token: token,
        },
      }
    );
    setMatchingTask((prev) =>
      prev.map((task) => {
        if (task.id == taskId) {
          return { ...task, taskStatus: true };
        }
        return task;
      })
    );
  };
  const onFilteredTasksHandler = (tasks) => {
    console.log(tasks);
    let filterdTaskData = tasks;
    if (taskType !== "ALL") {
      if (taskType === "pending") {
        filterdTaskData = tasks?.filter((task) => task?.taskStatus === false);
      } else if (taskType === "completed") {
        filterdTaskData = tasks?.filter((task) => task?.taskStatus === true);
      }
    }

    if (selectedDate) {
      filterdTaskData = tasks.filter((item) => {
        const itemDate = new Date(item.createdAt).toLocaleDateString("en-GB");
        const selectedDateFormatted = new Date(selectedDate).toLocaleDateString(
          "en-GB"
        );
        return itemDate === selectedDateFormatted;
      });
    }
    return filterdTaskData;
  };

  const filteredTasks = onFilteredTasksHandler(matchingTask);

  console.log(filteredTasks);
  const gettask = async (data) => {
    //   console.log(data)
    onCompleteHandler(data);
    //  const response = await axios.get(`${window.SERVER_IP}/getassigntask/${data.id}`,
    //         {
    //           headers: {
    //             token: token,
    //           },
    //         })
    setActiveTaskId(null);
    console.log(matchingTask);
    setMatchingTask((prev) =>
      prev.map((task) =>
        task.id === data.id
          ? { ...task, taskStatus: false } // update only the matching one
          : task
      )
    );
    console.log(matchingTask);
    //  setstatus(response.data)
  };
  useEffect(() => {
    console.log("matchingTask updated:", matchingTask);
  }, [matchingTask]);

  console.log({ allusers: allusers, taskData: filteredTasks });

  return (
    <div>
      {filteredTasks?.map((taskData) => (
        <div key={taskData.id} className="flex  justify-center">
          <div className="whitespace-nowrap w-[100px] py-2">
            <div className="text-center text-md ">{taskData.templateName}</div>
          </div>
          <div className="whitespace-nowrap w-[100px] py-2">
            <div className="text-center text-md">{taskData.userName}</div>
          </div>
          <div className="whitespace-nowrap w-[100px] py-2">
            <div className="text-center text-md">{taskData.taskName}</div>
          </div>
          <div className="whitespace-nowrap w-[100px] py-2">
            <div className="text-md text-center">{taskData.min}</div>
          </div>
          <div className="whitespace-nowrap w-[100px] py-2">
            <div className="text-md text-center">{taskData.max}</div>
          </div>

          <div className="whitespace-nowrap w-[100px] py-2">
            <div className="text-md text-center border-2 ">
              {taskData.moduleType}
            </div>
          </div>
          <div className="whitespace-nowrap w-[100px] py-2">
            <div className="text-md text-center">
              <span
                className={`inline-flex items-center justify-center rounded-full ${
                  !taskData.taskStatus
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                } px-2.5 py-0.5`}
              >
                {!taskData.taskStatus && !status.taskStatus ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="-ms-1 me-1.5 h-4 w-4 ml-2"
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
                    className="-ms-1 me-1.5 h-4 w-4  ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </span>
              <button></button>
            </div>
          </div>
          <div className=" relative whitespace-nowrap text-center w-[100px] py-2">
            <button
              onClick={() => {
                // gettask(taskData);
                toggleReassignBox(taskData.id);
              }}
              className={`rounded-3xl px-4 py-1 font-semibold ${
                taskData.taskStatus
                  ? "bg-indigo-500 text-white border border-indigo-500"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }`}
              disabled={!taskData.taskStatus}
            >
              <MdOutlineRestartAlt />
            </button>
            {activeTaskId === taskData.id && (
              <div className="absolute  w-[200px] h-[200px] z-20 bg-white shadow-lg border border-gray-300 rounded-xl flex justify-center items-center flex-col gap-10">
                <div
                  className="inline-block px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold  rounded-full  shadow-md hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg active:scale-95 transition-all duration-300 ease-in-out cursor-pointer"
                  onClick={() => gettask(taskData)}
                >
                  Assign to same
                </div>
                <div
                  className="inline-block px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold  rounded-full  shadow-md hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg active:scale-95 transition-all duration-300 ease-in-out cursor-pointer"
                  onClick={() => toggleBox(taskData.id)}
                >
                  Assign to other
                </div>
              </div>
            )}
            {openBox === taskData.id && (
              <div className="absolute  w-[250px] h-[250px] z-20 bg-white shadow-lg border border-gray-300 rounded-xl flex justify-center items-center flex-col gap-10">
                <div className="overflow-y-auto h-[310px]">
                  {allusers?.map((user, i) => {
                    if (
                      user.role !== "Admin" &&
                      user.userName !== taskData.userName
                    ) {
                      return (
                        <label
                          key={user.id}
                          htmlFor={`userId-${user.id}`}
                          className="block w-full cursor-pointer"
                          onClick={() => createNewTask(taskData, user)}
                        >
                          <div
                            className="
      flex items-center justify-between 
      gap-3 mt-2 p-3
      rounded-xl border border-transparent
      bg-gradient-to-r from-blue-50 to-blue-100
      shadow-sm
      hover:from-blue-100 hover:to-blue-200
      hover:border-blue-400 hover:shadow-md
      transition-all duration-200 ease-in-out
      active:scale-[0.98]
    "
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="
          flex items-center justify-center 
          h-9 w-9 rounded-full 
          bg-blue-500 text-white font-semibold text-lg
          shadow-sm
        "
                              >
                                {user.userName?.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-gray-800 font-medium text-[15px] tracking-wide">
                                {user.userName}
                              </span>
                            </div>

                            <span
                              className="
        text-[12px] font-semibold
        px-2 py-[2px]
        rounded-full 
        bg-blue-200 text-blue-800
        uppercase tracking-wider
      "
                            >
                              {user.role}
                            </span>
                          </div>
                        </label>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              </div>
            )}
          </div>
          <div className=" relative whitespace-nowrap text-center w-[100px] py-2 ">
            <button
              type="button"
              onClick={() =>
                taskData.taskStatus && toggleDownloadBox(taskData.id)
              }
              className={`rounded-3xl px-4 py-1 font-semibold ${
                taskData.taskStatus
                  ? "bg-indigo-500 text-white border border-indigo-500"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }`}
              disabled={!taskData.taskStatus}
            >
              <FaCloudDownloadAlt />
              {/* <FaChevronDown className="text-xs" /> */}
            </button>

            {/* menu */}
            {downloadBox === taskData.id && (
              <div
                role="menu"
                aria-label="Download options"
                className="absolute mt-2 w-fit rounded-lg bg-white shadow-lg border ring-1 ring-black/5 z-[5000] max-h-[calc(100vh-100px)] "
              >
                <ul className="py-1">
                  <li>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onDownloadHandler(taskData);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      Download Combined CSV
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onSelectedDownloadHandler(taskData);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      Download Selected CSV
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div
            onClick={() => {
              setTaskEditId(taskData.id);
              setTaskEdit(true);
            }}
            className="whitespace-nowrap text-center w-[100px] py-2"
          >
            <button className="rounded border border-indigo-500 bg-indigo-500 px-4 py-1 font-semibold text-white">
              <FaRegEdit />
            </button>
          </div>
          <div
            onClick={() => completeHandler(taskData.id)}
            className="whitespace-nowrap text-center w-[100px] py-2"
          >
            <button className="rounded border border-indigo-500 bg-indigo-500 px-4 py-1 font-semibold text-white">
              <MdOutlineTaskAlt />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminMatchingTasks;
