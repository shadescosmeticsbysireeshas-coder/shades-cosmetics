import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebaseConfig';
import { RecaptchaVerifier } from "firebase/auth";

const Login = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP
    const [error, setError] = useState('');
    const { login, verifyOtp, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        } catch (err) {
            setError('Google Sign In Failed. Please try again.');
        }
    };

    useEffect(() => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                },
                'expired-callback': () => {
                    // Response expired. Ask user to solve reCAPTCHA again.
                }
            });
        }
    }, []);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        if (phone.length === 10 && /^\d+$/.test(phone)) {
            try {
                const appVerifier = window.recaptchaVerifier;
                await login(phone, appVerifier);
                setStep(2);
            } catch (err) {
                console.error(err);
                setError('Failed to send OTP. Try again using the test number (9999999999).');
                if (window.recaptchaVerifier) {
                    window.recaptchaVerifier.clear();
                    window.recaptchaVerifier = null;
                }
            }
        } else {
            setError('Please enter a valid 10-digit mobile number');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            const user = await verifyOtp(otp);
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                const from = location.state?.from?.pathname || "/";
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError('Invalid OTP. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center py-20">
            <div className="w-full max-w-sm p-6">
                <h2 className="text-2xl font-light mb-12 text-center uppercase tracking-[0.2em]">
                    {step === 1 ? 'Login / Register' : 'Verify'}
                </h2>

                {error && <div className="mb-6 text-red-600 text-xs text-center border border-red-200 p-2">{error}</div>}

                {/* Invisible Recaptcha */}
                <div id="recaptcha-container"></div>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-8">
                        <div className="relative group">
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full border-b border-gray-300 outline-none py-2 text-xl bg-transparent transition-colors focus:border-black"
                                placeholder=" "
                                maxLength={10}
                            />
                            <label className={`absolute left-0 top-2 text-xs uppercase tracking-widest text-gray-400 transition-all pointer-events-none ${phone ? '-top-5 text-[10px]' : ''}`}>
                                Mobile Number
                            </label>
                        </div>
                        <button type="submit" className="w-full bg-black text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-colors">
                            Continue
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-300"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest">
                                <span className="bg-white px-2 text-gray-500">Or</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full border border-black text-black py-4 uppercase tracking-widest text-xs font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            Sign in with Google
                        </button>

                        <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
                            By continuing, you agree to our Terms
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-8">
                        <div className="text-center mb-4">
                            <span className="text-xs text-gray-500 uppercase tracking-widest">Sent to +91 {phone}</span>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="ml-2 text-xs uppercase tracking-widest underline hover:text-black"
                            >
                                Edit
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full border-b border-gray-300 outline-none py-2 text-2xl tracking-[0.5em] text-center bg-transparent focus:border-black"
                                placeholder="••••"
                                maxLength={6}
                                autoFocus
                            />
                        </div>

                        <button type="submit" className="w-full bg-black text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-colors">
                            Sign In
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
