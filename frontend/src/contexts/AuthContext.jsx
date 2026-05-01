import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";
import { AuthContext } from "./AuthContext";

const client = axios.create({
    baseURL: `${server}/api/v1/users`
});

client.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        // This function will be defined later, so we need a way to access it.
        // We will attach it to the client instance after it's created.
        if (error.response?.status === 401 && client.handleLogout) {
            client.handleLogout();
        }
        return Promise.reject(error);
    }
);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start true to check for existing session
    const [error, setError] = useState(null);

    const router = useNavigate();

    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        setUser(null);
        router("/auth", { replace: true });
    }, [router]);

    // Make handleLogout available to the interceptor
    useEffect(() => {
        client.handleLogout = handleLogout;
    }, [handleLogout]);

    const fetchUser = useCallback(async () => {
        // This function assumes you have a /me endpoint to get the current user's data
        try {
            const { data } = await client.get('/me'); // Example endpoint
            setUser(data);
        } catch (err) {
            console.error("Failed to fetch user:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [fetchUser]);

    const handleRegister = useCallback(async (name, username, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await client.post("/register", {
                name,
                username,
                password
            });

            if (response.status === 201) {
                return { success: true, message: response.data.message };
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            return { success: false, error: err.response?.data?.message || "Registration failed" };
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLogin = useCallback(async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await client.post("/login", {
                username,
                password
            });

            if (response.status === 200) {
                const { token, user: userData } = response.data;
                localStorage.setItem("token", token);
                setUser(userData);
                router("/home", { replace: true });
                return { success: true };
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
            return { success: false, error: err.response?.data?.message || "Invalid credentials" };
        } finally {
            setLoading(false);
        }
    }, [router]); // router dependency is correct here

    const getHistoryOfUser = useCallback(async () => {
        // This function now returns a result object instead of throwing
        try {
            const response = await client.get("/get_all_activity");
            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Could not fetch user history.";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    }, []);

    const addToUserHistory = useCallback(async (meetingCode) => {
        // This function now returns a result object instead of throwing
        try {
            const response = await client.post("/add_to_activity", {
                meeting_code: meetingCode
            });
            return { success: true, data: response };
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Could not add to user history.";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    }, []);

    const contextValue = useMemo(() => ({
        user, setUser, loading, error, setError, handleRegister, handleLogin, handleLogout, getHistoryOfUser, addToUserHistory
    }), [user, loading, error, handleLogout, getHistoryOfUser, addToUserHistory, handleRegister, handleLogin]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;