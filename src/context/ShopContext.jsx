import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Import Firestore
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const productsCollectionRef = collection(db, "products");

    // Fetch Products Real-time
    useEffect(() => {
        const unsubscribe = onSnapshot(productsCollectionRef, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            // Sort by creation time if needed, or name. 
            // For now, let's just reverse so newest is top (if we added timestamp, but we'll stick to basic)
            setProducts(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Product Actions
    const addProduct = async (product) => {
        try {
            await addDoc(productsCollectionRef, { ...product, createdAt: new Date() });
        } catch (error) {
            console.error("Error adding product: ", error);
        }
    };

    const updateProduct = async (id, updatedData) => {
        try {
            const productDoc = doc(db, "products", id);
            await updateDoc(productDoc, updatedData);
        } catch (error) {
            console.error("Error updating product: ", error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            const productDoc = doc(db, "products", id);
            await deleteDoc(productDoc);
        } catch (error) {
            console.error("Error deleting product: ", error);
        }
    };

    // Cart Actions (Keep local for now, or sync to User doc later)
    const addToCart = (product) => {
        if (product.status === "Out of Stock") return;
        setCart((prev) => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    return (
        <ShopContext.Provider value={{ products, cart, addProduct, updateProduct, deleteProduct, addToCart, loading }}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => useContext(ShopContext);
