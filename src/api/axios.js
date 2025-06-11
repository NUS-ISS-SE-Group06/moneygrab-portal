import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8688',
  // …any other defaults you need
});

export default api;
