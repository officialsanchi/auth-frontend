
import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./auth/ForgotPassword";
import VerifyOtp from "./auth/VerifyOtp";
import ResetPassword from "./auth/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Profile from "./components/Profile";

function App() {
    return (
        <Routes>

            {/* ================================
                DEFAULT ROUTE
            ================================= */}
            <Route
                path="/"
                element={<Navigate to="/register" replace />}
            />

            {/* ================================
                AUTHENTICATION
            ================================= */}

            {/* Registration */}
            <Route
                path="/register"
                element={<Register />}
            />

            {/* OTP Verification */}
            <Route
                path="/verify-otp"
                element={<VerifyOtp />}
            />

            {/* Keep this only if some old code still uses /verify-email */}
            <Route
                path="/verify-email"
                element={<Navigate to="/verify-otp" replace />}
            />

            {/* Login */}
            <Route
                path="/login"
                element={<Login />}
            />

            {/* Forgot Password */}
            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            {/* Reset Password */}
            <Route
                path="/reset-password"
                element={<ResetPassword />}
            />

            {/* ================================
                USER AREA
            ================================= */}
<Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/profile"
    element={
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    }
/>

            {/* ================================
                UNKNOWN URL
            ================================= */}

            <Route
                path="*"
                element={<Navigate to="/register" replace />}
            />

        </Routes>
    );
}

export default App;

