import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const API = axios.create({
    baseURL: `${BASE_URL}/auth`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

const USER_API = axios.create({
    baseURL: `${BASE_URL}/users`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// =========================================================
// REQUEST INTERCEPTOR: Attach Authorization Bearer Token
// =========================================================
const attachTokenInterceptor = (config) => {
    const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token && token !== "undefined" && token !== "null") {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
};

// Attach interceptor to both instances
API.interceptors.request.use(attachTokenInterceptor, (error) =>
    Promise.reject(error)
);
USER_API.interceptors.request.use(attachTokenInterceptor, (error) =>
    Promise.reject(error)
);

// Register
export const register = (data) => API.post("/register", data);

// Log in
export const login = (data) => API.post("/login", data);

// Request password-reset OTP
export const forgotPassword = (email) =>
    API.post("/forgot-password", { email });

// Verify OTP
export const verifyOtp = (data) => API.post("/verify-otp", data);

// Verify password-reset OTP
export const verifyResetOtp = (data) => API.post("/verify-reset-otp", data);

// Reset password
export const resetPassword = (data) =>
    API.post("/reset-password", {
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword ?? data.password,
    });

// Get current user
export const getCurrentUser = () => USER_API.get("/me");

// Logout
export const logout = () => API.post("/logout");

export default API;