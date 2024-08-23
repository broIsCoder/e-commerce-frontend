import React from 'react'
import { Link } from 'react-router-dom'
import { FilledStar, EmptyStar } from './Star';
import numberFormatter from '../utils/numberFormatter';

const SearchProductItem = ({ product }) => {
    const renderStars = () => {
        const stars = [];
        const rating = product.rating;

        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? <FilledStar key={i} /> : <EmptyStar key={i} />);
        }

        return stars;
    };
    return (
        <Link to={`/products/${product._id}`}>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-2 sm:p-4 transition-all duration-300 hover:shadow-xl animate-fadeInUp">
                <div className="flex flex-col space-y-2 sm:space-y-4">
                    <div className="flex space-x-4">
                        <div className="w-24 h-24 flex-shrink-0">
                            {product.images.length > 0 ? (
                                <img src={product.images[0]} alt={product.productName} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <div className="flex justify-center items-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg">
                                    <Package2 className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                                </div>
                            )}
                        </div>
                        <div className="flex-grow min-w-0">
                            <h2 className="hover:underline text-lg font-bold text-text-light dark:text-text-dark truncate">
                                {product.productName}
                            </h2>
                            <span className="text-nowrap bg-primary-light dark:bg-primary-dark text-white text-xs font-bold px-3 py-1 rounded-full">
                                {product.category}
                            </span>
                            <div className="flex items-center space-x-1 mt-1">
                                {renderStars()}
                                <span className="text-xs text-gray-600 dark:text-gray-400">({product.rating})</span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Available: {numberFormatter(product.availableQuantity)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Price : Rs {numberFormatter(product.price)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default SearchProductItem