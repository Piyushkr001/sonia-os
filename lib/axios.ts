import axios from "axios";

const api = axios.create({
  baseURL: "/api",

  timeout: 55000,

  headers: {
    "Content-Type": "application/json",
  },
});

export default api;