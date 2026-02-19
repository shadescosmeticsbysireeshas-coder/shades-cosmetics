import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, doc, onSnapshot, serverTimestamp, getDocs, deleteDoc } from 'firebase/firestore';

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
        const now = new Date();
        const subtotal = Number(orderData.subtotal ?? orderData.total ?? 0);
        const shipping = Number(orderData.shipping ?? 0);
        const tax = Number(orderData.tax ?? 0);
        const total = Number(orderData.total ?? subtotal + shipping + tax);

        const newOrder = {
            ...orderData,
            orderNumber: orderData.orderNumber || `ORD-${Date.now()}`,
            date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            status: orderData.status || 'Placed',
            orderStatus: orderData.orderStatus || 'Placed',
            subtotal,
            shipping,
            tax,
            total,
            currency: orderData.currency || 'INR',
            amounts: {
                subtotal,
                shipping,
                tax,
                total,
                currency: orderData.currency || 'INR'
            },
            payment: {
                method: orderData.payment?.method || 'COD',
                status: orderData.payment?.status || 'Pending',
                provider: orderData.payment?.provider || 'COD',
                transactionId: orderData.payment?.transactionId || null,
                paidAt: orderData.payment?.paidAt || null
            },
            createdAtISO: now.toISOString(),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        try {
            const docRef = await addDoc(ordersCollectionRef, newOrder);
            return { ...newOrder, id: docRef.id };
        } catch (error) {
            console.error("Error creating order: ", error);
            return null;
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            const orderDoc = doc(db, "orders", id);
            await updateDoc(orderDoc, { status, orderStatus: status, updatedAt: serverTimestamp() });
        } catch (error) {
            console.error("Error updating order: ", error);
        }
    };

    const clearAllOrders = async () => {
        try {
            const snapshot = await getDocs(ordersCollectionRef);
            await Promise.all(snapshot.docs.map((docItem) => deleteDoc(docItem.ref)));
            return { success: true, count: snapshot.docs.length };
        } catch (error) {
            console.error("Error clearing orders: ", error);
            return { success: false, count: 0 };
        }
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, clearAllOrders }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);
