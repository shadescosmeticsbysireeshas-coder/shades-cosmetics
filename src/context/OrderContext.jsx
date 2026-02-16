import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);

    const ordersCollectionRef = collection(db, "orders");

    useEffect(() => {
        const unsubscribe = onSnapshot(ordersCollectionRef, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            // Optional: Sort by date
            setOrders(items);
        });
        return () => unsubscribe();
    }, []);

    const addOrder = async (orderData) => {
        const newOrder = {
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            status: 'Processing',
            ...orderData
        };

        try {
            const docRef = await addDoc(ordersCollectionRef, newOrder);
            return { ...newOrder, id: docRef.id };
        } catch (error) {
            console.error("Error creating order: ", error);
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            const orderDoc = doc(db, "orders", id);
            await updateDoc(orderDoc, { status });
        } catch (error) {
            console.error("Error updating order: ", error);
        }
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);
