import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState(
        Array(OTP_LENGTH).fill("")
    );

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(
        RESEND_SECONDS
    );

    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (secondsLeft <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setSecondsLeft((current) => current - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [secondsLeft]);

    const handleChange = (index, value) => {
        const digits = value.replace(/\D/g, "");

        if (!digits) {
            const updatedOtp = [...otp];
            updatedOtp[index] = "";
            setOtp(updatedOtp);
            return;
        }

        const updatedOtp = [...otp];

        updatedOtp[index] = digits.charAt(
            digits.length - 1
        );

        setOtp(updatedOtp);

        setError("");
        setSuccess("");

        if (index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (
            event.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus();
        }

        if (
            event.key === "ArrowLeft" &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus();
        }

        if (
            event.key === "ArrowRight" &&
            index < OTP_LENGTH - 1
        ) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();

        const pastedValue = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, OTP_LENGTH);

        if (!pastedValue) {
            return;
        }

        const updatedOtp = Array(OTP_LENGTH).fill("");

        pastedValue
            .split("")
            .forEach((digit, index) => {
                updatedOtp[index] = digit;
            });

        setOtp(updatedOtp);
        setError("");
        setSuccess("");

        const focusIndex = Math.min(
            pastedValue.length,
            OTP_LENGTH - 1
        );

        inputRefs.current[focusIndex]?.focus();
    };

    const handleVerify = async (event) => {
        event.preventDefault();

        const verificationCode = otp.join("");

        if (!email) {
            setError(
                "Verification session is invalid. Please register again."
            );
            return;
        }

        if (verificationCode.length !== OTP_LENGTH) {
            setError(
                "Please enter the complete verification code."
            );
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            /*
             * Backend integration will be connected here.
             *
             * The request will use your actual backend's
             * email-verification endpoint and payload.
             */

            setSuccess(
                "Your email has been verified successfully."
            );

            setTimeout(() => {
                navigate("/login", {
                    replace: true,
                    state: {
                        emailVerified: true,
                    },
                });
            }, 1200);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Unable to verify your email. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (secondsLeft > 0 || resending) {
            return;
        }

        if (!email) {
            setError(
                "Verification session is invalid. Please register again."
            );
            return;
        }

        setResending(true);
        setError("");
        setSuccess("");

        try {
            /*
             * Backend resend-verification-code endpoint
             * will be connected here.
             */

            setOtp(Array(OTP_LENGTH).fill(""));
            setSecondsLeft(RESEND_SECONDS);

            setSuccess(
                "A new verification code has been sent."
            );

            inputRefs.current[0]?.focus();
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Unable to resend the verification code."
            );
        } finally {
            setResending(false);
        }
    };

    const formattedTime = `00:${String(secondsLeft).padStart(
        2,
        "0"
    )}`;

    return (
        <div className="auth-page">
            <div className="auth-shell">

                <section className="auth-brand-panel">
                    <div className="brand-content">

                        <div className="brand-logo">
                            A
                        </div>

                        <h1>
                            Authentication System
                        </h1>

                        <p>
                            Verify your email address to
                            secure your account and complete
                            your registration.
                        </p>

                        <div className="brand-features">

                            <div className="brand-feature">
                                <span>✓</span>
                                <p>
                                    Secure email verification
                                </p>
                            </div>

                            <div className="brand-feature">
                                <span>✓</span>
                                <p>
                                    One-time verification code
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

                <section className="auth-form-panel">

                    <div className="auth-form-container">

                        <Link
                            to="/register"
                            className="auth-back-link"
                        >
                            <span>←</span>
                            Back to registration
                        </Link>

                        <div className="auth-heading">

                            <div className="verification-icon">
                                ✉
                            </div>

                            <h2>
                                Verify your email
                            </h2>

                            <p>
                                We've sent a 6-digit
                                verification code to
                            </p>

                            <strong className="verification-email">
                                {email || "your email address"}
                            </strong>

                        </div>

                        {error && (
                            <div
                                className="auth-form-error"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}

                        {success && (
                            <div
                                className="auth-form-success"
                                role="status"
                            >
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleVerify}>

                            <div className="otp-container">

                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(element) => {
                                            inputRefs.current[index] =
                                                element;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(event) =>
                                            handleChange(
                                                index,
                                                event.target.value
                                            )
                                        }
                                        onKeyDown={(event) =>
                                            handleKeyDown(
                                                index,
                                                event
                                            )
                                        }
                                        onPaste={handlePaste}
                                        className="otp-input"
                                        disabled={loading}
                                        autoComplete={
                                            index === 0
                                                ? "one-time-code"
                                                : "off"
                                        }
                                        aria-label={`Verification digit ${
                                            index + 1
                                        }`}
                                    />
                                ))}

                            </div>

                            <div className="otp-timer">

                                {secondsLeft > 0 ? (
                                    <>
                                        Code expires in{" "}
                                        <strong>
                                            {formattedTime}
                                        </strong>
                                    </>
                                ) : (
                                    "Your verification code has expired."
                                )}

                            </div>

                            <button
                                type="submit"
                                className="auth-submit-button"
                                disabled={
                                    loading ||
                                    !email
                                }
                            >
                                {loading ? (
                                    <>
                                        <span className="button-spinner" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify email"
                                )}
                            </button>

                        </form>

                        <div className="otp-resend">

                            <span>
                                Didn't receive the code?
                            </span>

                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={
                                    secondsLeft > 0 ||
                                    resending
                                }
                            >
                                {resending
                                    ? "Sending..."
                                    : "Resend code"}
                            </button>

                        </div>

                    </div>

                </section>

            </div>
        </div>
    );
};

export default VerifyEmail;