import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPhoneNumber, signInWithPopup, onAuthStateChanged, signOut, getIdTokenResult } from "firebase/auth";

const AuthContext = createContext();

const parseEnvList = (value = '') =>
    value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

const ADMIN_EMAILS = parseEnvList(import.meta.env.VITE_ADMIN_EMAILS || '').map((email) => email.toLowerCase());
const ADMIN_PHONES = parseEnvList(import.meta.env.VITE_ADMIN_PHONES || '');

const normalizePhone = (phone = '') => {
    const value = String(phone).trim();
    if (!value) return '';
    if (value.startsWith('+')) {
        return `+${value.slice(1).replace(/\D/g, '')}`;
    }
    return value.replace(/\D/g, '');
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const tokenResult = await getIdTokenResult(currentUser);
                const claimRole = tokenResult?.claims?.role;
                const claimAdmin = tokenResult?.claims?.admin === true || claimRole === 'admin';

                const email = (currentUser.email || '').toLowerCase();
                const phone = normalizePhone(currentUser.phoneNumber || '');

                const envAdmin = (email && ADMIN_EMAILS.includes(email)) || (phone && ADMIN_PHONES.includes(phone));
                const isAdmin = Boolean(claimAdmin || envAdmin);

                setUser({
                    id: currentUser.uid,
                    name: currentUser.displayName || 'User',
                    phone: currentUser.phoneNumber || '',
                    email: currentUser.email || '',
                    photo: currentUser.photoURL || '',
                    role: isAdmin ? 'admin' : 'customer'
                });
            } catch (error) {
                console.error('Error resolving auth user role:', error);
                setUser({
                    id: currentUser.uid,
                    name: currentUser.displayName || 'User',
                    phone: currentUser.phoneNumber || '',
                    email: currentUser.email || '',
                    photo: currentUser.photoURL || '',
                    role: 'customer'
                });
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const loginWithPhone = async (phone, appVerifier) => {
        const normalizedPhone = String(phone || '').replace(/\D/g, '');
        if (normalizedPhone.length !== 10) {
            throw new Error('Please provide a valid 10-digit phone number.');
        }
        if (!appVerifier) {
            throw new Error('reCAPTCHA verification is required before sending OTP.');
        }

        const phoneNumber = `+91${normalizedPhone}`;
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        window.confirmationResult = confirmationResult;
        return confirmationResult;
    };

    const verifyOtp = async (otp) => {
        if (!window.confirmationResult) throw new Error("No OTP sent");
        // This triggers onAuthStateChanged automatically on success
        const result = await window.confirmationResult.confirm(otp);
        return result.user;
    };

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // onAuthStateChanged will handle the state update
            return result.user;
        } catch (error) {
            console.error("Google Sign In Error", error);
            throw error;
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login: loginWithPhone, verifyOtp, loginWithGoogle, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
