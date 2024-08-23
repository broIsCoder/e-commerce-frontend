import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { verifyToken } from '../redux-slices/authSlice';

function CategorySelector({ setSelectedCategory, selectedCategory }) {
    const dispatch = useDispatch();
    const [allowedCategories, setAllowedCategories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const getAllowedCategories = async () => {
            try {
                const options = {
                    method: 'GET',
                };
                const response = await dispatch(verifyToken("/employee/getAllowedCategory", options));
                const data = await response.json();
                if (data.success) {
                    setAllowedCategories(data.categories);
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError(error.message);
            }
        };
        getAllowedCategories();
    }, [dispatch]);

    return (
        <div className="my-4">
            <div className="flex items-center justify-between mb-2">
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Category
                </label>
                <div className="flex gap-2">
                    {selectedCategory &&
                        <button type="button" className="px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none bg-red-500 dark:bg-red-800" onClick={() => { setSelectedCategory('') }}>Clear</button>
                    }
                    {selectedCategory &&
                        <button type="button" className="px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none bg-accent-light dark:bg-accent-dark" onClick={() => { setSelectedCategory('General') }}>Reset</button>
                    }
                </div>
            </div>
            {allowedCategories.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                    {allowedCategories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none 
                                ${selectedCategory.includes(category)
                                    ? 'bg-primary-light dark:bg-primary-dark text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}
                            `}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-sm text-red-500">{error || 'No categories available.'}</div>
            )}
        </div>
    );
}

export default CategorySelector;
