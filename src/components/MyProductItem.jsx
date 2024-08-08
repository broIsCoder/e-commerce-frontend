import React from 'react';
import { Link } from 'react-router-dom';
import numberFormatter from '../utils/numberFormatter';
import { Package2 } from 'lucide-react';

const MyProductItem = ({ product }) => {
    const renderInfoRow = (label, value) => (
        <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 text-nowrap">{label}:</span>
            <span className="text-sm text-gray-800 dark:text-gray-200 truncate">{value}</span>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4">
                    <div className="mb-4">
                        {product.images ? (
                            <img src={product.images[0]} alt={product.productName} className="w-full rounded-lg h-64 bg-black object-cover" />
                        ) : (
                            <div className="flex justify-center items-center w-full h-48 bg-gray-100 dark:bg-gray-700 rounded">
                                <Package2 className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                            </div>
                        )}
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {product.productName}
                    </h2>
                    <div className="space-y-1">
                        {renderInfoRow("Price", `Rs ${numberFormatter(product.price)}`)}
                        {renderInfoRow("Category", product.category)}
                        {renderInfoRow("Available Quantity", numberFormatter(product.availableQuantity))}
                        {renderInfoRow("Quantity Sold", numberFormatter(product.productQuantitySold))}
                        {renderInfoRow("Total Revenue", `Rs ${numberFormatter(product.productTotalRevenue)}`)}
                        {renderInfoRow("Delivered Buyers", numberFormatter(product.delieveredBuyers.length))}
                        {renderInfoRow("Orders", numberFormatter(product.orders.length))}
                      
                       
                    </div>
                </div>
        </div>
    );
};

export default MyProductItem;