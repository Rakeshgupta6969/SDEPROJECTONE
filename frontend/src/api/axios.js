import axios from "axios";

const api = axios.create({
  baseURL: "/api", // proxy handles backend routing
});

export default api;
