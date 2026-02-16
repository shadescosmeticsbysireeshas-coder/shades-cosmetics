import { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { useAppointment } from '../context/AppointmentContext';
import { useService } from '../context/ServiceContext';
import { useOrder } from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import { BRANDS, CATEGORIES } from '../data/mockData';
import { Package, XCircle, AlertTriangle, CheckCircle, Calendar, TrendingUp } from 'lucide-react';

// Mock Upload Component using URL input
const ImageUpload = ({ value, onChange, label }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result); // Base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <label className="block text-xs uppercase tracking-widest mb-2 text-gray-400">{label}</label>
            <div className="flex gap-4 items-center">
                <div className="flex-1">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                    />
                </div>
                {value && (
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden relative group">
                        <img src={value} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px]"
                        >
                            X
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, icon: Icon, color = "bg-black" }) => (
    <div className="bg-white p-6 border border-gray-100 flex items-center justify-between group hover:border-black transition-all duration-300">
        <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{title}</p>
            <p className="text-2xl font-light">{value}</p>
        </div>
        <div className={`w-10 h-10 ${color} text-white flex items-center justify-center rounded-full opacity-80 group-hover:opacity-100 transition-opacity`}>
            <Icon className="w-5 h-5" />
        </div>
    </div>
);

const AdminDashboard = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useShop();
    const { appointments, updateStatus } = useAppointment();
    const { services, addService, updateService, deleteService } = useService();
    const { orders } = useOrder();
    const { user } = useAuth();
    const navigate = useNavigate();

    // UI State
    const [activeTab, setActiveTab] = useState('inventory'); // inventory | appointments | services

    // Product Form State
    const [prodForm, setProdForm] = useState({ name: '', brand: BRANDS[0], category: CATEGORIES[0], price: '', status: 'In Stock', image: '', description: '' });
    const [editingProdId, setEditingProdId] = useState(null);

    // Service Form State
    const [servForm, setServForm] = useState({ title: '', price: '', duration: '', image: '' });
    const [editingServId, setEditingServId] = useState(null);

    // Protect Route
    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user && false) return null;

    // Metrics
    const ordersPlaced = orders.length;
    const ordersCancelled = orders.filter(o => o.status === 'Cancelled').length;
    const outOfStock = products.filter(p => p.status === 'Out of Stock').length;
    const inStock = products.filter(p => p.status === 'In Stock').length;
    const appointmentsBooked = appointments.length;

    // Calculate Total Revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

    // --- Product Handlers ---
    const handleProductSubmit = (e) => {
        e.preventDefault();
        const productData = { ...prodForm, image: prodForm.image || 'https://via.placeholder.com/300' };

        if (editingProdId) {
            updateProduct(editingProdId, productData);
            setEditingProdId(null);
        } else {
            addProduct(productData);
        }
        setProdForm({ name: '', brand: BRANDS[0], category: CATEGORIES[0], price: '', status: 'In Stock', image: '', description: '' });
    };

    const handleEditProduct = (product) => {
        setProdForm(product);
        setEditingProdId(product.id);
    };

    // --- Service Handlers ---
    const handleServiceSubmit = (e) => {
        e.preventDefault();
        const serviceData = { ...servForm, image: servForm.image || 'https://via.placeholder.com/300' };

        if (editingServId) {
            updateService(editingServId, serviceData);
            setEditingServId(null);
        } else {
            addService(serviceData);
        }
        setServForm({ title: '', price: '', duration: '', image: '' });
    };

    const handleEditService = (service) => {
        setServForm(service);
        setEditingServId(service.id);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-light uppercase tracking-widest">Admin Dashboard</h1>
                <div className="text-xs uppercase tracking-widest text-gray-500">Admin: {user?.phone}</div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
                <MetricCard title="Orders Placed" value={ordersPlaced} icon={Package} color="bg-blue-500" />
                <MetricCard title="Cancelled" value={ordersCancelled} icon={XCircle} color="bg-red-500" />
                <MetricCard title="Out of Stock" value={outOfStock} icon={AlertTriangle} color="bg-yellow-500" />
                <MetricCard title="In Stock" value={inStock} icon={CheckCircle} color="bg-green-500" />
                <MetricCard title="Appointments" value={appointmentsBooked} icon={Calendar} color="bg-purple-500" />
                <MetricCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={TrendingUp} color="bg-emerald-500" />
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-gray-100 mb-8 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('inventory')}
                    className={`pb-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${activeTab === 'inventory' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Store Inventory
                </button>
                <button
                    onClick={() => setActiveTab('services')}
                    className={`pb-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${activeTab === 'services' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Parlour Services
                </button>
                <button
                    onClick={() => setActiveTab('appointments')}
                    className={`pb-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${activeTab === 'appointments' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Appointments
                </button>
            </div>

            {activeTab === 'inventory' && (
                <div>
                    {/* Product Form */}
                    <div className="bg-gray-50 p-6 mb-12 border border-gray-100 rounded-lg">
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-6 border-b pb-2">
                            {editingProdId ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <input
                                    className="w-full border-b border-gray-300 p-2 bg-transparent outline-none focus:border-black transition-colors"
                                    placeholder="Product Name"
                                    value={prodForm.name}
                                    onChange={e => setProdForm({ ...prodForm, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <textarea
                                    className="w-full border-b border-gray-300 p-2 bg-transparent outline-none focus:border-black transition-colors resize-none h-24"
                                    placeholder="Product Description"
                                    value={prodForm.description}
                                    onChange={e => setProdForm({ ...prodForm, description: e.target.value })}
                                />
                            </div>

                            <ImageUpload
                                label="Product Image"
                                value={prodForm.image}
                                onChange={(val) => setProdForm({ ...prodForm, image: val })}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    className="border-b border-gray-300 p-2 bg-transparent outline-none focus:border-black transition-colors"
                                    placeholder="Price (INR)"
                                    type="number"
                                    value={prodForm.price}
                                    onChange={e => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                                    required
                                />
                                <select
                                    className="border-b border-gray-300 p-2 bg-transparent outline-none focus:border-black"
                                    value={prodForm.status}
                                    onChange={e => setProdForm({ ...prodForm, status: e.target.value })}
                                >
                                    <option value="In Stock">In Stock</option>
                                    <option value="Out of Stock">Out of Stock</option>
                                </select>
                            </div>
                            <select
                                className="border-b border-gray-300 p-2 bg-transparent outline-none focus:border-black"
                                value={prodForm.brand}
                                onChange={e => setProdForm({ ...prodForm, brand: e.target.value })}
                            >
                                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <select
                                className="border-b border-gray-300 p-2 bg-transparent outline-none focus:border-black"
                                value={prodForm.category}
                                onChange={e => setProdForm({ ...prodForm, category: e.target.value })}
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>

                            <div className="md:col-span-2 mt-4 flex gap-4">
                                <button type="submit" className="flex-1 bg-black text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-colors">
                                    {editingProdId ? 'Update Product' : 'Add to Inventory'}
                                </button>
                                {editingProdId && (
                                    <button
                                        type="button"
                                        onClick={() => { setEditingProdId(null); setProdForm({ name: '', brand: BRANDS[0], category: CATEGORIES[0], price: '', status: 'In Stock', image: '', description: '' }); }}
                                        className="px-8 text-center text-xs uppercase tracking-widest text-red-500 border border-red-200 hover:bg-red-50"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Product List */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] text-gray-400 uppercase tracking-widest border-b">
                                <tr>
                                    <th className="py-3 px-4">Image</th>
                                    <th className="py-3 px-4">Product</th>
                                    <th className="py-3 px-4">Brand</th>
                                    <th className="py-3 px-4">Price</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 w-16">
                                            <img src={p.image} alt="" className="w-10 h-10 object-cover rounded" />
                                        </td>
                                        <td className="py-4 px-4 font-medium">{p.name}</td>
                                        <td className="py-4 px-4">{p.brand}</td>
                                        <td className="py-4 px-4">₹{p.price}</td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${p.status === 'In Stock' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            <span className="text-xs uppercase tracking-wider text-gray-600">{p.status}</span>
                                        </td>
                                        <td className="py-4 px-4 text-right space-x-4">
                                            <button onClick={() => handleEditProduct(p)} className="text-[10px] uppercase font-bold tracking-widest hover:underline">Edit</button>
                                            <button onClick={() => deleteProduct(p.id)} className="text-[10px] uppercase font-bold tracking-widest text-red-600 hover:text-red-800">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'services' && (
                <div>
                    {/* Service Form */}
                    <div className="bg-parlour-bg p-6 mb-12 border border-parlour-primary/10 rounded-lg">
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-parlour-primary/10 pb-2 text-parlour-primary">
                            {editingServId ? 'Edit Service' : 'Add New Service'}
                        </h2>
                        <form onSubmit={handleServiceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <input
                                    className="w-full border-b border-gray-300 p-2 bg-transparent outline-none focus:border-parlour-primary transition-colors"
                                    placeholder="Service Title"
                                    value={servForm.title}
                                    onChange={e => setServForm({ ...servForm, title: e.target.value })}
                                    required
                                />
                            </div>

                            <ImageUpload
                                label="Service Image"
                                value={servForm.image}
                                onChange={(val) => setServForm({ ...servForm, image: val })}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    className="border-b border-gray-300 p-2 bg-transparent outline-none focus:border-parlour-primary transition-colors"
                                    placeholder="Price (INR)"
                                    type="number"
                                    value={servForm.price}
                                    onChange={e => setServForm({ ...servForm, price: e.target.value })}
                                    required
                                />
                                <input
                                    className="border-b border-gray-300 p-2 bg-transparent outline-none focus:border-parlour-primary transition-colors"
                                    placeholder="Duration (e.g. 60 min)"
                                    value={servForm.duration}
                                    onChange={e => setServForm({ ...servForm, duration: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="md:col-span-2 mt-4 flex gap-4">
                                <button type="submit" className="flex-1 bg-parlour-primary text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-opacity-90 transition-colors">
                                    {editingServId ? 'Update Service' : 'Add Service'}
                                </button>
                                {editingServId && (
                                    <button
                                        type="button"
                                        onClick={() => { setEditingServId(null); setServForm({ title: '', price: '', duration: '', image: '' }); }}
                                        className="px-8 text-center text-xs uppercase tracking-widest text-red-500 border border-red-200 hover:bg-red-50"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Service List */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] text-gray-400 uppercase tracking-widest border-b">
                                <tr>
                                    <th className="py-3 px-4">Image</th>
                                    <th className="py-3 px-4">Service Title</th>
                                    <th className="py-3 px-4">Price</th>
                                    <th className="py-3 px-4">Duration</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map(s => (
                                    <tr key={s.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 w-16">
                                            <img src={s.image} alt="" className="w-10 h-10 object-cover rounded" />
                                        </td>
                                        <td className="py-4 px-4 font-medium font-cormorant italic text-lg text-parlour-primary">{s.title}</td>
                                        <td className="py-4 px-4">₹{s.price}</td>
                                        <td className="py-4 px-4 text-gray-500">{s.duration}</td>
                                        <td className="py-4 px-4 text-right space-x-4">
                                            <button onClick={() => handleEditService(s)} className="text-[10px] uppercase font-bold tracking-widest hover:underline text-parlour-primary">Edit</button>
                                            <button onClick={() => deleteService(s.id)} className="text-[10px] uppercase font-bold tracking-widest text-red-600 hover:text-red-800">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'appointments' && (
                <div>
                    {appointments.length === 0 ? (
                        <div className="text-center py-20 text-gray-400 text-xs uppercase tracking-widest">
                            No active appointment requests
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {appointments.map(apt => (
                                <div key={apt.id} className="bg-white p-6 border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm font-bold">{apt.service}</span>
                                            <span className={`text-[10px] px-2 py-1 uppercase tracking-widest ${apt.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                apt.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>{apt.status}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 space-y-1">
                                            <p>Requested by: {apt.userName} ({apt.userId})</p>
                                            <p>Date: {apt.date} at {apt.time}</p>
                                            {apt.notes && <p className="italic">Note: "{apt.notes}"</p>}
                                            <p>ID: {apt.id}</p>
                                        </div>
                                    </div>

                                    {apt.status === 'Pending' && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => updateStatus(apt.id, 'Approved')}
                                                className="bg-black text-white px-4 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-gray-800"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(apt.id, 'Rejected')}
                                                className="border border-red-200 text-red-600 px-4 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-red-50"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
export default AdminDashboard;
