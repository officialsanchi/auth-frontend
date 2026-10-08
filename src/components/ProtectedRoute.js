import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const location = useLocation();

    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    // User is not authenticated
    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // User is authenticated
    return children;
};

export default ProtectedRoute;