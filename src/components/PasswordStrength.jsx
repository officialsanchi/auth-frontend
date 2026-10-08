import React from "react";
import { getPasswordStrength } from "../utils/validation";

const PasswordStrength = ({ password }) => {
    if (!password) {
        return null;
    }

    const { score, label } =
        getPasswordStrength(password);

    return (
        <div
            className="password-strength"
            aria-live="polite"
        >
            <div className="strength-bars">
                {[1, 2, 3, 4, 5].map((bar) => (
                    <span
                        key={bar}
                        className={
                            bar <= score
                                ? "strength-active"
                                : ""
                        }
                    />
                ))}
            </div>

            <div className="strength-info">
                <span>Password strength</span>

                <strong>{label}</strong>
            </div>
        </div>
    );
};

export default PasswordStrength;