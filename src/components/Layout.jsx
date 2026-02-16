import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-shop-bg text-shop-text font-sans flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="bg-shop-text text-shop-bg p-8 text-center text-sm tracking-widest mt-auto font-cormorant italic">
                &copy; 2026 SIREESHAS. ALL RIGHTS RESERVED.
            </footer>
        </div>
    );
};

export default Layout;
