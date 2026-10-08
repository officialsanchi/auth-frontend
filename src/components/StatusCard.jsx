import React from "react";

const StatusCard = ({ label, ok, trueLabel, falseLabel }) => (
    <div className="profile-status-card">
        <div className={`profile-status-icon ${ok ? "ok" : "bad"}`}>
            {ok ? "✓" : "✕"}
        </div>

        <div>
            <span>{label}</span>
            <strong>{ok ? trueLabel : falseLabel}</strong>
        </div>
    </div>
);

export default StatusCard;