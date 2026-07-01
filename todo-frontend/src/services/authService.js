import axios from "axios";

const API_URL = "http://localhost:8080/auth";

export const registerUser = (user) => {
  return axios.post(`${API_URL}/register`, user);
};

export const loginUser = (credentials) => {
  return axios.post(`${API_URL}/login`, credentials);
};

export const sendOtp = (email) => {
  return axios.post(`${API_URL}/send-otp`, {
    email,
  });
};

export const verifyOtp = (
  email,
  otp,
  password
) => {
  return axios.post(`${API_URL}/verify-otp`, {
    email,
    otp,
    password,
  });
};
export const getProfile = (email) =>
  axios.get(
    `${API_URL}/profile/${email}`
  );

export const updateProfile = (profile) =>
  axios.put(
    `${API_URL}/profile`,
    profile
  );

export const changePassword = (
  data
) =>
  axios.put(
    `${API_URL}/change-password`,
    data
  );