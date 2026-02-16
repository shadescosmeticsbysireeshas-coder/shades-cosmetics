import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <div className="text-center py-20">
                <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-widest uppercase">
                    Artistry <br /><span className="font-bold">Undefined</span>
                </h1>
                <p className="text-sm tracking-widest uppercase text-gray-500 mb-8">
                    The New Collection | Premium Cosmetics
                </p>
                <Link to="/shop" className="inline-block bg-black text-white px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-colors">
                    Shop Now
                </Link>
            </div>
        </div>
    );
};

export default Home;
