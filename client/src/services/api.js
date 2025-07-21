/**
 * A centralized API service module.
 * It handles token management and provides consistent API call functions.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api';

const getAuthToken = () => localStorage.getItem('prometheus_ascent_token');

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
        throw new Error(error.message || 'API request failed');
    }
    return response.json();
};

const api = {
    async get(endpoint) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
            },
        });
        return handleResponse(response);
    },

    async post(endpoint, body) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },
    
    // Add other methods like put, delete as needed
};

export default api;