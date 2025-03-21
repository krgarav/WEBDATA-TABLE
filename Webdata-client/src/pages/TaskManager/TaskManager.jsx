import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import dataContext from "../../Store/DataContext";
import {
  assignTasksToUsers,
  getTotalCSVData,
  onGetAllUsersHandler,
  onGetVerifiedUserHandler,
} from "../../services/common";

import axios from "axios";
import AssigningTask from "./AssigningTask";
import AssignedTaskReview from "./AssignedTaskReview";

const TemplateMapping = () => {
  const [showModal, setShowModal] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [taskName, setTaskName] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [taskValue, setTaskValue] = useState({ min: 1, max: null });
  const dataCtx = useContext(dataContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const { fileId } = JSON.parse(localStorage.getItem("fileId")) || "";
  const token = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await onGetAllUsersHandler();
        setAllUsers(response.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [selectedUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await onGetVerifiedUserHandler();
        setCurrentUser(response.user);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [selectedUser]);

  const [totalData, setTotalData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("fileId"));
    async function fetchData() {
      const response = await getTotalCSVData(data.templeteId,data.fileId);
      setTotalData(response.totalRows);
    }
    fetchData();
  }, []);

  const onTaskAssignedHandler = () => {
    if (Number(taskValue.max) > totalData) {
      toast.warning("Max value must be less than or equal to the total data.");
      return;
    }

    if (
      !taskValue.max ||
      taskValue.max <= 0 ||
      taskValue.max <= taskValue.min
    ) {
      toast.warning("Please check your input values.");
      return;
    }

    if (!fileId) {
      toast.warning("File Id not present!");
      return;
    }

    if (!taskName) {
      toast.warning("Please enter the task name first.");
      return;
    }

    if (selectedUser.length <= 0 || selectedUser.length > 1) {
      toast.warning("Please select the file id or username!");
      return;
    }

    const newAssignedTasks = selectedUser.map((data) => {
      const task = {
        fileId: fileId,
        templeteId: id,
        userId: data.userId,
        min: taskValue.min,
        max: taskValue.max,
        userName: data.userName,
        taskName: taskName,
      };
      return task;
    });
    setAssignedUsers([...assignedUsers, ...newAssignedTasks]);

    let newMinValue = parseInt(taskValue.max) + 1;
    if (isNaN(newMinValue)) {
      newMinValue = taskValue.min;
    }

    if (taskValue.max == totalData) {
      setShowModal(true);
    }
    setTaskValue({ ...taskValue, min: newMinValue, max: "" });
    toast.success("Task successfully assigned. Thank you.");
  };

  const onTaskSubmitHandler = async () => {
    if (taskValue.min - 1 !== totalData) {
      toast.warning("Please assign all the data.");
      return;
    }

    try {
      const response = await assignTasksToUsers(assignedUsers);
      if (response.success) {
        toast.success("Task assignment successful.");
        dataCtx.modifyIsLoading(false);
        navigate(`/csvuploader`, { replace: true });
      } else {
        toast.error("Something Went Wrong! Cannot Assign Tasks to Users!!!");
      }
    } catch (error) {
      console.error("Error uploading files: ", error);
      toast.error("Error submitting task. Please try again.");
    }
  };

  return (
    <div className=" min-h-[100vh] flex justify-center items-center pt-20 templatemapping bg-gradient-to-r from-blue-400 to-blue-600">
      <div className=" w-full">
        {/* MAIN SECTION  */}
        <section className="mx-auto max-w-[90%] xl:max-w-6xl  px-12 py-4 bg-white rounded-xl">
          <AssigningTask
            allUsers={allUsers}
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
            taskValue={taskValue}
            setTaskValue={setTaskValue}
            onTaskAssignedHandler={onTaskAssignedHandler}
            totalData={totalData}
            setTaskName={setTaskName}
            taskName={taskName}
          />
          {/* MODEL SECTION  */}
          <AssignedTaskReview
            setShowModal={setShowModal}
            showModal={showModal}
            onTaskSubmitHandler={onTaskSubmitHandler}
            assignedUsers={assignedUsers}
          />
        </section>
      </div>
    </div>
  );
};
export default TemplateMapping;
