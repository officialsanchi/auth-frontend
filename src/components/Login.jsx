import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import {
    normalizeEmail,
    validateEmail,
    validatePassword,
} from "../utils/validation";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleBlur = (event) => {
        const { name, value } = event.target;

        let error = "";

        if (name === "email") {
            error = validateEmail(value);
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

    const validateForm = () => {
        const newErrors = {};

        const emailError = validateEmail(
            formData.email
        );

        const passwordError = validatePassword(
            formData.password
        );

        if (emailError) {
            newErrors.email = emailError;
        }

        if (passwordError) {
            newErrors.password = passwordError;
        }

        return newErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isLoading) {
            return;
        }

        setFormError("");

        const validationErrors =
            validateForm();

        if (
            Object.keys(validationErrors).length >
            0
        ) {
            setErrors(validationErrors);
            return;
        }

        const loginPayload = {
            email: normalizeEmail(formData.email),
            password: formData.password,
        };

        setIsLoading(true);

        /*
         * Stage 3:
         *
         * The real API request will go here.
         *
         * await axios.post(
         *     `${API_URL}/auth/login`,
         *     loginPayload
         * );
         *
         * Notice that the password is NOT modified
         * or logged to the console.
         */

        console.log("Login payload:", {
            email: loginPayload.email,
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 1200);
    };

    return (
        <main className="auth-page">
            <section className="auth-shell">
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
                            © 2026 Authentication
                            System
                        </span>

                        <span>
                            Privacy · Security
                        </span>
                    </div>
                </div>

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
                            >
                                <span>!</span>

                                <p>{formError}</p>
                            </div>
                        )}

                        <form
                            className="auth-form"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <AuthInput
                                label="Email address"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="you@example.com"
                                error={errors.email}
                                autoComplete="email"
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
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={
                                            rememberMe
                                        }
                                        onChange={(event) =>
                                            setRememberMe(
                                                event
                                                    .target
                                                    .checked
                                            )
                                        }
                                        disabled={
                                            isLoading
                                        }
                                    />

                                    <span className="custom-checkbox" />

                                    <span>
                                        Remember me
                                    </span>
                                </label>

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