import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const servicesCollectionRef = collection(db, "services");

    useEffect(() => {
        const unsubscribe = onSnapshot(servicesCollectionRef, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setServices(items);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const addService = async (service) => {
        try {
            await addDoc(servicesCollectionRef, service);
        } catch (error) {
            console.error("Error adding service: ", error);
        }
    };

    const updateService = async (id, updatedData) => {
        try {
            const serviceDoc = doc(db, "services", id);
            await updateDoc(serviceDoc, updatedData);
        } catch (error) {
            console.error("Error updating service: ", error);
        }
    };

    const deleteService = async (id) => {
        try {
            const serviceDoc = doc(db, "services", id);
            await deleteDoc(serviceDoc);
        } catch (error) {
            console.error("Error deleting service: ", error);
        }
    };

    return (
        <ServiceContext.Provider value={{ services, addService, updateService, deleteService, loading }}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useService = () => useContext(ServiceContext);
