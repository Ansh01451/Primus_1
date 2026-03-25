import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation, useVerifyLoginMutation, useResendOtpMutation } from '../../../services/apiSlice';
import { LogIn, Mail, Lock, ShieldCheck, ArrowRight, RefreshCw, KeyRound, UserCircle } from 'lucide-react';

const LoginPage = () => {
    const [step, setStep] = useState(1); // 1: Login, 2: OTP
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('client');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [login] = useLoginMutation();
    const [verifyLogin] = useVerifyLoginMutation();
    const [resendOtpCall] = useResendOtpMutation();
    
    const navigate = useNavigate();
    const captchaRef = useRef(null);
    const siteKey = "6LdQFoUrAAAAAPtwk0GeFVhA7fUenVLtedLApb55";

    useEffect(() => {
        // Render captcha if script is loaded
        const renderCaptcha = () => {
            if (window.grecaptcha && document.getElementById('recaptcha-main') && step === 1) {
                try {
                    window.grecaptcha.render('recaptcha-main', {
                        'sitekey': siteKey,
                    });
                } catch (e) {
                    console.warn('Recaptcha might already be rendered');
                }
            }
        };

        if (step === 1) {
            // Short delay to ensure DOM is ready
            const timer = setTimeout(renderCaptcha, 100);
            return () => clearTimeout(timer);
        }
    }, [step]);

    useEffect(() => {
        // Clear error when inputs change
        setError('');
    }, [email, password, type, otp]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            // Get captcha response
            const captcha_token = window.grecaptcha?.getResponse();
            if (!captcha_token) {
                setError('Please complete the reCAPTCHA');
                setIsLoading(false);
                return;
            }

            const response = await login({ email, password, type, captcha_token }).unwrap();
            console.log('Login request successful:', response);
            setStep(2);
        } catch (err) {
            console.error('Login failed:', err);
            setError(err.data?.detail || 'Login failed. Please check your credentials.');
            // Reset captcha on failure
            window.grecaptcha?.reset();
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const response = await verifyLogin({ email, otp, type }).unwrap();
            console.log('Verification successful:', response);
            
            // Store token and vendor info
            localStorage.setItem('token', response.access_token);
            if (response.vendor_type) localStorage.setItem('vendor_type', response.vendor_type);
            if (response.vendor_name || response.name) localStorage.setItem('user_name', response.vendor_name || response.name);
            localStorage.setItem('user_email', email);
            localStorage.setItem('user_type', type);
            
            // Redirect to dashboard
            navigate('/client/dashboard');
        } catch (err) {
            console.error('Verification failed:', err);
            setError(err.data?.detail || 'Invalid or expired OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        try {
            await resendOtpCall({ email, type }).unwrap();
            alert('OTP resent successfully!');
        } catch (err) {
            setError(err.data?.detail || 'Failed to resend OTP.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 font-sans">
            <div className="max-w-md w-full">
                {/* Logo & Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                        <ShieldCheck className="text-primary" size={32} />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Primus Partners</h1>
                    <p className="text-slate-500 mt-2">Secure access to your consulting dashboard</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="p-8">
                        {step === 1 ? (
                            /* Login Form */
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">User Type</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['client', 'vendor', 'admin'].map((t) => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setType(t)}
                                                className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                                                    type === t 
                                                    ? 'bg-primary border-primary text-white' 
                                                    : 'bg-white border-slate-200 text-slate-500 hover:border-primary/30'
                                                }`}
                                            >
                                                {t.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {['advisor', 'alumni'].map((t) => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setType(t)}
                                                className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                                                    type === t 
                                                    ? 'bg-primary border-primary text-white' 
                                                    : 'bg-white border-slate-200 text-slate-500 hover:border-primary/30'
                                                }`}
                                            >
                                                {t.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="john@example.com"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Captcha */}
                                <div className="flex justify-center py-2 min-h-[78px]">
                                    <div 
                                        id="recaptcha-main" 
                                        data-sitekey={siteKey}
                                    ></div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary text-white rounded-xl py-4 font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                                >
                                    {isLoading ? 'Processing...' : (
                                        <>
                                            Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            /* OTP Form */
                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-50 rounded-full mb-4">
                                        <KeyRound className="text-amber-500" size={24} />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800">Verification Required</h2>
                                    <p className="text-xs text-slate-500 mt-1 px-4">
                                        We've sent a 6-digit code to <strong>{email}</strong>
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Enter OTP Code</label>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        placeholder="000000"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium text-center">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <button
                                        type="submit"
                                        disabled={isLoading || otp.length < 4}
                                        className="w-full bg-primary text-white rounded-xl py-4 font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-70"
                                    >
                                        {isLoading ? 'Verifying...' : 'Verify & Continue'}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        className="w-full text-slate-500 py-2 text-xs font-bold hover:text-primary transition-colors flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw size={14} /> Resend Code
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-slate-600 transition-colors"
                                >
                                    Back to Login
                                </button>
                            </form>
                        )}
                    </div>
                    
                    <div className="bg-slate-50 border-t border-slate-100 p-6 text-center">
                        <p className="text-xs text-slate-400">
                            By signing in, you agree to our <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
