import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    if (!user) return null;

    // Mock Orders
    const orders = [
        { id: 'ORD-9921', date: 'Oct 24, 2025', total: 4500, status: 'Delivered', items: ['Velvet Matte Lipstick', 'Foundation'] },
        { id: 'ORD-9985', date: 'Jan 15, 2026', total: 1850, status: 'Processing', items: ['Liquid Eyeliner'] }
    ];

    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="flex justify-between items-end mb-12 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-light uppercase tracking-widest mb-2">My Account</h1>
                    <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
                </div>
                <button onClick={logout} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-black transition-colors">
                    Sign Out
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Profile Info */}
                <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest mb-6 border-b pb-2">Profile Details</h2>
                    <div className="space-y-4 text-sm">
                        <div>
                            <label className="block text-gray-400 text-xs uppercase mb-1">Mobile</label>
                            <p className="font-medium">+91 {user.phone}</p>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs uppercase mb-1">Email</label>
                            <p className="font-medium">Update email address</p>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs uppercase mb-1">Saved Address</label>
                            <p className="font-medium">No saved addresses</p>
                        </div>
                    </div>
                </div>

                {/* Order History */}
                <div className="md:col-span-2">
                    <h2 className="text-xs font-bold uppercase tracking-widest mb-6 border-b pb-2">Order History</h2>
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-gray-50 p-6 border border-gray-100 group hover:border-black transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-widest block mb-1">#{order.id}</span>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">{order.date}</span>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="mb-4 text-sm text-gray-600">
                                    {order.items.join(', ')}
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold pt-4 border-t border-gray-200">
                                    <span>Total</span>
                                    <span>₹{order.total}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Profile;
