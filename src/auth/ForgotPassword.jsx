import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import { validateEmail, normalizeEmail } from "../utils/validation";

import { forgotPassword } from "../services/api";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);

        if (emailError) {
            setEmailError("");
        }

        if (error) {
            setError("");
        }
    };

   const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateEmail(email);

    if (validationError) {
        setEmailError(validationError);
        return;
    }

    setLoading(true);
    setError("");

    try {
        const normalizedEmail = normalizeEmail(email);

        // Send request to backend
        await forgotPassword(normalizedEmail);

        // Backend successfully sent OTP
        navigate("/verify-otp", {
            state: {
                email: normalizedEmail,
                purpose: "password-reset",
            },
        });

    } catch (err) {

        console.error("Forgot password error:", err);

        setError(
            err?.response?.data?.message ||
            "Unable to send verification code. Please try again."
        );

    } finally {
        setLoading(false);
    }
};

    return (
        <div className="auth-page">
            <div className="auth-shell">

                <section className="auth-brand-panel">
                    <div className="brand-content">
                        <div className="brand-logo">A</div>

                        <h1>Authentication System</h1>
                        <br />
                        <br />

                        <p>
                            Secure access to your account with a simple,
                            reliable authentication experience.
                        </p>

                        <div className="brand-features">
                            <div className="brand-feature">
                                <span>✓</span>
                                <p>Secure account recovery</p>
                            </div>

                            <div className="brand-feature">
                                <span>✓</span>
                                <p>OTP verification</p>
                            </div>

                            <div className="brand-feature">
                                <span>✓</span>
                                <p>Protected credentials</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="auth-form-panel">
                    <div className="auth-form-container">
{/* 
                        <Link to="/login" className="auth-back-link">
                            <span>←</span>
                            Back to sign in
                        </Link> */}

                        <div className="auth-heading">
                            <h2>Forgot password?</h2>
                            <br />
                            <br />

                            <p>
                                Enter the email address associated with your
                                account and we'll send you a verification code.
                            </p>

                        </div>
                        <br />

                        {error && (
                            <div className="auth-form-error" role="alert">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate>

                            <AuthInput
                                label="Email address"
                            
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={() => {
                                    if (email) {
                                        setEmailError(validateEmail(email));
                                    }
                                }}
                                
                                placeholder="Enter your email address"
                                autoComplete="email"
                                error={emailError}
                                disabled={loading}
                            />

                            <button
                                type="submit"
                                className="auth-submit-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                    <br />
                                    <br />
                                    <br />
                                        <span className="button-spinner"></span>
                                        Sending code...
                                    </>
                                ) : (
                                    "Send verification code"
                                )}
                                <br />
                            </button>

                        </form>

                        {/* <div className="auth-footer">
                            <br />
                            <span>Remember your password?</span>
                          
                            <Link to="/login">Sign in</Link>
                        </div> */}

                    </div>
                </section>

            </div>
        </div>
    );
};

export default ForgotPassword;