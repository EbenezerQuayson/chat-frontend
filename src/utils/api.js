import axios from "axios";

// Set your backend base URL (adjust if backend runs elsewhere)
const API = axios.create({
  baseURL: "https://chatapp-backend.infinityfree.me/api",
  withCredentials: true, // allows sessions/cookies if used
});

export default API;
