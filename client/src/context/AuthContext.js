import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // CORRECT: Use NAMED import as per the compiler error

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const token = localStorage.getItem('prometheus_ascent_token');
            if (token) {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
            }
        } catch (error) {
            console.error("Invalid or expired token found in storage:", error);
            localStorage.removeItem('prometheus_ascent_token');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('prometheus_ascent_token', token);
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
    };

    const logout = () => {
        localStorage.removeItem('prometheus_ascent_token');
        setUser(null);
    };

    const value = { user, login, logout, isAuthenticated: !!user, loading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};