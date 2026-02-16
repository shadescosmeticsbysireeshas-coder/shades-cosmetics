import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { BRANDS, CATEGORIES } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { Filter } from 'lucide-react';

const Shop = () => {
    const { products } = useShop();
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    // Filtering
    const filteredProducts = products.filter(p => {
        const brandMatch = selectedBrand === 'All' || p.brand === selectedBrand;
        const catMatch = selectedCategory === 'All' || p.category === selectedCategory;
        return brandMatch && catMatch;
    });

    return (
        <div className="flex flex-col md:flex-row gap-8 pt-8">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden flex justify-between items-center mb-4">
                <span className="text-xs uppercase font-bold tracking-widest">{filteredProducts.length} Products</span>
                <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-xs uppercase font-bold">
                    <Filter className="w-4 h-4" /> Filter
                </button>
            </div>

            {/* Sidebar Filters */}
            <aside className={`w-full md:w-64 space-y-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 pb-2 border-b">Categories</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className={`hover:text-black hover:underline ${selectedCategory === 'All' ? 'text-black font-bold' : ''}`}
                            >
                                All Categories
                            </button>
                        </li>
                        {CATEGORIES.map(c => (
                            <li key={c}>
                                <button
                                    onClick={() => setSelectedCategory(c)}
                                    className={`hover:text-black hover:underline text-left ${selectedCategory === c ? 'text-black font-bold' : ''}`}
                                >
                                    {c}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 pb-2 border-b">Brands</h3>
                    <ul className="space-y-2 text-sm text-gray-600 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        <li>
                            <button
                                onClick={() => setSelectedBrand('All')}
                                className={`hover:text-black hover:underline ${selectedBrand === 'All' ? 'text-black font-bold' : ''}`}
                            >
                                All Brands
                            </button>
                        </li>
                        {BRANDS.map(b => (
                            <li key={b}>
                                <button
                                    onClick={() => setSelectedBrand(b)}
                                    className={`hover:text-black hover:underline text-left ${selectedBrand === b ? 'text-black font-bold' : ''}`}
                                >
                                    {b}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
                <div className="hidden md:flex justify-between items-center mb-6">
                    <h1 className="text-xl font-light uppercase tracking-widest">Shop Collection</h1>
                    <span className="text-xs text-gray-500 uppercase tracking-widest">{filteredProducts.length} Results</span>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                        {filteredProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-sm uppercase tracking-widest">No products found matching your selection.</p>
                        <button
                            onClick={() => { setSelectedBrand('All'); setSelectedCategory('All'); }}
                            className="mt-4 text-black underline text-xs uppercase font-bold"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Shop;
