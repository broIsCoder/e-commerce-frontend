import React, { useEffect, useState } from 'react';
import CartItem from '../components/CartItem';
import { Link } from 'react-router-dom';
import { addAlert } from '../redux-slices/alertsSlice';
import { updateCart } from '../redux-slices/userInfoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { verifyToken } from '../redux-slices/authSlice';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import LoadingPage from '../LoadingPage'

const MyCart = () => {
  const dispatch = useDispatch();
  const userInfoCart = useSelector((state) => state.userInfo.user.cart.items)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setError('');
        setLoading(true)
        const options = { method: 'GET' };
        const response = await dispatch(verifyToken('/products/getCart', options));
        if (!response.ok && response.status === 500) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
          dispatch(updateCart({cart:data.cart.items}))
        } else {
          setError(data.message);
          dispatch(addAlert({ message: data.message, type: 'warning' }));
        }
      } catch (error) {
        setError(error.message);
        dispatch(addAlert({ message: error.message, type: 'error' }));
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) {
    return (
      <LoadingPage msg='Getting Your Cart' />
    )
  }

  if(error){
    throw new Error (error.message)
  }

  return (
    <div className="container mx-auto max-w-4xl min-h-full text-text-light dark:text-text-dark">
      {userInfoCart.length === 0 ? (
        <div className="text-center p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800">
          <ShoppingCart className="w-24 h-24 mx-auto text-gray-400 mb-6" />
          <p className="text-2xl text-gray-600 dark:text-gray-300 mb-6">Your cart is empty</p>
          <Link
            to="/"
            className="inline-block bg-primary-light dark:bg-primary-dark hover:bg-primary-dark dark:hover:bg-primary-light text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <ul className="space-y-4 mb-8">
            {userInfoCart.map((item) => (
              <li key={item._id}>
                <CartItem item={item} />
              </li>
            ))}
          </ul>
          <div className="pb-4">
            <Link
              to="/checkout"
              className="w-full bg-accent-light dark:bg-accent-dark hover:bg-accent-dark dark:hover:bg-accent-light text-white font-bold py-4 rounded-lg flex items-center justify-center transition duration-300 transform hover:scale-105"
            >
              Proceed to Checkout
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCart;