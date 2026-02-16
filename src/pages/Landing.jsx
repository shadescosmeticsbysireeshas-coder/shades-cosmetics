import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles } from 'lucide-react';

const Landing = () => {
    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Parlour Half */}
            <div className="flex-1 bg-[#FFF0F5] flex flex-col justify-center items-center text-[#2F4F4F] relative group overflow-hidden transition-all duration-500 hover:flex-[1.2]">
                <div className="relative z-10 text-center p-8">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-80" />
                    <h2 className="text-4xl md:text-5xl font-['Cormorant_Garamond'] mb-4 italic">Sireeshas</h2>
                    <p className="text-sm uppercase tracking-widest mb-8 opacity-80">Luxury Services & Pampering</p>
                    <Link
                        to="/parlour"
                        className="border border-[#2F4F4F] px-8 py-3 uppercase text-xs tracking-[0.2em] hover:bg-[#2F4F4F] hover:text-white transition-all"
                    >
                        Book Appointment
                    </Link>
                </div>
            </div>

            {/* Shop Half */}
            <div className="flex-1 bg-white flex flex-col justify-center items-center text-black relative group overflow-hidden transition-all duration-500 hover:flex-[1.2]">
                <div className="relative z-10 text-center p-8">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-4xl md:text-5xl font-sans font-light mb-4 uppercase tracking-tighter">The Store</h2>
                    <p className="text-sm uppercase tracking-widest mb-8 text-gray-500">Curated Beauty Essentials</p>
                    <Link
                        to="/shop"
                        className="bg-black text-white px-8 py-3 uppercase text-xs tracking-[0.2em] font-bold hover:bg-gray-800 transition-all"
                    >
                        Shop Products
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Landing;
