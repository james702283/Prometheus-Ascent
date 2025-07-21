import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * A custom hook to provide easy access to the AuthContext.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};