import axios from "axios";

export const BASE_URL = "http://localhost:8080";

export const myAxios = axios.create({
    baseURL:BASE_URL,
});

export const config ={
    serverUrl : 'http://localhost:8080'
}

myAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // storing token in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

myAxios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized — redirect to login
      window.location.href = "/log"; // or navigate('/log') inside a React component
    }
    return Promise.reject(error);
  }
);