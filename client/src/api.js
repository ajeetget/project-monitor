import axios from "axios";



// Safely extract API URL across Vite, Create React App, and local fallback
const getBaseUrl = () => {
  // Vite environment variable
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Create React App / Webpack environment variable
  if (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // Default local Express backend URL
  return "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request Interceptor: Logs outgoing requests in browser console (F12)
api.interceptors.request.use(
  (config) => {    
    return config;
  },
  (error) => {
    console.error("❌ [Axios Request Error]:", error);
    return Promise.reject(error);
  },
);

// Response Interceptor: Logs responses and formats backend errors
api.interceptors.response.use(
  (response) => {
       return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        `❌ [Axios Response Error] Status ${error.response.status}:`,
        error.response.data,
      );
    } else if (error.request) {
      console.error(
        "❌ [Axios Network Error] No response received from server. Is Express running on port 5000?",
        error.request,
      );
    } else {
      console.error("❌ [Axios Setup Error]:", error.message);
    }
    return Promise.reject(error);
  },
);

// Projects API Services
export const ProjectsAPI = {
  list: (params) => api.get("/projects", { params }).then((r) => r.data),

  get: (id) => api.get(`/projects/${id}`).then((r) => r.data),

  create: (data) => api.post("/projects", data).then((r) => r.data),

  update: (id, data) => api.put(`/projects/${id}`, data).then((r) => r.data),

  remove: (id) => api.delete(`/projects/${id}`).then((r) => r.data),

  clearAll: () => api.delete("/projects").then((r) => r.data),

  removeDuplicates: () =>
    api.post("/projects/remove-duplicates").then((r) => r.data),

  import: (mode, rows) =>
    api.post("/projects/import", { mode, rows }).then((r) => r.data),

  exportBackup: () => api.get("/projects/export").then((r) => r.data),

  restoreBackup: (projects) =>
    api.post("/projects/restore", { projects }).then((r) => r.data),
};

export const SettingsAPI = {
  getVerticals: () =>
    api.get("/verticals").then((r) => r.data),

  saveVerticals: (verticals) =>
    api.put("/verticals", { verticals }).then((r) => r.data),
};

export default api;
