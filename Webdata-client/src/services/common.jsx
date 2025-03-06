import axios from "axios";
import { toast } from "react-toastify";
function extractIP(serverString) {
  const match = serverString.match(/(\d+\.\d+\.\d+\.\d+)/);
  return match ? match[0] : null;
}
export const REACT_APP_IP = window.location.hostname;
export const SERVER_IP = window.SERVER_IP;

export const onGetTemplateHandler = async () => {
  const token = JSON.parse(localStorage.getItem("userData"));
  try {
    const response = await axios.post(
      `${window.SERVER_IP}/get/templetes`,
      {},
      {
        headers: {
          token: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const onGetAllUsersHandler = async () => {
  const token = JSON.parse(localStorage.getItem("userData"));

  try {
    const response = await axios.post(
      `${window.SERVER_IP}/users/getallusers`,
      {},
      {
        headers: {
          token: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const onGetVerifiedUserHandler = async () => {
  const token = JSON.parse(localStorage.getItem("userData"));
  if (!token) {
    return;
  }
  try {
    const response = await axios.post(
      `${window.SERVER_IP}/users/getuser`,
      {},
      {
        headers: {
          token: token,
        },
      }
    );

    return response.data;
  } catch (error) {}
};

export const onGetAllTasksHandler = async () => {
  const token = JSON.parse(localStorage.getItem("userData"));

  try {
    const response = await axios.get(`${window.SERVER_IP}/get/alltasks`, {
      headers: {
        token: token,
      },
    });
    return response.data;
  } catch (error) {
    // toast.error(error.message);
  }
};

export const onGetTaskHandler = async (id) => {
  const token = JSON.parse(localStorage.getItem("userData"));
  try {
    const response = await axios.get(`${window.SERVER_IP}/get/task/${id}`, {
      headers: {
        token: token,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const fetchFilesAssociatedWithTemplate = async (templateId) => {
  const token = JSON.parse(localStorage.getItem("userData"));

  try {
    const response = await axios.post(
      `http://${window.APP_IP}:4000/getUploadedFiles/${templateId}`,
      {
        headers: {
          token: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchLatestTaskData = async (taskId) => {
  const token = JSON.parse(localStorage.getItem("userData"));

  const response = await axios.get(
    `http://${window.APP_IP}:4000/getTask/${taskId}`,
    { headers: { token } }
  );
  return response.data; // Return latest task data
};
export const fetchTemplateFormData = async (templateId, colName) => {
  const token = JSON.parse(localStorage.getItem("userData"));
  const obj = { templateId, colName };
  const response = await axios.post(
    `http://${window.APP_IP}:4000/formfileddetails/`,
    obj,
    { headers: { token } }
  );
  return response.data; // Return latest task data
};

export const fetchIP = async () => {
  const token = JSON.parse(localStorage.getItem("userData"));

  const response = await axios.get(
    `http://${window.APP_IP}:4000/settings/get-device-ip`,
    { headers: { token } }
  );
  return response.data;
};

