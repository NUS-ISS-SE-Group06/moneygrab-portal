import axios from "axios";

const api = axios.create({
  baseURL: "https://r6zsml2v4c.execute-api.ap-southeast-1.amazonaws.com/PRD",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const idToken = localStorage.getItem("idToken");
  const accessToken = localStorage.getItem("accessToken");

  if (idToken) config.headers["X-ID-Token"] = idToken;
  if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;

  return config;
});

export default api;
