import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useOrder } from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cart } = useShop();
    const { addOrder } = useOrder();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: ''
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        const order = addOrder({
            items: cart,
            total: total,
            customer: formData
        });
        alert(`Order Placed Successfully! Order ID: ${order.id}`);
        // In a real app, we'd clear the cart here
        navigate('/');
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    if (cart.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl uppercase tracking-widest mb-4">Your Cart is Empty</h2>
                <button onClick={() => navigate('/shop')} className="text-sm underline font-bold">Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row gap-12 py-12">
            {/* Form */}
            <div className="flex-1">
                <h2 className="text-xl font-light uppercase tracking-widest mb-8">Shipping Details</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <input
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border-b border-gray-300 py-2 outline-none focus:border-black uppercase text-sm tracking-wide"
                            required
                        />
                        <input
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            className="border-b border-gray-300 py-2 outline-none focus:border-black uppercase text-sm tracking-wide"
                            required
                        />
                        <input
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            className="border-b border-gray-300 py-2 outline-none focus:border-black uppercase text-sm tracking-wide"
                            required
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                className="border-b border-gray-300 py-2 outline-none focus:border-black uppercase text-sm tracking-wide"
                                required
                            />
                            <input
                                name="pincode"
                                placeholder="Pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                className="border-b border-gray-300 py-2 outline-none focus:border-black uppercase text-sm tracking-wide"
                                required
                            />
                        </div>
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="border-b border-gray-300 py-2 outline-none focus:border-black uppercase text-sm tracking-wide bg-transparent w-full"
                            required
                        >
                            <option value="">Select State</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            {/* Add more states */}
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-black text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-colors mt-8">
                        Place Order (COD)
                    </button>
                </form>
            </div>

            {/* Summary */}
            <div className="w-full md:w-96 bg-gray-50 p-8 h-fit">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b pb-4">Order Summary</h2>
                <div className="space-y-4 mb-6">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p>₹{item.price * item.quantity}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-4">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
