export const EMAIL_REGEX =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateEmail = (email) => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
        return "Email address is required.";
    }

    if (normalizedEmail.length > 254) {
        return "Email address is too long.";
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
        return "Enter a valid email address.";
    }

    return "";
};

export const validatePassword = (password) => {
    if (!password) {
        return "Password is required.";
    }

    if (password.length < 8) {
        return "Password must contain at least 8 characters.";
    }

    if (password.length > 128) {
        return "Password must not exceed 128 characters.";
    }

    return "";
};

export const validateConfirmPassword = (
    password,
    confirmPassword
) => {
    if (!confirmPassword) {
        return "Please confirm your password.";
    }

    if (password !== confirmPassword) {
        return "Passwords do not match.";
    }

    return "";
};

export const normalizeEmail = (email) => {
    return email.trim().toLowerCase();
};

export const getPasswordStrength = (password) => {
    if (!password) {
        return {
            score: 0,
            label: "",
        };
    }

    let score = 0;

    if (password.length >= 8) {
        score++;
    }

    if (/[a-z]/.test(password)) {
        score++;
    }

    if (/[A-Z]/.test(password)) {
        score++;
    }

    if (/[0-9]/.test(password)) {
        score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }

    const labels = {
        0: "",
        1: "Very weak",
        2: "Weak",
        3: "Fair",
        4: "Strong",
        5: "Very strong",
    };

    return {
        score,
        label: labels[score],
    };
};