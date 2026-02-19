import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ELECTRONICS_PRODUCTS = [
    { name: 'Ikonic Hair Curler Curling Tong Ct-19 2.0', brand: 'Ikonic', price: 4450 },
    { name: 'Ikonic Straightener Pro Titanium Shine 30 Hair Iron Black', brand: 'Ikonic', price: 8500 },
    { name: 'Mr.Barber Crimper Urban Style Micro Crimper Black', brand: 'Mr. Barber', price: 5600 },
    { name: 'Ikonic Hair Dryer Pro 2400', brand: 'Ikonic', price: 4750 },
    { name: 'Candy Love Professional Hair Curler', brand: 'Candy', price: 4350 },
    { name: 'Alan Truman Dryer Core Force 103 Professional Hair Dryer Black', brand: 'Alan Turman', price: 7999 },
    { name: 'Alan Truman Dryer Force 8899 1800W Teal Green', brand: 'Alan Turman', price: 2749 },
    { name: 'Alan Truman Dryer Force 102 2600W Professional Hair Dryer Black', brand: 'Alan Turman', price: 5299 },
    { name: 'Mr.Barber Hair Straightener Ultimate Shine Pro', brand: 'Mr. Barber', price: 7500 },
    { name: 'Wahl Detaler T-Wide Trimmer', brand: 'Wahl', price: 7250 },
    { name: 'White Bird Tong Curling Tong Manual Rotate Tong 19 Mm', brand: 'Character', price: 3500 },
    { name: 'White Bird Tong Curling Tong Manual Rotate Tong 22 Mm', brand: 'Character', price: 3500 },
    { name: 'White Bird Tong Curling Tong Manual Rotate Tong 25 Mm', brand: 'Character', price: 3500 },
    { name: 'White Bird Straightener Rosegold Titanium Iron Rose Gold', brand: 'Character', price: 6500 }
];

const normalizeName = (value = '') => value.trim().toLowerCase();

export const importElectronicsProducts = async () => {
    try {
        const productsCollectionRef = collection(db, 'products');
        const snapshot = await getDocs(productsCollectionRef);
        const existingNames = new Set(
            snapshot.docs
                .map((docItem) => normalizeName(docItem.data()?.name))
                .filter(Boolean)
        );

        const productsToImport = ELECTRONICS_PRODUCTS.filter(
            (product) => !existingNames.has(normalizeName(product.name))
        );

        if (productsToImport.length === 0) {
            return {
                success: true,
                count: 0,
                skipped: ELECTRONICS_PRODUCTS.length,
                message: 'All electronics products already exist.'
            };
        }

        await Promise.all(
            productsToImport.map((product) =>
                addDoc(productsCollectionRef, {
                    ...product,
                    category: 'Electronics',
                    status: 'In Stock',
                    description: '',
                    image: 'https://via.placeholder.com/300',
                    createdAt: serverTimestamp()
                })
            )
        );

        return {
            success: true,
            count: productsToImport.length,
            skipped: ELECTRONICS_PRODUCTS.length - productsToImport.length
        };
    } catch (error) {
        console.error('Failed to import electronics products:', error);
        return {
            success: false,
            count: 0,
            message: 'Failed to import electronics products.'
        };
    }
};
