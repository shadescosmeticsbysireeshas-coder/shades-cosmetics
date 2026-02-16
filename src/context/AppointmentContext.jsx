import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
    const [appointments, setAppointments] = useState([]);

    const appointmentsCollectionRef = collection(db, "appointments");

    useEffect(() => {
        const unsubscribe = onSnapshot(appointmentsCollectionRef, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            // Optional: Sort by date
            setAppointments(items);
        });
        return () => unsubscribe();
    }, []);

    const bookAppointment = async (details) => {
        const newAppointment = {
            status: 'Pending',
            createdAt: new Date().toISOString(),
            ...details
        };

        try {
            await addDoc(appointmentsCollectionRef, newAppointment);
            return newAppointment; // Note: Real ID comes from Firestore, but we return obj for immediate UI feedback if needed
        } catch (error) {
            console.error("Error booking appointment: ", error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const aptDoc = doc(db, "appointments", id);
            await updateDoc(aptDoc, { status });
        } catch (error) {
            console.error("Error updating appointment status: ", error);
        }
    };

    return (
        <AppointmentContext.Provider value={{ appointments, bookAppointment, updateStatus }}>
            {children}
        </AppointmentContext.Provider>
    );
};

export const useAppointment = () => useContext(AppointmentContext);
