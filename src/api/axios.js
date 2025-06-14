import axios from "axios";

const api = axios.create({
  /*
  In your local development environment, you can use the following base URL:
  */
  /*baseURL: 'http://localhost:8688'*/

  /*
  In production, you can use the following base URL:
  */
  baseURL: 'https://r6zsml2v4c.execute-api.ap-southeast-1.amazonaws.com/PRD' // Replace with your actual API base URL
});

export default api;
