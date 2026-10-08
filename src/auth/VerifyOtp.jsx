import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, verifyResetOtp } from "../services/api";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 600;

const VerifyOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();


    const email = location.state?.email || "";
    const purpose = location.state?.purpose || "registration";


    const [otp, setOtp] = useState(
        Array(OTP_LENGTH).fill("")
    );

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [secondsLeft, setSecondsLeft] =
        useState(RESEND_SECONDS);

    const inputRefs = useRef([]);


    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);


    useEffect(() => {
        if (secondsLeft <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setSecondsLeft((current) => {
                if (current <= 1) {
                    clearInterval(timer);
                    return 0;
                }

                return current - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [secondsLeft]);


    const handleChange = (index, value) => {
        const numericValue = value.replace(/\D/g, "");

        if (!numericValue) {
            const updatedOtp = [...otp];
            updatedOtp[index] = "";
            setOtp(updatedOtp);
            return;
        }

        const updatedOtp = [...otp];

        updatedOtp[index] =
            numericValue.charAt(numericValue.length - 1);

        setOtp(updatedOtp);
        setError("");

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

        const updatedOtp =
            Array(OTP_LENGTH).fill("");

        pastedValue
            .split("")
            .forEach((digit, index) => {
                updatedOtp[index] = digit;
            });

        setOtp(updatedOtp);
        setError("");

        const nextIndex = Math.min(
            pastedValue.length,
            OTP_LENGTH - 1
        );

        inputRefs.current[nextIndex]?.focus();
    };

    // ============================================
    // VERIFY OTP
    // ============================================

    const handleVerify = async (event) => {
        event.preventDefault();

        const completeOtp = otp.join("");

        if (completeOtp.length !== OTP_LENGTH) {
            setError(
                "Please enter the 6-digit verification code."
            );
            return;
        }

        if (!email) {
            setError(
                "Your email address is missing. Please register again."
            );
            return;
        }

        setLoading(true);
        setError("");

        const normalizedEmail =
            email.trim().toLowerCase();

        try {
            console.log("=================================");
            console.log("OTP VERIFICATION");
            console.log("Email:", normalizedEmail);
            console.log("OTP:", completeOtp);
            console.log("Purpose:", purpose);
            console.log("=================================");

            let response;

            // ========================================
            // PASSWORD RESET OTP
            // ========================================

            if (purpose === "password-reset") {

                console.log(
                    "Endpoint: POST /verify-reset-otp"
                );

                response = await verifyResetOtp({
                    email: normalizedEmail,
                    otp: completeOtp,
                });

                console.log(
                    "PASSWORD RESET OTP VERIFIED:"
                );

                console.log(response?.data);

                navigate("/reset-password", {
                    replace: true,
                    state: {
                        email: normalizedEmail,
                        otp: completeOtp,
                    },
                });

                return;
            }

            // ========================================
            // REGISTRATION OTP
            // ========================================

            console.log(
                "Endpoint: POST /verify-otp"
            );

            response = await verifyOtp({
                email: normalizedEmail,
                otp: completeOtp,
            });

            console.log(
                "REGISTRATION OTP VERIFIED:"
            );

            console.log(response?.data);

            // ========================================
            // REGISTRATION SUCCESS
            // ========================================

            navigate("/login", {
                replace: true,
                state: {
                    email: normalizedEmail,
                    verified: true,
                },
            });

        } catch (err) {

            console.error("=================================");
            console.error("OTP VERIFICATION FAILED");
            console.error("Status:", err?.response?.status);
            console.error(
                "Backend response:",
                err?.response?.data
            );
            console.error(
                "Backend message:",
                err?.response?.data?.message
            );
            console.error(
                "Backend error:",
                err?.response?.data?.error
            );
            console.error("=================================");

            const backendMessage =
                err?.response?.data?.message ||
                err?.response?.data?.error;

            if (backendMessage) {

                setError(backendMessage);

            } else if (err?.response) {

                setError(
                    `Verification failed. Server returned ${err.response.status}.`
                );

            } else if (err?.request) {

                setError(
                    "The server could not be reached. Please check that your backend is running."
                );

            } else {

                setError(
                    "Something went wrong while verifying the code."
                );
            }

        } finally {

            setLoading(false);

        }
    };

    // ============================================
    // RESEND OTP
    // ============================================

    const handleResend = async () => {

        if (
            secondsLeft > 0 ||
            resending
        ) {
            return;
        }

        if (!email) {
            setError(
                "Your email address is missing. Please register again."
            );
            return;
        }

        setResending(true);
        setError("");

        try {

            /*
             * Resend endpoint has not been connected yet.
             * We will add the backend resend endpoint next.
             */

            setError(
                "Resend OTP is not connected yet. Please register again to receive a new code."
            );

        } finally {

            setResending(false);

        }
    };

    // ============================================
    // FORMAT TIMER
    // ============================================

    const minutes = Math.floor(
        secondsLeft / 60
    );

    const seconds = secondsLeft % 60;

    const formattedTime =
        `${String(minutes).padStart(2, "0")}:${String(
            seconds
        ).padStart(2, "0")}`;

    // ============================================
    // UI
    // ============================================

    return (
        <div className="auth-page">

            <div className="auth-shell">

                {/* =================================
                    BRAND PANEL
                ================================== */}

                <section className="auth-brand-panel">

                    <div className="brand-content">

                        <div className="brand-logo">
                            A
                        </div>

                        <h1>
                            Authentication System
                        </h1>

                        <p>
                            Verify your identity and securely
                            recover access to your account.
                        </p>

                        <div className="brand-features">

                            <div className="brand-feature">
                                <span>✓</span>

                                <p>
                                    Secure verification
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
                                    Protected account recovery
                                </p>
                            </div>

                        </div>

                    </div>

                </section>

                {/* =================================
                    FORM PANEL
                ================================== */}

                <section className="auth-form-panel">

                    <div className="auth-form-container">

                        {/* BACK */}

                        {/* <Link
                            to="/register"
                            className="auth-back-link"
                        >
                            <span>
                                ←
                            </span>

                            Change email
                        </Link> */}

                        {/* HEADING */}

                        <div className="auth-heading">

                            <h2>
                                Verify your email
                            </h2>

                            <p>
                                Enter the 6-digit verification
                                code sent to{" "}

                                <strong>
                                    {email ||
                                        "your email address"}
                                </strong>
                                .
                            </p>

                        </div>

                        {/* ERROR */}

                        {error && (
                            <div
                                className="auth-form-error"
                                role="alert"
                                aria-live="polite"
                            >
                                {error}
                            </div>
                        )}

                        {/* OTP FORM */}

                        <form
                            onSubmit={handleVerify}
                        >

                            <div className="otp-container">

                                {otp.map(
                                    (digit, index) => (

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

                                            onPaste={
                                                handlePaste
                                            }

                                            className="otp-input"

                                            autoComplete={
                                                index === 0
                                                    ? "one-time-code"
                                                    : "off"
                                            }

                                            disabled={loading}

                                            aria-label={`Verification digit ${
                                                index + 1
                                            }`}
                                        />

                                    )
                                )}

                            </div>

                            {/* TIMER */}

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

                            {/* VERIFY BUTTON */}

                            <button
                                type="submit"
                                className="auth-submit-button"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>
                                        <span className="button-spinner"></span>

                                        Verifying...
                                    </>

                                ) : (

                                    "Verify code"

                                )}

                            </button>

                        </form>

                        {/* RESEND */}

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

export default VerifyOtp;