import React, { useState } from 'react';
import { verifyToken } from '../redux-slices/authSlice';
import { Search, X, ChevronDown } from 'lucide-react';
import { useDispatch } from 'react-redux';

const ProductSearch = () => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [products, setProducts] = useState([]);
    const [showResult, setShowResult] = useState('');
    const [count, setCount] = useState(0);
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = async (e) => {
        try {
            e.preventDefault();
            const options = {
                params: { name, category, minPrice, maxPrice },
            };
            const response = await dispatch(verifyToken('/products/search', options));
            if (!response.ok && response.status === 500) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            const data = await response.json()
            console.log(data)
            if (data.success) {
                setProducts(data.products);
                setCount(data.count)
                setShowResult(true);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const clearSearch = () => {
        setName('');
        setCategory('');
        setMinPrice('');
        setMaxPrice('');
        setProducts([]);
        setCount(0)
        setShowResult(false);
    };

    return (
        <form onSubmit={handleSearch} className="relative flex gap-2 w-full dark:text-text-dark text-text-light">
            <div className="w-full md:max-w-1/2 flex items-center bg-gray-200 dark:bg-gray-700  rounded-full">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Search products"
                    className="bg-transparent w-full mx-4 outline-none"
                />
                <button onClick={clearSearch} className="p-2.5"
                >
                    <X size={20} />
                </button>
                <button
                    type='submit'
                    className="bg-blue-200 p-3 rounded-r-full dark:bg-primary-dark"
                >
                    <Search size={20} />
                </button>
            </div>
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2.5 flex items-center transition-colors duration-200 bg-gray-200 dark:bg-gray-700  rounded-full"
            >
                Filters
                <ChevronDown className={`ml-1 transform ${showFilters ? 'rotate-180' : ''} transition-transform duration-200`} size={16} />
            </button>
            
                    <div className='absolute right-0 top-14 flex flex-col gap-2 bg-white dark:bg-gray-800 p-2'>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Category"
                            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                        />
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min Price"
                            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                        />
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Max Price"
                            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                        />
                    </div>
        </form>
    );
};

export default ProductSearch;