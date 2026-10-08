
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthInput from "../components/AuthInput";
import { validatePassword } from "../utils/validation";
import { login } from "../services/api";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // ==========================================
    // VALIDATE EMAIL OR USERNAME
    // ==========================================
    const validateIdentifier = (value) => {
        const identifier = value.trim();

        if (!identifier) {
            return "Email or username is required.";
        }

        if (identifier.length < 3) {
            return "Enter a valid email or username.";
        }

        return "";
    };

    // ==========================================
    // VALIDATE FORM
    // ==========================================
    const validateForm = () => {
        const newErrors = {};

        const identifierError = validateIdentifier(
            formData.identifier
        );

        const passwordError = validatePassword(
            formData.password
        );

        if (identifierError) {
            newErrors.identifier = identifierError;
        }

        if (passwordError) {
            newErrors.password = passwordError;
        }

        return newErrors;
    };

    // ==========================================
    // HANDLE INPUT CHANGES
    // ==========================================
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((previous) => ({
                ...previous,
                [name]: "",
            }));
        }

        if (formError) {
            setFormError("");
        }
    };

    // ==========================================
    // VALIDATE INDIVIDUAL FIELD
    // ==========================================
    const handleBlur = (event) => {
        const { name, value } = event.target;

        let error = "";

        if (name === "identifier") {
            error = validateIdentifier(value);
        }

        if (name === "password") {
            error = validatePassword(value);
        }

        if (error) {
            setErrors((previous) => ({
                ...previous,
                [name]: error,
            }));
        }
    };

    // ==========================================
    // BACKEND ERROR MESSAGE
    // ==========================================
    const getErrorMessage = (error) => {
        if (error?.response?.data?.message) {
            return error.response.data.message;
        }

        if (error?.response?.data?.error) {
            return error.response.data.error;
        }

        if (error?.response?.status === 400) {
            return "Invalid login request. Please check your details.";
        }

        if (error?.response?.status === 401) {
            return "Invalid email/username or password.";
        }

        if (error?.response?.status === 403) {
            return "Your account is not authorized to sign in.";
        }

        if (error?.response?.status === 404) {
            return "Authentication service could not be found.";
        }

        if (error?.response?.status >= 500) {
            return "Something went wrong on the server. Please try again.";
        }

        if (error?.code === "ERR_NETWORK") {
            return "Unable to connect to the authentication server.";
        }

        return "Unable to sign in. Please check your credentials and try again.";
    };

    // ==========================================
    // SUBMIT LOGIN FORM
    // ==========================================
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isLoading) {
            return;
        }

        setFormError("");

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const loginPayload = {
            identifier: formData.identifier.trim(),
            password: formData.password,
        };

        setIsLoading(true);

        try {
            console.log("Sending login request:", {
                identifier: loginPayload.identifier,
                password: "********",
            });

            const response = await login(loginPayload);

            console.log("Login successful:", response.data);

            /*
             * Authentication is NOT stored in localStorage
             * or sessionStorage.
             *
             * The backend is responsible for maintaining
             * the authenticated session/cookie.
             *
             * Axios uses withCredentials: true in api.js
             * so browser cookies can be sent with requests.
             */

            navigate("/dashboard", {
                replace: true,
            });

        } catch (error) {
            console.error("Login error:", error);

            setFormError(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-shell">

                {/* LEFT BRAND PANEL */}
                <div className="auth-brand-panel">

                    <div className="brand-content">

                        <div className="brand-logo">
                            <span>A</span>
                        </div>

                        <p className="brand-kicker">
                            SECURE ACCESS
                        </p>

                        <h1>
                            One secure place
                            <br />
                            for your account.
                        </h1>

                        <p className="brand-description">
                            A modern authentication
                            experience designed for
                            secure and seamless access
                            to your application.
                        </p>

                        <div className="security-badge">

                            <span className="security-icon">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    aria-hidden="true"
                                >
                                    <path d="M12 3 19 6v5c0 4.7-3 8.1-7 10-4-1.9-7-5.3-7-10V6l7-3Z" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                            </span>

                            <div>
                                <strong>
                                    Secure by design
                                </strong>

                                <span>
                                    Your credentials are
                                    protected.
                                </span>
                            </div>

                        </div>

                    </div>

                    <div className="brand-footer">

                        <span>
                            © 2026 Authentication System
                        </span>

                        <span>
                            Privacy · Security
                        </span>

                    </div>

                </div>

                {/* RIGHT FORM PANEL */}
                <div className="auth-form-panel">

                    <div className="mobile-brand">

                        <div className="brand-logo">
                            <span>A</span>
                        </div>

                    </div>

                    <div className="auth-form-container">

                        <div className="auth-header">

                            <span className="welcome-text">
                                WELCOME BACK
                            </span>

                            <h2>
                                Sign in to your account
                            </h2>

                            <p>
                                Enter your credentials
                                to continue.
                            </p>

                        </div>

                        {formError && (
                            <div
                                className="form-error"
                                role="alert"
                                aria-live="polite"
                            >
                                <span>!</span>

                                <p>
                                    {formError}
                                </p>
                            </div>
                        )}

                        <form
                            className="auth-form"
                            onSubmit={handleSubmit}
                            noValidate
                        >

                            <AuthInput
                                label="Email or username"
                                type="text"
                                name="identifier"
                                value={formData.identifier}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter your email or username"
                                error={errors.identifier}
                                autoComplete="username"
                                disabled={isLoading}
                            />

                            <AuthInput
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter your password"
                                error={errors.password}
                                autoComplete="current-password"
                                disabled={isLoading}
                            />

                            <div className="form-options">

                                <Link
                                    to="/forgot-password"
                                    className="forgot-link"
                                >
                                    Forgot password?
                                </Link>

                            </div>

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={isLoading}
                            >

                                {isLoading ? (
                                    <>
                                        <span className="button-spinner" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in

                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            aria-hidden="true"
                                        >
                                            <path d="M5 12h14" />
                                            <path d="m13 6 6 6-6 6" />
                                        </svg>
                                    </>
                                )}

                            </button>

                        </form>

                        <div className="auth-divider">
                            <span>
                                New to the application?
                            </span>
                        </div>

                        <Link
                            to="/register"
                            className="secondary-auth-button"
                        >
                            Create an account
                        </Link>

                        <p className="auth-legal">
                            By continuing, you agree to
                            our{" "}
                            <a href="#terms">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#privacy">
                                Privacy Policy
                            </a>
                            .
                        </p>

                    </div>

                </div>

            </section>
        </main>
    );
};

export default Login;

