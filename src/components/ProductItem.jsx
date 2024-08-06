import React from 'react';
import { Link } from 'react-router-dom';
import numberFormatter from '../utils/numberFormatter';
import { Package2, ShoppingBag } from 'lucide-react';
import { FilledStar, EmptyStar } from './Star';

const ProductItem = ({ product }) => {
    const totalNumberOfRaters = product.delieveredBuyers.length > 0 ? product.delieveredBuyers.filter((buyer)=> buyer?.userRating > 0).length :0 ;
    
    const renderStars = () => {
        const stars = [];
        const rating = product.rating;

        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FilledStar key={i} className="w-4 h-4 text-yellow-400" />);
            } else {
                stars.push(<EmptyStar key={i} className="w-4 h-4 text-gray-300 dark:text-gray-600" />);
            }
        }

        return stars;
    };

    return (
        <div className="group">
            <Link to={`/products/${product._id}`} className="block">
                <div className="bg-white dark:bg-gray-800 group-hover:bg-gray-950 rounded-xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl">
                    <div className="relative">
                        {product.images ? (
                            <img src={product.images[0]} alt={product.productName} className="w-full h-64 bg-black object-cover transition-transform duration-300 group-hover:scale-110" />
                        ) : (
                            <div className="flex justify-center items-center w-full h-64 bg-gray-200 dark:bg-gray-700 transition-colors duration-300 group-hover:bg-gray-300 dark:group-hover:bg-gray-600">
                                <Package2 className='w-24 h-24 text-gray-400 dark:text-gray-500' />
                            </div>
                        )}
                        <div className="absolute top-2 right-2 bg-primary-light dark:bg-primary-dark text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            {product.category}
                        </div>
                    </div>
                    <div className="p-5 space-y-3">
                        <h2 className="font-bold text-xl text-gray-800 dark:text-gray-200 truncate transition-colors duration-300">
                            {product.productName}
                        </h2>
                        <div className="flex flex-wrap justify-between items-center">
                            <span className="text-2xl font-bold text-accent-light dark:text-accent-dark">
                                Rs {numberFormatter(product.price)}
                            </span>
                            <div className="flex items-center space-x-1">
                                {renderStars()}
                                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">({product.delieveredBuyers.filter((buyer)=> buyer.userRating).length})</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Available:</span>
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-semibold px-3 py-1 rounded-full">
                                {numberFormatter(product.availableQuantity)}
                            </span>
                        </div>
                    </div>
                    <div className="p-4 pt-0 transition-colors duration-300">
                        <button className="w-full bg-accent-light dark:bg-accent-dark hover:bg-accent-dark dark:hover:bg-accent-light text-white py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-300 hover:bg-opacity-90">
                            <ShoppingBag className="w-5 h-5" />
                            <span>Buy Now</span>
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductItem;