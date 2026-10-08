import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthInput from "../components/AuthInput";
import PasswordStrength from "../components/PasswordStrength";
import { register } from "../services/api";

import {
    normalizeEmail,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
} from "../utils/validation";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
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

        if (
            name === "password" &&
            errors.confirmPassword &&
            value === formData.confirmPassword
        ) {
            setErrors((previous) => ({
                ...previous,
                confirmPassword: "",
            }));
        }

        if (formError) {
            setFormError("");
        }
    };

    const validateField = (name, value) => {
        const trimmedValue = value.trim();

        switch (name) {
            case "fullName":
                if (!trimmedValue) {
                    return "Full name is required.";
                }

                if (trimmedValue.length < 2) {
                    return "Please enter your full name.";
                }

                return "";

            case "username":
                if (!trimmedValue) {
                    return "Username is required.";
                }

                if (trimmedValue.length < 3) {
                    return "Username must be at least 3 characters.";
                }

                if (!/^[a-zA-Z0-9_.-]+$/.test(trimmedValue)) {
                    return "Use only letters, numbers, dots, hyphens, or underscores.";
                }

                return "";

            case "phoneNumber":
                if (!trimmedValue) {
                    return "Phone number is required.";
                }

                if (!/^[0-9+\-\s()]{7,20}$/.test(trimmedValue)) {
                    return "Please enter a valid phone number.";
                }

                return "";

            case "email":
                return validateEmail(value);

            case "password":
                return validatePassword(value);

            case "confirmPassword":
                return validateConfirmPassword(
                    formData.password,
                    value
                );

            default:
                return "";
        }
    };

    const handleBlur = (event) => {
        const { name, value } = event.target;

        const error = validateField(name, value);

        setErrors((previous) => ({
            ...previous,
            [name]: error,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        const fields = [
            "fullName",
            "username",
            "phoneNumber",
            "email",
            "password",
            "confirmPassword",
        ];

        fields.forEach((field) => {
            const error = validateField(field, formData[field]);

            if (error) {
                newErrors[field] = error;
            }
        });

        return newErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isLoading) {
            return;
        }

        setFormError("");

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);

            const firstErrorField = Object.keys(validationErrors)[0];

            document
                .querySelector(`[name="${firstErrorField}"]`)
                ?.focus();

            return;
        }

        const normalizedEmail = normalizeEmail(formData.email);

        /*
         * IMPORTANT:
         * The Spring Boot backend expects:
         *
         * username
         * email
         * phoneNumber
         * password
         * Full_name
         *
         * confirmPassword is only used by the frontend
         * and is NOT sent to the backend.
         */
        const registerPayload = {
            username: formData.username.trim(),
            email: normalizedEmail,
            phoneNumber: formData.phoneNumber.trim(),
            password: formData.password,
            Full_name: formData.fullName.trim(),
        };

        setIsLoading(true);

        try {
            console.log("Sending registration request:", {
                ...registerPayload,
                password: "********",
            });

            const response = await register(registerPayload);

            console.log("Registration successful:", response.data);

         navigate("/verify-otp", {
    replace: true,
    state: {
        email: normalizedEmail,
        purpose: "registration",
    },
});

        } catch (error) {
            console.error("Registration error:", error);

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Unable to create your account. Please try again.";

            setFormError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-shell">

                {/* LEFT BRAND PANEL */}
                <aside className="auth-brand-panel">
                    <div className="brand-content">

                        <div className="brand-logo">
                            <span>A</span>
                        </div>

                        <span className="brand-kicker">
                            CREATE YOUR ACCOUNT
                        </span>

                        <h1>
                            Start with a
                            <br />
                            secure identity.
                        </h1>

                        <p className="brand-description">
                            Create your account and securely access
                            everything your application has to offer.
                        </p>

                        <div className="feature-list">

                            <div className="feature-item">
                                <span className="feature-number">
                                    01
                                </span>

                                <div>
                                    <strong>
                                        Secure authentication
                                    </strong>

                                    <p>
                                        Built around secure account
                                        management and protected access.
                                    </p>
                                </div>
                            </div>

                            <div className="feature-item">
                                <span className="feature-number">
                                    02
                                </span>

                                <div>
                                    <strong>
                                        Protected credentials
                                    </strong>

                                    <p>
                                        Your password is handled securely
                                        and never exposed in plain text.
                                    </p>
                                </div>
                            </div>

                            <div className="feature-item">
                                <span className="feature-number">
                                    03
                                </span>

                                <div>
                                    <strong>
                                        Access anywhere
                                    </strong>

                                    <p>
                                        Sign in securely from your desktop,
                                        tablet, or mobile device.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    <footer className="brand-footer">
                        <span>
                            © 2026 Authentication System
                        </span>

                        <span>
                            Privacy · Security
                        </span>
                    </footer>
                </aside>

                {/* RIGHT FORM PANEL */}
                <section className="auth-form-panel">

                    <div className="mobile-brand">
                        <div className="brand-logo">
                            <span>A</span>
                        </div>

                        <span>
                            Authentication
                        </span>
                    </div>

                    <div className="auth-form-container register-container">

                        <header className="auth-header">

                            <span className="welcome-text">
                                GET STARTED
                            </span>

                            <h2>
                                Create your account
                            </h2>

                            <p>
                                Enter your details to create your secure
                                account.
                            </p>

                        </header>

                        {formError && (
                            <div
                                className="form-error"
                                role="alert"
                                aria-live="polite"
                            >
                                <span
                                    className="form-error-icon"
                                    aria-hidden="true"
                                >
                                    !
                                </span>

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
                                label="Full name"
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Chidinma Obioma Nwangwu"
                                error={errors.fullName}
                                autoComplete="name"
                                disabled={isLoading}
                            />

                            <AuthInput
                                label="Username"
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="dinmaly"
                                error={errors.username}
                                autoComplete="username"
                                disabled={isLoading}
                            />

                            <AuthInput
                                label="Phone number"
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="09074440460"
                                error={errors.phoneNumber}
                                autoComplete="tel"
                                inputMode="tel"
                                disabled={isLoading}
                            />

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
                                inputMode="email"
                                disabled={isLoading}
                            />

                            <AuthInput
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Create a password"
                                error={errors.password}
                                autoComplete="new-password"
                                disabled={isLoading}
                            />

                            {formData.password && (
                                <PasswordStrength
                                    password={formData.password}
                                />
                            )}

                            <AuthInput
                                label="Confirm password"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Confirm your password"
                                error={errors.confirmPassword}
                                autoComplete="new-password"
                                disabled={isLoading}
                            />

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span
                                            className="button-spinner"
                                            aria-hidden="true"
                                        />

                                        <span>
                                            Creating account...
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span>
                                            Create account
                                        </span>

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
                                Already have an account?
                            </span>
                        </div>

                        <Link
                            to="/login"
                            className="secondary-auth-button"
                        >
                            Sign in
                        </Link>

                        <p className="auth-legal">
                            By creating an account, you agree to our{" "}
                            <a href="#terms">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#privacy">
                                Privacy Policy
                            </a>.
                        </p>

                    </div>
                </section>
            </section>
        </main>
    );
};

export default Register;