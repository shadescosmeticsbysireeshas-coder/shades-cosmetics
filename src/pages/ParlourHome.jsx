import { Link } from 'react-router-dom';
import { Calendar, Clock, Star } from 'lucide-react';
import { useService } from '../context/ServiceContext';

const ParlourHome = () => {
    const { services } = useService();

    return (
        <div>
            {/* Helper text for user debugging */}
            {/* <div className="bg-red-100 p-2 text-red-800 text-xs text-center mb-4 border border-red-200">
            DEBUG: Parlour Theme Active. Font: Cormorant Garamond.
        </div> */}

            <header className="text-center py-16 md:py-24">
                <h1 className="text-5xl md:text-7xl font-cormorant italic font-light mb-4 text-parlour-primary">
                    Elegance & Grace
                </h1>
                <p className="text-sm uppercase tracking-widest text-parlour-primary/70 mb-8 max-w-md mx-auto">
                    Discover our range of premium beauty treatments designed to rejuvenate your body and soul.
                </p>
                <Link to="/parlour/book" className="bg-parlour-primary text-white px-8 py-3 uppercase text-xs tracking-[0.2em] hover:bg-opacity-90 transition-all inline-flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Book Appointment
                </Link>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map(service => (
                    <div key={service.id} className="group cursor-pointer">
                        <div className="relative overflow-hidden aspect-[3/4] mb-4 bg-white rounded-t-[100px] border-b-4 border-parlour-primary/10 shadow-sm transition-all group-hover:shadow-md">
                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {service.duration}
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="font-cormorant text-2xl italic mb-1">{service.title}</h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-parlour-accent">₹{service.price}</p>
                        </div>
                    </div>
                ))}
            </section>

            <section className="mt-24 bg-white p-12 text-center rounded-2xl shadow-sm border border-parlour-primary/5">
                <Star className="w-6 h-6 text-parlour-accent mx-auto mb-4" />
                <h2 className="font-cormorant text-3xl italic mb-6">"Beauty is power, and makeup is something that really enhances that; it’s a woman’s secret."</h2>
                <p className="text-xs uppercase tracking-widest opacity-50">- Charlotte Tilbury</p>
            </section>
        </div>
    );
};

export default ParlourHome;
