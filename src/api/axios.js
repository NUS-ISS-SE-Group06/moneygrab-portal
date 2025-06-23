import axios from "axios";

const getBaseUrl = () => {
  const isLocal = process.env.NODE_ENV === "development";
  return isLocal
    ? "http://localhost:8688"
    : "https://r6zsml2v4c.execute-api.ap-southeast-1.amazonaws.com/PRD";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  // Uncomment and add token if required
  // headers: { "Authorization": `Bearer ${process.env.API_TOKEN}` },
});

export default api;
