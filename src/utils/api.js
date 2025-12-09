import axios from "axios";

// Set your backend base URL (adjust if backend runs elsewhere)
const API = axios.create({
  baseURL: "http://localhost/chatapp/php/",
  withCredentials: true, // allows sessions/cookies if used
});

export default API;
