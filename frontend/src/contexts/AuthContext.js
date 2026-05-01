import { createContext } from "react";

export const AuthContext = createContext({
    user: null,
    loading: false,
    error: null,
    setError: () => { },
    setUser: () => { },
    handleRegister: async () => { },
    handleLogin: async () => { },
    handleLogout: () => { },
    getHistoryOfUser: async () => { },
    addToUserHistory: async () => { },
});
