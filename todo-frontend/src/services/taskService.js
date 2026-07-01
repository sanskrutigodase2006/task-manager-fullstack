import axios from "axios";

const API_URL = "http://localhost:8080/api/tasks";

const getAuthConfig = () => {

  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getAllTasks = () =>
  axios.get(API_URL, getAuthConfig());

export const createTask = (task) =>
  axios.post(API_URL, task, getAuthConfig());

export const deleteTask = (id) =>
  axios.delete(`${API_URL}/${id}`, getAuthConfig());

export const updateTask = (id, task) =>
  axios.put(`${API_URL}/${id}`, task, getAuthConfig());