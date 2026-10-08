import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/api";
import authStorage from "../services/authStorage";

export function useAuthUser() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!authStorage.getToken()) {
            navigate("/login", { replace: true });
            return;
        }

        const loadProfile = async () => {
            try {
                setIsLoading(true);
                setError("");

                const { data } = await getCurrentUser();
                setUser(data);
            } catch (err) {
                console.error("Failed to load profile:", err);

                if ([401, 403].includes(err?.response?.status)) {
                    authStorage.clear();
                    navigate("/login", { replace: true });
                    return;
                }

                setError(
                    err?.response?.data?.message ||
                    "Unable to load your profile."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [navigate]);

    return { user, isLoading, error };
}