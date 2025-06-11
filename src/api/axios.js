// src/api/axios.js
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:8688',
  // …any other defaults you need
});

module.exports = api;
