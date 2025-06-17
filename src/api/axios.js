import axios from "axios";

const api = axios.create({
  baseURL: "https://r6zsml2v4c.execute-api.ap-southeast-1.amazonaws.com/PRD",
  headers: {
    "Content-Type": "application/json",
  },
  // Uncomment and add token if required
  // headers: { "Authorization": `Bearer ${process.env.API_TOKEN}` },
});

export default api;