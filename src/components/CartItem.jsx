import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { verifyToken } from '../redux-slices/authSlice';
import { Minus, Package2, Plus, Trash } from 'lucide-react';
import { FilledStar, EmptyStar } from './Star';
import { addAlert } from '../redux-slices/alertsSlice';
import numberFormatter from '../utils/numberFormatter';
import { removeFromCart, updateCart } from '../redux-slices/userInfoSlice';
import { setcheckoutItem } from '../redux-slices/checkoutSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
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
          dispatch(setcheckoutItem({ checkoutItem:cartItem }));
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
        updateCart({cart:data.cart})
        setcheckoutItem({checkoutItem:data.cart})
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
        dispatch(updateCart({ cart: data.cart}))
        dispatch(setcheckoutItem({checkoutItem:data.cart}))
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

  const handleDecrement = useCallback(() => {
    const newQuantity = cartQuantity - 1;
    if (newQuantity > 0) {
      setCartQuantity(newQuantity);
      editCartItem(newQuantity);
    }
  }, [cartQuantity]);

  const handleIncrement = useCallback(() => {
    const newQuantity = cartQuantity + 1;
    if (newQuantity <= product.availableQuantity) {
      setCartQuantity(newQuantity);
      editCartItem(newQuantity);
    }
  }, [cartQuantity, product?.availableQuantity]);

  const renderStars = useCallback(() => {
    const stars = [];
    const rating = product.rating;

    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? <FilledStar key={i} /> : <EmptyStar key={i} />);
    }

    return stars;
  }, [product?.rating]);

  if (loading) return <div className='dark:text-white text-black animate-pulse'>Loading...</div>;
  if (error) return <div className='dark:text-white text-red-500'>Error: {error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
        <div className="flex-shrink-0">
          {product.image ? (
            <img src={product.image} alt="Product" className="w-full md:w-48 h-48 object-cover rounded-lg" />
          ) : (
            <div className="w-full md:w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Package2 className="h-20 w-20 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>
        <div className="flex-grow space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{product.productName}</h2>
              <span className="inline-block bg-primary-light dark:bg-primary-dark text-white text-sm px-3 py-1 rounded-full mt-2">
                {product.category}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {renderStars()}
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">({product.rating})</span>
          </div>
          <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Rs {numberFormatter(product.price)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{product.email}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Available: {numberFormatter(product.availableQuantity)}
          </div>
        </div>
        <div className="flex md:flex-col justify-between items-end space-y-4">
          <button onClick={deleteCartItem} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-300 hover:bg-gray-400 p-4 rounded-full transition-colors duration-200">
            <Trash className="w-6 h-6" />
          </button>
          <div className='space-y-2 text-right'>
            <div className="inline-flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={handleDecrement}
                disabled={cartQuantity <= 1}
                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 text-center max-w-60">{editLoading ? '...' : numberFormatter(cartQuantity)}</span>
              <button
                onClick={handleIncrement}
                disabled={cartQuantity >= product.availableQuantity}
                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              Rs {numberFormatter(cartQuantity * product.price)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
