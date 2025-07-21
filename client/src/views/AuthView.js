import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

const AuthView = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleAuthAction = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        try {
            const data = await api.post(endpoint, { email, password });
            if (isLogin) {
                login(data.token);
            } else {
                alert("Registration successful! Please log in.");
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <Card className="bg-white/5 backdrop-blur-sm border border-slate-700">
                <CardHeader className="text-center">
                    <CardTitle className="text-slate-50">{isLogin ? 'Welcome Back' : 'Create Your Account'}</CardTitle>
                    <CardDescription className="pt-2">{isLogin ? 'Sign in to access your skills profile.' : 'Join to start mapping your skills.'}</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 border border-red-500/50">{error}</p>}
                    <form onSubmit={handleAuthAction} className="space-y-4">
                        <div>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-md bg-slate-800/50 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" required />
                        </div>
                        <div>
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-md bg-slate-800/50 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" required />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:bg-blue-400/50">
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </Button>
                    </form>
                    <p className="text-center text-sm text-slate-400 mt-6">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-blue-500 hover:text-blue-400 ml-2">
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default AuthView;