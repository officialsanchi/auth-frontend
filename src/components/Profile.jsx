import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import authStorage from "../services/authStorage";
import "./Profile.css"; // adjust the path to wherever you save Profile.css

const Profile = () => {
    const navigate = useNavigate();
    const { user, isLoading, error } = useAuthUser();

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

    const handleLogout = () => {
        authStorage.clear();
        navigate("/login", { replace: true });
    };

    if (isLoading) {
        return (
            <main className="dashboard-loading-page">
                <div className="dashboard-loading-card">
                    <div className="dashboard-loading-spinner" />
                    <h2>Loading your profile</h2>
                    <p>Please wait while we retrieve your account information.</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="dashboard-loading-page">
                <div className="dashboard-loading-card">
                    <div className="dashboard-error-icon">!</div>
                    <h2>Unable to load profile</h2>
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
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

    const statusItems = [
        { label: "Account", ok: user.enabled, trueLabel: "Enabled", falseLabel: "Disabled" },
        { label: "Account lock", ok: user.accountNonLocked, trueLabel: "Not locked", falseLabel: "Locked" },
        { label: "Account validity", ok: user.accountNonExpired, trueLabel: "Valid", falseLabel: "Expired" },
        { label: "Credentials", ok: user.credentialsNonExpired, trueLabel: "Valid", falseLabel: "Expired" },
    ];

    const detailItems = [
        { label: "Full name", value: user.fullName },
        { label: "Username", value: `@${user.username}` },
        { label: "Email address", value: user.email },
        { label: "Phone number", value: user.phoneNumber || "Not provided" },
    ];

    return (
        <div className="dashboard-page">
            <aside className="dashboard-sidebar">
                <div className="dashboard-logo">
                    <div className="dashboard-logo-mark">A</div>
                    <span>Authentication</span>
                </div>

                <nav className="dashboard-navigation">
                    <NavLink to="/dashboard" className={({ isActive }) => `dashboard-nav-item ${isActive ? "active" : ""}`}>
                        <span>⌂</span> Dashboard
                    </NavLink>
                    <NavLink to="/profile" className={({ isActive }) => `dashboard-nav-item ${isActive ? "active" : ""}`}>
                        <span>◯</span> Profile
                    </NavLink>
                    <NavLink to="/security" className={({ isActive }) => `dashboard-nav-item ${isActive ? "active" : ""}`}>
                        <span>◆</span> Security
                    </NavLink>
                </nav>

                <div className="dashboard-sidebar-bottom">
                    <button type="button" className="dashboard-logout" onClick={handleLogout}>
                        <span>↪</span> Sign out
                    </button>
                </div>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div>
                        <p className="dashboard-eyebrow">ACCOUNT</p>
                        <h1>Profile</h1>
                    </div>
                </header>

                <section className="profile-hero">
                    <div className="profile-avatar-wrapper">
                        {user.profilePhotoUrl ? (
                            <img src={user.profilePhotoUrl} alt={user.fullName} className="profile-avatar" />
                        ) : (
                            <div className="profile-avatar profile-avatar-placeholder">{initials}</div>
                        )}
                    </div>

                    <div className="profile-hero-info">
                        <h2>{user.fullName}</h2>
                        <p>@{user.username}</p>
                        <span className={`profile-status ${user.enabled ? "active" : "inactive"}`}>
                            <span className="status-dot" />
                            {user.enabled ? "Active account" : "Inactive account"}
                        </span>
                    </div>
                </section>

                <section className="profile-section">
                    <div className="profile-section-header">
                        <div>
                            <p className="dashboard-eyebrow">PERSONAL INFORMATION</p>
                            <h2>Account details</h2>
                        </div>

                        <button
                            type="button"
                            className="profile-edit-button"
                            onClick={() => navigate("/profile/edit")}
                        >
                            Edit profile
                        </button>
                    </div>

                    <div className="profile-details-grid">
                        {detailItems.map((item) => (
                            <div className="profile-detail-card" key={item.label}>
                                <span>{item.label}</span>
                                <strong>{item.value}</strong>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="profile-section">
                    <div className="profile-section-header">
                        <div>
                            <p className="dashboard-eyebrow">ACCOUNT STATUS</p>
                            <h2>Security status</h2>
                        </div>
                    </div>

                    <div className="profile-status-grid">
                        {statusItems.map((item) => (
                            <div
                                key={item.label}
                                className={`profile-status-card ${item.ok ? "ok" : "bad"}`}
                            >
                                <div className="profile-status-icon">{item.ok ? "✓" : "✕"}</div>
                                <div className="profile-status-text">
                                    <span>{item.label}</span>
                                    <strong>{item.ok ? item.trueLabel : item.falseLabel}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Profile;