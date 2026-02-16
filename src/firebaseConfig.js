import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyClPdv7ODSBUZ4Eo_Z8UfF_0GYziZN272Q",
    authDomain: "shades-cosmetics-live.firebaseapp.com",
    projectId: "shades-cosmetics-live",
    storageBucket: "shades-cosmetics-live.firebasestorage.app",
    messagingSenderId: "4548966814",
    appId: "1:4548966814:web:59b89cd1e7beab0b45fe8f",
    measurementId: "G-REXLG9D5X4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
