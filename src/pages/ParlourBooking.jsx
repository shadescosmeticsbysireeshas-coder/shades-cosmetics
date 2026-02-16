import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppointment } from '../context/AppointmentContext';
import { useService } from '../context/ServiceContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';

const ParlourBooking = () => {
    const { user } = useAuth();
    const { bookAppointment } = useAppointment();
    const { services } = useService();
    const navigate = useNavigate();
    const location = useLocation();

    // Default to first service if available, else empty
    const [form, setForm] = useState({
        service: services.length > 0 ? services[0].title : '',
        date: '',
        time: '',
        notes: ''
    });

    // Update form default when services load
    useEffect(() => {
        if (services.length > 0 && !form.service) {
            setForm(prev => ({ ...prev, service: services[0].title }));
        }
    }, [services]);

    // Enforce Authentication
    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: location } });
        }
    }, [user, navigate, location]);

    if (!user) return null; // Prevent rendering form is redirecting

    const handleSubmit = (e) => {
        e.preventDefault();

        const apt = bookAppointment({
            userId: user.id || user.phone,
            userName: user.name || user.phone,
            ...form
        });

        alert(`Appointment Request Sent! ID: ${apt.id}`);
        navigate('/parlour');
    };

    return (
        <div className="max-w-xl mx-auto py-12">
            <h1 className="text-4xl font-cormorant italic font-light text-center mb-2">Book Your Visit</h1>
            <p className="text-center text-xs uppercase tracking-widest opacity-60 mb-12">Reserve your moment of tranquility</p>

            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 shadow-sm border border-parlour-primary/5 space-y-8 rounded-lg">
                <div>
                    <label className="block text-xs uppercase tracking-widest mb-3 opacity-60">Select Service</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map(s => (
                            <label key={s.id} className={`border p-4 cursor-pointer transition-all ${form.service === s.title ? 'border-parlour-primary bg-parlour-primary text-white' : 'border-gray-100 hover:border-parlour-primary/30'}`}>
                                <input
                                    type="radio"
                                    name="service"
                                    value={s.title}
                                    className="hidden"
                                    checked={form.service === s.title}
                                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                                />
                                <span className="block font-cormorant text-lg italic mb-1">{s.title}</span>
                                <span className="block text-[10px] uppercase font-bold tracking-widest opacity-70">₹{s.price}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest mb-3 opacity-60">Available Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full border-b border-gray-200 py-2 outline-none focus:border-parlour-primary bg-transparent font-light"
                                required
                                value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })}
                            />
                            <Calendar className="w-4 h-4 absolute right-0 top-2 opacity-30 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest mb-3 opacity-60">Preferred Time</label>
                        <div className="relative">
                            <select
                                className="w-full border-b border-gray-200 py-2 outline-none focus:border-parlour-primary bg-transparent font-light appearance-none"
                                required
                                value={form.time}
                                onChange={e => setForm({ ...form, time: e.target.value })}
                            >
                                <option value="">Select Time</option>
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="11:00 AM">11:00 AM</option>
                                <option value="12:00 PM">12:00 PM</option>
                                <option value="02:00 PM">02:00 PM</option>
                                <option value="03:00 PM">03:00 PM</option>
                                <option value="04:00 PM">04:00 PM</option>
                                <option value="05:00 PM">05:00 PM</option>
                            </select>
                            <Clock className="w-4 h-4 absolute right-0 top-2 opacity-30 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-widest mb-3 opacity-60">Special Requests</label>
                    <textarea
                        className="w-full border border-gray-200 p-4 outline-none focus:border-parlour-primary bg-transparent font-light min-h-[100px]"
                        placeholder="Any allergies or specific preferences?"
                        value={form.notes}
                        onChange={e => setForm({ ...form, notes: e.target.value })}
                    ></textarea>
                </div>

                <button type="submit" className="w-full bg-parlour-primary text-white py-4 uppercase text-xs tracking-[0.2em] hover:bg-opacity-90 transition-all">
                    Confirm Booking
                </button>
            </form>
        </div>
    );
};

export default ParlourBooking;
