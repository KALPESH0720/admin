import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Signin states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                setError(error.message);
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const commonInputClass = "w-full px-3 py-2 mt-1 text-gray-100 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500";
    const commonButtonClass = "w-full px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="w-full max-w-sm p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                <div className="text-center">
                    <div className="mb-4">
                        <div className="bg-green-600 p-3 rounded-lg inline-block">
                          <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/>
                          </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white">PharmaFriend Portal</h1>
                    <p className="text-gray-400">Sign in to your account</p>
                </div>

                {error && <div className="p-3 text-sm text-center text-red-200 bg-red-800/50 rounded-md">{error}</div>}

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={commonInputClass}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={commonInputClass} />
                    </div>
                    <div>
                        <button type="submit" disabled={loading} className={commonButtonClass}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;