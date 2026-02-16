import { Link, useLocation } from 'react-router-dom';
import { Grid, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const BrandSwitcher = () => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const location = useLocation();

    const isParlour = location.pathname.includes('parlour');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Styles based on context
    const buttonClass = isParlour
        ? "text-parlour-primary hover:text-parlour-accent"
        : "text-shop-text hover:text-shop-accent";

    const dropdownBg = isParlour ? "bg-white" : "bg-white"; // Both white for simplicity/cleanliness
    const dropdownText = "text-black";

    return (
        <div className="relative mr-4" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 p-1 transition-colors ${buttonClass}`}
            >
                <Grid className="w-5 h-5" />
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute top-full left-0 mt-2 w-48 ${dropdownBg} shadow-xl border border-gray-100 rounded-lg p-2 z-[100]`}>
                    <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-gray-400">Switch Brand</p>
                    <Link
                        to="/shop"
                        onClick={() => setIsOpen(false)}
                        className={`block px-3 py-3 text-sm hover:bg-gray-50 rounded transition-colors ${!isParlour ? 'font-bold bg-gray-50' : 'font-medium'} ${dropdownText}`}
                    >
                        Shades Cosmetics
                    </Link>
                    <Link
                        to="/parlour"
                        onClick={() => setIsOpen(false)}
                        className={`block px-3 py-3 text-sm hover:bg-gray-50 rounded transition-colors ${isParlour ? 'font-bold bg-gray-50' : 'font-medium'} ${dropdownText}`}
                    >
                        Sireeshas Parlour
                    </Link>
                </div>
            )}
        </div>
    );
};

export default BrandSwitcher;
