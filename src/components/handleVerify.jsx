import React, { useState } from 'react';
import { verifyOtp } from '../services/api';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyEmail = () => {
    const [otp, setOtp] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || ""; // Grab email passed from Register

    const handleVerify = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await verifyOtp({ email, otp });
            setStatus('success');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            alert(err.response?.data?.message || "Invalid Code");
            setStatus('idle');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail size={40} />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800">Check your email</h2>
                <p className="text-gray-500 mt-2">We sent a verification code to <br/> 
                    <span className="font-semibold text-gray-700">{email || 'your email'}</span>
                </p>

                <form onSubmit={handleVerify} className="mt-8 space-y-6">
                    <input 
                        type="text" 
                        maxLength="6"
                        placeholder="0 0 0 0 0 0"
                        className="w-full text-center text-4xl tracking-[1rem] font-mono p-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <button 
                        disabled={status === 'loading'}
                        className={`w-full py-4 rounded-2xl font-bold text-white transition-all ${
                            status === 'success' ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
                        }`}
                    >
                        {status === 'loading' ? 'Verifying...' : status === 'success' ? 'Verified!' : 'Verify Account'}
                    </button>
                </form>

                <button onClick={() => navigate('/register')} className="mt-8 flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 mx-auto transition">
                    <ArrowLeft size={18} /> Back to Register
                </button>
            </div>
        </div>
    );
};