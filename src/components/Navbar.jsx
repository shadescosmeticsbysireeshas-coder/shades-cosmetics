import { ShoppingBag, User, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandSwitcher from './BrandSwitcher';

const Navbar = () => {
    const { user } = useAuth();
    return (
        <nav className="border-b border-shop-accent/10 py-4 sticky top-0 bg-shop-bg/90 backdrop-blur-md z-50">
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Mobile Menu */}
                <button className="md:hidden">
                    <Menu className="w-6 h-6 text-shop-text" />
                </button>

                {/* Logo with Switcher */}
                <div className="flex items-center">
                    <BrandSwitcher />
                    <Link to="/" className="text-3xl font-bold font-cormorant italic tracking-tight text-shop-text">
                        Shades <span className="text-[10px] font-sans font-light tracking-widest uppercase not-italic ml-1">Cosmetics</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex space-x-8 text-xs font-bold uppercase tracking-widest text-shop-text/80">
                    <Link to="/" className="hover:text-shop-accent transition-colors">Home</Link>
                    <Link to="/shop" className="hover:text-shop-accent transition-colors">Shop</Link>
                    <Link to="/shop" className="hover:text-shop-accent transition-colors">Brands</Link>
                    <Link to="/shop" className="hover:text-shop-accent transition-colors">New Arrivals</Link>
                </div>

                {/* Icons */}
                <div className="flex space-x-5 items-center text-shop-text">
                    <Search className="w-5 h-5 cursor-pointer hover:text-shop-accent transition-colors" />
                    <Link to={user ? "/profile" : "/login"}><User className="w-5 h-5 cursor-pointer hover:text-shop-accent transition-colors" /></Link>
                    <Link to="/checkout" className="relative cursor-pointer hover:text-shop-accent transition-colors">
                        <ShoppingBag className="w-5 h-5" />
                        <span className="absolute -top-2 -right-2 bg-shop-text text-shop-bg text-[10px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
