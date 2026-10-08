
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import PasswordStrength from "../components/PasswordStrength";
import {
    validatePassword,
    validateConfirmPassword,
} from "../utils/validation";
import { resetPassword } from "../services/api";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";
    const otp = location.state?.otp || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ==========================================
    // SAFEGUARD
    // REDIRECT IF EMAIL OR OTP IS MISSING
    // ==========================================
    useEffect(() => {
        if (!email || !otp) {
            navigate("/forgot-password", {
                replace: true,
            });
        }
    }, [email, otp, navigate]);

    // ==========================================
    // HANDLE PASSWORD RESET
    // ==========================================
    const handleSubmit = async (event) => {
        event.preventDefault();

        const passwordValidation =
            validatePassword(password);

        const confirmValidation =
            validateConfirmPassword(
                password,
                confirmPassword
            );

        setPasswordError(passwordValidation);
        setConfirmPasswordError(confirmValidation);

        if (
            passwordValidation ||
            confirmValidation
        ) {
            return;
        }

        setLoading(true);
        setError("");

        try {

            // ==========================================
            // SEND NEW PASSWORD TO BACKEND
            // ==========================================
            await resetPassword({
                email,
                otp,
                password,
            });

            // ==========================================
            // CLEAR ANY EXISTING LOGIN SESSION
            // ==========================================
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");

            // ==========================================
            // PASSWORD RESET SUCCESSFUL
            // SEND USER TO LOGIN PAGE
            // ==========================================
            navigate("/login", {
                replace: true,
                state: {
                    passwordReset: true,
                    message:
                        "Password reset successful! Please log in with your new password.",
                },
            });

        } catch (err) {

            console.error(
                "Reset password error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to reset your password. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-shell">

                {/* ==========================================
                    LEFT BRAND PANEL
                ========================================== */}

                <section className="auth-brand-panel">

                    <div className="brand-content">

                        <div className="brand-logo">
                            A
                        </div>

                        <h1>
                            Authentication System
                        </h1>

                        <p>
                            Create a new secure password
                            and regain access to your
                            account.
                        </p>

                        <div className="brand-features">

                            <div className="brand-feature">
                                <span>✓</span>
                                <p>
                                    Secure password recovery
                                </p>
                            </div>

                            <div className="brand-feature">
                                <span>✓</span>
                                <p>
                                    Strong password protection
                                </p>
                            </div>

                            <div className="brand-feature">
                                <span>✓</span>
                                <p>
                                    Protected account access
                                </p>
                            </div>

                        </div>

                    </div>

                </section>

                {/* ==========================================
                    RIGHT FORM PANEL
                ========================================== */}

                <section className="auth-form-panel">

                    <div className="auth-form-container">

                        <Link
                            to="/login"
                            className="auth-back-link"
                        >
                            <span>←</span>
                            Back to sign in
                        </Link>

                        <div className="auth-heading">

                            <h2>
                                Create new password
                            </h2>

                            <p>
                                Choose a strong password
                                for your account.
                            </p>

                        </div>

                        {error && (
                            <div
                                className="auth-form-error"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            noValidate
                        >

                            {/* ==========================================
                                NEW PASSWORD
                            ========================================== */}

                            <AuthInput
                                label="New password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(event) => {

                                    setPassword(
                                        event.target.value
                                    );

                                    if (passwordError) {
                                        setPasswordError("");
                                    }

                                    if (error) {
                                        setError("");
                                    }

                                }}
                                onBlur={() => {

                                    if (password) {
                                        setPasswordError(
                                            validatePassword(
                                                password
                                            )
                                        );
                                    }

                                }}
                                placeholder="Enter your new password"
                                autoComplete="new-password"
                                error={passwordError}
                                disabled={loading}
                            />

                            <PasswordStrength
                                password={password}
                            />

                            {/* ==========================================
                                CONFIRM PASSWORD
                            ========================================== */}

                            <AuthInput
                                label="Confirm password"
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(event) => {

                                    setConfirmPassword(
                                        event.target.value
                                    );

                                    if (
                                        confirmPasswordError
                                    ) {
                                        setConfirmPasswordError("");
                                    }

                                    if (error) {
                                        setError("");
                                    }

                                }}
                                onBlur={() => {

                                    if (confirmPassword) {
                                        setConfirmPasswordError(
                                            validateConfirmPassword(
                                                password,
                                                confirmPassword
                                            )
                                        );
                                    }

                                }}
                                placeholder="Confirm your new password"
                                autoComplete="new-password"
                                error={confirmPasswordError}
                                disabled={loading}
                            />

                            {/* ==========================================
                                RESET PASSWORD BUTTON
                            ========================================== */}

                            <button
                                type="submit"
                                className="auth-submit-button"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="button-spinner"></span>
                                        Resetting password...
                                    </>
                                ) : (
                                    "Reset password"
                                )}

                            </button>

                        </form>

                        {/* ==========================================
                            LOGIN LINK
                        ========================================== */}

                        <div className="auth-footer">

                            <span>
                                Remember your password?
                            </span>

                            <Link to="/login">
                                Sign in
                            </Link>

                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
};

export default ResetPassword;

