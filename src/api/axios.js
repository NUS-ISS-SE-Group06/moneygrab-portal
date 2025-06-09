import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8688",
  // You can also add default headers, auth tokens, etc.
});

export default api;
