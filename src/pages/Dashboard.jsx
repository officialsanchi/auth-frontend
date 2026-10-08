import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/api";

const Dashboard = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadUser = async () => {
            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");

            if (!token) {
                navigate("/login", { replace: true });
                return;
            }

            try {
                setIsLoading(true);
                setError("");

                const response = await getCurrentUser();

                setUser(response.data);
            } catch (err) {
                console.error("Failed to load dashboard:", err);

                if (
                    err?.response?.status === 401 ||
                    err?.response?.status === 403
                ) {
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("token");
                    localStorage.removeItem("username");
                    localStorage.removeItem("profilePhotoUrl");

                    navigate("/login", {
                        replace: true,
                    });

                    return;
                }

                setError(
                    err?.response?.data?.message ||
                    "Unable to load your dashboard."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, [navigate]);

 const handleLogout = () => {
    // Remove authentication token
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    // Remove saved user information
    localStorage.removeItem("username");
    localStorage.removeItem("profilePhotoUrl");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("profilePhotoUrl");

    // Redirect to login page
    navigate("/login", { replace: true });
};

    const getInitials = (name = "") => {
        const words = name.trim().split(/\s+/);

        if (!words[0]) {
            return "U";
        }

        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }

        return (
            words[0].charAt(0) +
            words[words.length - 1].charAt(0)
        ).toUpperCase();
    };

    if (isLoading) {
        return (
            <main className="dashboard-loading-page">
                <div className="dashboard-loading-card">

                    <div className="dashboard-loading-spinner" />

                    <h2>
                        Loading your dashboard
                    </h2>

                    <p>
                        Please wait while we retrieve
                        your account information.
                    </p>

                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="dashboard-loading-page">
                <div className="dashboard-loading-card">

                    <div className="dashboard-error-icon">
                        !
                    </div>

                    <h2>
                        Unable to load dashboard
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            window.location.reload()
                        }
                        className="dashboard-retry-button"
                    >
                        Try again
                    </button>

                </div>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    const initials = getInitials(user.fullName);

    return (
        <div className="dashboard-page">

            {/* =========================================
                SIDEBAR
            ========================================= */}

            <aside className="dashboard-sidebar">

                <div className="dashboard-logo">

                    <div className="dashboard-logo-mark">
                        A
                    </div>

                    <span>
                        Authentication
                    </span>

                </div>

                <nav className="dashboard-navigation">

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `dashboard-nav-item ${
                                isActive
                                    ? "active"
                                    : ""
                            }`
                        }
                    >
                        <span>⌂</span>
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `dashboard-nav-item ${
                                isActive
                                    ? "active"
                                    : ""
                            }`
                        }
                    >
                        <span>◯</span>
                        Profile
                    </NavLink>

                    {/* <NavLink
                        to="/security"
                        className={({ isActive }) =>
                            `dashboard-nav-item ${
                                isActive
                                    ? "active"
                                    : ""
                            }`
                        }
                    >
                        <span>◆</span>
                        Security
                    </NavLink> */}

                </nav>

                <div className="dashboard-sidebar-bottom">

                    <button
                        type="button"
                        className="dashboard-logout"
                        onClick={handleLogout}
                    >
                        <span>↪</span>
                        Sign out
                    </button>

                </div>

            </aside>


            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <main className="dashboard-main">

                {/* HEADER */}

                <header className="dashboard-header">

                    <div>

                        <p className="dashboard-eyebrow">
                            OVERVIEW
                        </p>

                        <h1>
                            Dashboard
                        </h1>

                    </div>


                    {/* USER SUMMARY */}

                    <div className="dashboard-user">

                        {user.profilePhotoUrl ? (
                            <img
                                src={user.profilePhotoUrl}
                                alt={user.fullName}
                                className="dashboard-avatar dashboard-avatar-image"
                            />
                        ) : (
                            <div className="dashboard-avatar">
                                {initials}
                            </div>
                        )}

                        <div className="dashboard-user-info">

                            <strong>
                                {user.fullName}
                            </strong>

                            <span>
                                @{user.username}
                            </span>

                        </div>

                    </div>

                </header>


                {/* =========================================
                    WELCOME SECTION
                ========================================= */}

                <section className="dashboard-welcome">

                    <div>

                        <span className="dashboard-badge">

                            {user.enabled
                                ? "Account active"
                                : "Account inactive"}

                        </span>

                        <h2>
                            Welcome back,{" "}
                            {user.fullName
                                ?.split(" ")[0]}
                        </h2>

                        <p>
                            Your account is securely
                            authenticated. Manage your
                            profile and security settings
                            from the dashboard.
                        </p>

                    </div>

                </section>


                {/* =========================================
                    ACCOUNT STATUS
                ========================================= */}

                <section className="dashboard-status-section">

                    <div className="dashboard-section-heading">

                        <div>

                            <p className="dashboard-eyebrow">
                                ACCOUNT STATUS
                            </p>

                            <h2>
                                Your account
                            </h2>

                        </div>

                    </div>


                    <div className="dashboard-grid">

                        {/* AUTHENTICATION */}

                        <article className="dashboard-card">

                            <div className="dashboard-card-icon">
                                ✓
                            </div>

                            <div>

                                <span>
                                    Authentication
                                </span>

                                <strong>
                                    {user.enabled
                                        ? "Verified"
                                        : "Pending"}
                                </strong>

                            </div>

                        </article>


                        {/* ACCOUNT */}

                        <article className="dashboard-card">

                            <div className="dashboard-card-icon">
                                ◉
                            </div>

                            <div>

                                <span>
                                    Account
                                </span>

                                <strong>
                                    {user.enabled
                                        ? "Active"
                                        : "Inactive"}
                                </strong>

                            </div>

                        </article>


                        {/* SECURITY */}

                        <article className="dashboard-card">

                            <div className="dashboard-card-icon">
                                ◆
                            </div>

                            <div>

                                <span>
                                    Security
                                </span>

                                <strong>
                                    {user.accountNonLocked
                                        ? "Protected"
                                        : "Locked"}
                                </strong>

                            </div>

                        </article>

                    </div>

                </section>


                {/* =========================================
                    ACCOUNT OVERVIEW
                ========================================= */}

                <section className="dashboard-overview-section">

                    <div className="dashboard-overview-card">

                        <div className="dashboard-overview-content">

                            <span className="dashboard-overview-label">
                                ACCOUNT OVERVIEW
                            </span>

                            <h2>
                                Your account is ready
                            </h2>

                            <p>
                                Your authentication is active
                                and your account is securely
                                connected to the application.
                                Visit your profile to view or
                                manage your personal information.
                            </p>

                           

                        </div>

                        <div className="dashboard-overview-icon">
                            {initials}
                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default Dashboard;