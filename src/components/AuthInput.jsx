import React, { useState } from "react";

const AuthInput = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    error,
    autoComplete,
    disabled = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType =
        isPassword && showPassword ? "text" : type;

    return (
        <div className="auth-field">
            <div className="auth-label-row">
                <label htmlFor={name}>
                    {label}
                </label>
            </div>

            <div
                className={`auth-input-wrapper ${
                    error ? "input-error" : ""
                }`}
            >
                <input
                    id={name}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                        error
                            ? `${name}-error`
                            : undefined
                    }
                />

                {isPassword && (
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                            setShowPassword(
                                (previous) => !previous
                            )
                        }
                        disabled={disabled}
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showPassword ? (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="2.5"
                                />
                                <path d="M4 4l16 16" />
                            </svg>
                        ) : (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="2.5"
                                />
                            </svg>
                        )}
                    </button>
                )}
            </div>

            {error && (
                <p
                    className="field-error"
                    id={`${name}-error`}
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    );
};

export default AuthInput;