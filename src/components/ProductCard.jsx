import { ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useShop();

    return (
        <div className="group relative">
            <div className="relative overflow-hidden bg-white/50 aspect-[4/5] mb-4 rounded-t-3xl border border-shop-text/5 transition-all group-hover:shadow-md">
                <img
                    src={product.image || 'https://via.placeholder.com/400x500'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                {product.status === 'Out of Stock' && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="bg-shop-text text-white text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Sold Out</span>
                    </div>
                )}
                {product.status !== 'Out of Stock' && (
                    <button
                        onClick={() => addToCart(product)}
                        className="absolute bottom-0 left-0 right-0 bg-shop-text text-white p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Quick Add</span>
                    </button>
                )}
            </div>

            <div className="text-center">
                <h3 className="text-xs text-shop-accent uppercase tracking-widest mb-1 font-bold">{product.brand}</h3>
                <h2 className="text-lg font-cormorant italic tracking-wide mb-2 text-shop-text">{product.name}</h2>
                <p className="text-sm font-bold text-shop-text/80">₹{product.price.toLocaleString()}</p>
            </div>
        </div>
    );
};
export default ProductCard;
