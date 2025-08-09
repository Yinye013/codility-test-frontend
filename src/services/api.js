import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// I used separation of concerns here to separate the authentication-related API calls
export const authAPI = {
  register: (userData) => API.post("/api/auth/register", userData),
  login: (credentials) => API.post("/api/auth/login", credentials),
  getCurrentUser: () => API.get("/api/auth/currentUser"),
};

// Here I put the purchase-related API calls
export const purchaseAPI = {
  purchaseAirtime: (purchaseData) =>
    API.post("/api/purchase/airtime", purchaseData),
  getWallet: () => API.get("/api/purchase/wallet"),
  getTransactions: (page = 1, limit = 10) =>
    API.get(`/api/purchase/transactions?page=${page}&limit=${limit}`),
  addFunds: (amount) => API.post("/api/purchase/add-funds", { amount }),
};

export default API;
