import { Outlet, Link } from 'react-router-dom';
import { Sparkles, Calendar, User, AlignLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandSwitcher from './BrandSwitcher';

const ParlourLayout = () => {
    const { user } = useAuth();
    return (
        <div className="min-h-screen bg-parlour-bg font-sans text-parlour-primary font-light">
            {/* Parlour Navbar */}
            <nav className="py-6 px-4 md:px-8 border-b border-parlour-primary/10 flex justify-between items-center bg-parlour-bg/80 backdrop-blur sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button className="md:hidden"><AlignLeft className="w-6 h-6" /></button>
                    <div className="flex items-center">
                        <BrandSwitcher />
                        <Link to="/parlour" className="text-2xl font-cormorant italic font-bold">Sireeshas</Link>
                    </div>
                </div>

                <div className="hidden md:flex gap-8 text-xs uppercase tracking-[0.15em]">
                    <Link to="/parlour" className="hover:text-parlour-accent transition-colors">Services</Link>
                    <Link to="/parlour/gallery" className="hover:text-parlour-accent transition-colors">Gallery</Link>
                    <Link to="/parlour/about" className="hover:text-parlour-accent transition-colors">About Us</Link>
                    <Link to="/" className="opacity-50 hover:opacity-100">Back to Portal</Link>
                </div>

                <div className="flex items-center gap-6">
                    <Link to="/parlour/book" className="hidden md:block bg-parlour-primary text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-opacity-90 transition-all">
                        Book Now
                    </Link>
                    <Link to={user ? "/profile" : "/login"}>
                        <User className="w-5 h-5 hover:text-parlour-accent cursor-pointer transition-colors" />
                    </Link>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>

            <footer className="bg-parlour-primary text-parlour-bg py-12 text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-4 opacity-50" />
                <h2 className="font-cormorant text-2xl italic mb-4">Sireeshas</h2>
                <p className="text-xs uppercase tracking-widest opacity-60 mb-8">Luxury Services • Expert Care • Relaxing Ambience</p>
                <p className="text-[10px] opacity-40">&copy; 2026 SIREESHAS</p>
            </footer>
        </div>
    );
};

export default ParlourLayout;
