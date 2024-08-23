import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addAlert } from '../redux-slices/alertsSlice';
import { verifyToken } from '../redux-slices/authSlice';

const UserRating = ({ setProduct,productId, rating, changeRating }) => {
    const dispatch = useDispatch();
    const [hover, setHover] = useState(0);

    const handleRating = async () => {
        try {
            const options = {
                method: 'POST', body: JSON.stringify({
                    "productId": productId,
                    "rating": rating
                })
            };

            const response = await dispatch(verifyToken('/products/rateProduct', options));
            // catch server error
            if (!response.ok && response.status === 500) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            if (data.success) {
                setProduct(data.product)
                dispatch(addAlert({ message: data.message, type: "success" }));
            } else {
                dispatch(addAlert({ message: data.message, type: "warning" }));
            }
        } catch (error) {
            dispatch(addAlert({ message: error.message, type: "error" }));
        }
    }

    const getStarColor = (starPosition) => {
        if (hover >= starPosition) {
            return 'text-gray-300 fill-gray-300'; // Hover color
        } else if (rating >= starPosition) {
            return 'text-yellow-400 fill-yellow-400'; // Rated color
        }
        return 'text-gray-300 dark:text-gray-600'; // Empty color
    };
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">
                {rating ? `Your Rating: ${rating} ${rating === 1 ? 'Star' : 'Stars'}` : 'Rate This Product'}
            </h3>
            <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-8 h-8 cursor-pointer transition-colors ${getStarColor(star)}`}
                        onClick={() => changeRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                    />
                ))}
            </div>
            <button
                onClick={handleRating}
                className="w-full bg-primary-light hover:bg-primary-dark dark:hover:bg-primary-light dark:bg-primary-dark  text-white font-bold py-2 px-4 rounded transition duration-300"
            >
                Rate
            </button>
        </div>
    );
};

export default UserRating;