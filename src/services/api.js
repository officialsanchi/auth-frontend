
import axios from "axios";

// ==========================================
// AUTH API
// ==========================================
const API = axios.create({
    baseURL: "http://localhost:8080/v1/auth",
    headers: {
        "Content-Type": "application/json",
    },
});

// ==========================================
// USER API
// ==========================================
const USER_API = axios.create({
    baseURL: "http://localhost:8080/v1/users",
    headers: {
        "Content-Type": "application/json",
    },
});

// ==========================================
// ADD JWT TOKEN TO AUTH REQUESTS
// ==========================================
const addToken = (config) => {
    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
};

API.interceptors.request.use(
    addToken,
    (error) => Promise.reject(error)
);

USER_API.interceptors.request.use(
    addToken,
    (error) => Promise.reject(error)
);

// ==========================================
// AUTH ENDPOINTS
// ==========================================

export const register = (data) =>
    API.post("/register", data);

export const login = (data) =>
    API.post("/login", data);

export const forgotPassword = (email) =>
    API.post("/forgot-password", {
        email,
    });

export const verifyOtp = (data) =>
    API.post("/verify-otp", data);

export const verifyResetOtp = (data) =>
    API.post("/verify-reset-otp", data);

// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPassword = (data) =>
    API.post("/reset-password", {
        email: data.email,
        otp: data.otp,
        newPassword: data.password,
    });

// ==========================================
// USER ENDPOINTS
// ==========================================

export const getCurrentUser = () =>
    USER_API.get("/me");

export default API;

