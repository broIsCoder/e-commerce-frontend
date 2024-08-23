import React, { useEffect, useState, useRef} from 'react';
import {Link} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { verifyToken } from '../redux-slices/authSlice';
import { Minus, Package2, Plus, Trash } from 'lucide-react';
import { FilledStar, EmptyStar } from './Star';
import { addAlert } from '../redux-slices/alertsSlice';
import numberFormatter from '../utils/numberFormatter';
import { updateCart } from '../redux-slices/userInfoSlice';
import { setcheckoutItem } from '../redux-slices/checkoutSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setError('');
        setLoading(true)
        const options = { method: 'GET' };
        const response = await dispatch(verifyToken(`/products/${item.productId}`, options));
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

        const data = await response.json();
        if (data.success) {
          const cartItem = { ...data.product, cartId: item._id, quantity: item.quantity };
          setProduct(cartItem);
          setImages(cartItem.images)
          dispatch(setcheckoutItem({ checkoutItem: cartItem }));
        } else {
          setError(data.message);
          dispatch(addAlert({ message: data.message, type: 'warning' }));
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [item, dispatch]);

  const editCartItem = async (newQuantity) => {
    try {
      setError('');
      setEditLoading(true);
      const options = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ cartId: item._id, quantity: newQuantity }] }),
      };
      const response = await dispatch(verifyToken(`/products/editCart`, options));
      if (!response.ok && response.status === 500) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        updateCart({ cart: data.cart })
        setcheckoutItem({ checkoutItem: data.cart })
        dispatch(addAlert({ message: data.message, type: 'success' }));
      } else {
        dispatch(addAlert({ message: data.message, type: 'warning' }));
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setEditLoading(false);
    }
  };

  const deleteCartItem = async () => {
    try {
      setError('');
      const options = {
        method: 'DELETE',
        body: JSON.stringify({ cartIds: [item._id] }),
      };
      const response = await dispatch(verifyToken('/products/deleteCartItems', options));
      if (!response.ok && response.status === 500) {
        throw new Error(`${response.status} ${response.statusText}`);
      };

      const data = await response.json();
      if (data.success) {
        dispatch(updateCart({ cart: data.cart }))
        dispatch(setcheckoutItem({ checkoutItem: data.cart }))
        dispatch(addAlert({ message: data.message, type: 'success' }));
      } else {
        dispatch(addAlert({ message: data.message, type: 'warning' }));
      }
    } catch (error) {
      dispatch(addAlert({ message: error.message, type: 'error' }));
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrement = () => {
    const newQuantity = cartQuantity - 1;
    if (newQuantity > 0) {
      setCartQuantity(newQuantity);
      editCartItem(newQuantity);
    }
  };

  const handleIncrement = () => {
    const newQuantity = cartQuantity + 1;
    if (newQuantity <= product.availableQuantity) {
      setCartQuantity(newQuantity);
      editCartItem(newQuantity);
    }
  };

  const renderStars = () => {
    const stars = [];
    const rating = product.rating;

    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? <FilledStar key={i} /> : <EmptyStar key={i} />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-gray-800 shadow-lg rounded-lg p-2 sm:p-4 transition-all duration-300 hover:shadow-xl animate-fadeInUp">
        <div className="flex flex-col space-y-2 sm:space-y-4">
          <div className="flex space-x-4">
            <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="flex-grow">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
            </div>
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="w-24 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="w-16 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className='dark:text-white text-red-500'>Error: {error}</div>;

  return (
    <div className="bg-background-light dark:bg-gray-700 shadow-lg rounded-lg p-2 sm:p-4 transition-all duration-300 hover:shadow-xl animate-fadeInUp">
      <div className="flex flex-col space-y-2 sm:space-y-4">
        <div className="flex space-x-4">
          <div className="w-24 h-24 flex-shrink-0">
            {images.length > 0 ? (
              <img src={images[0]} alt={product.productName} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="flex justify-center items-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg">
                <Package2 className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>

          <div className="flex-grow min-w-0">
            <h2 className="hover:underline text-lg font-bold text-text-light dark:text-text-dark truncate">
              <Link to={`/products/${product._id}`}>
                {product.productName}
              </Link></h2>
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

          {/* Price and delete button */}
          <div className="flex flex-col items-end justify-between">
            <button
              onClick={deleteCartItem}
              className="text-secondary-light hover:text-secondary-dark dark:text-secondary-dark dark:hover:text-secondary-light bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded-full transition-colors duration-200"
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="inline-flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={handleDecrement}
              disabled={cartQuantity <= 1}
              className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200 disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 py-2 text-center min-w-[40px] text-sm">{editLoading ? '...' : numberFormatter(cartQuantity)}</span>
            <button
              onClick={handleIncrement}
              disabled={cartQuantity >= product.availableQuantity}
              className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xl font-bold text-accent-light dark:text-accent-dark">
            Rs {numberFormatter(cartQuantity * product.price)}
          </div>
        </div>


      </div>
    </div>
  );
};

export default CartItem;