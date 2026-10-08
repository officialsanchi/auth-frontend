import React, { useState } from 'react';
import { register, verifyOtp } from '../services/api';
// All icons are now being used below
import { UserPlus, ShieldCheck, ArrowRight, Mail, Lock, User, Phone } from 'lucide-react';

const RegisterMultiStep = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        password: ''
    });
    const [otp, setOtp] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData);
            setStep(2);
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await verifyOtp({ email: formData.email, otp });
            alert("Account Verified!");
            window.location.href = '/login';
        } catch (err) {
            alert(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-sans">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                
                {/* Sidebar */}
                <div className="md:w-1/3 bg-blue-600 p-8 text-white flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Join Us</h2>
                        <p className="mt-2 text-blue-100 text-sm">Create an account to secure your data.</p>
                    </div>
                    <div className="space-y-4">
                        <div className={`flex items-center gap-3 ${step === 1 ? 'opacity-100' : 'opacity-50'}`}>
                            <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs">1</div>
                            <span className="text-sm font-medium">Account Details</span>
                        </div>
                        <div className={`flex items-center gap-3 ${step === 2 ? 'opacity-100' : 'opacity-50'}`}>
                            <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs">2</div>
                            <span className="text-sm font-medium">Verify Email</span>
                        </div>
                    </div>
                </div>

                {/* Form Area */}
                <div className="md:w-2/3 p-8 lg:p-12">
                    {step === 1 ? (
                        <form onSubmit={handleRegister} className="animate-in fade-in duration-500">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <UserPlus className="text-blue-600" /> Create Account
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Username</label>
                                    <input required type="text" className="w-full mt-1 p-3 pl-10 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={(e) => setFormData({...formData, username: e.target.value})} />
                                    <User className="absolute left-3 top-9 text-gray-400 w-4 h-4" />
                                </div>
                                <div className="relative">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                                    <input required type="text" className="w-full mt-1 p-3 pl-10 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
                                    <Phone className="absolute left-3 top-9 text-gray-400 w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-4 relative">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
                                <input required type="email" className="w-full mt-1 p-3 pl-10 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                <Mail className="absolute left-3 top-9 text-gray-400 w-4 h-4" />
                            </div>
                            <div className="mt-4 mb-6 relative">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Password</label>
                                <input required type="password"  className="w-full mt-1 p-3 pl-10 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                <Lock className="absolute left-3 top-9 text-gray-400 w-4 h-4" />
                            </div>
                            <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                                {loading ? "Processing..." : "Continue"} <ArrowRight size={18} />
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="animate-in slide-in-from-right duration-500 text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h3>
                            <p className="text-gray-500 mb-8 text-sm">We've sent a code to <span className="font-semibold text-gray-700">{formData.email}</span></p>
                            
                            <div className="mb-8">
                                <input 
                                    required 
                                    type="text" 
                                    maxLength="6"
                                    placeholder="000000"
                                    className="w-full text-center text-3xl tracking-[1rem] p-4 border-2 border-dashed border-blue-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                    onChange={(e) => setOtp(e.target.value)} 
                                />
                            </div>

                            <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">
                                {loading ? "Verifying..." : "Verify & Complete"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterMultiStep;