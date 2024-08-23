import React from 'react';
import { Link } from 'react-router-dom';
import numberFormatter from '../utils/numberFormatter';
import { Package2, ShoppingBag } from 'lucide-react';
import { FilledStar, EmptyStar } from './Star';

const ProductItem = ({ product }) => {
    const totalNumberOfRaters = product.delieveredBuyers.filter(buyer => buyer?.userRating > 0).length;

    const renderStars = () => {
        const stars = [];
        const rating = product.rating;

        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? 
                <FilledStar key={i} className="w-4 h-4 text-yellow-400" /> : 
                <EmptyStar key={i} className="w-4 h-4 text-gray-300 dark:text-gray-600" />
            );
        }

        return stars;
    };

    return (
        <div className="group">
            <Link to={`/products/${product._id}`} className="block bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg">
                <div className="relative">
                    {product.images ? (
                        <img src={product.images[0]} alt={product.productName} className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                        <div className="flex justify-center items-center w-full h-48 sm:h-56 bg-gray-200 dark:bg-gray-700 transition-colors duration-300 group-hover:bg-gray-300 dark:group-hover:bg-gray-600">
                            <Package2 className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400 dark:text-gray-500" />
                        </div>
                    )}
                    <div className="absolute top-2 right-2 bg-primary-light dark:bg-primary-dark text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                        {product.category}
                    </div>
                </div>
                <div className="p-3 sm:p-4 space-y-2">
                    <h2 className="font-bold text-lg sm:text-xl text-gray-800 dark:text-gray-200 truncate">
                        {product.productName}
                    </h2>
                    <div className="flex items-center space-x-1">
                        {renderStars()}
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-1">({totalNumberOfRaters})</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 flex-wrap">
                        <span className="text-xl sm:text-2xl  text-nowrap font-bold text-accent-light dark:text-accent-dark">
                            Rs {numberFormatter(product.price)}
                        </span>
                        <div className="flex items-center text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Available:</span>
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold px-2 py-1 rounded-full ml-2">
                                {numberFormatter(product.availableQuantity)}
                            </span>
                        </div>
                    </div>
                    <button className="w-full bg-accent-light dark:bg-accent-dark text-white py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-300 hover:bg-opacity-90 mt-2">
                        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Buy Now</span>
                    </button>
                </div>
            </Link>
        </div>
    );
};

export default ProductItem;
