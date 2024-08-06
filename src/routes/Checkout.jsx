import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import numberFormatter from '../utils/numberFormatter';
import { ArrowLeft, Package2, ShoppingBag } from 'lucide-react';
import { addAlert } from '../redux-slices/alertsSlice';
import { updateCart, updateOrder } from '../redux-slices/userInfoSlice';
import { verifyToken } from '../redux-slices/authSlice';
import LoadingPage from '../LoadingPage';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const checkoutItems = useSelector((state) => state.checkout.checkoutItems);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = checkoutItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleOrderCart = async () => {
    try {
    setError('');
    setLoading(true)
      const options = {
        method: 'POST',
        body: JSON.stringify({
          orders: checkoutItems.map((item) => item.cartId),
        }),
      };
      const response = await dispatch(verifyToken('/products/orderCart', options));
      const data = await response.json();
      if (data.success) {
        dispatch(addAlert({ message: data.message, type: 'success' }));
        dispatch(updateOrder({ orders: data.orders }));
        dispatch(updateCart({ cart: [] }));
        navigate('/');
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

  if (loading) {
    return <LoadingPage msg="Ordering Your Cart" />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="text-3xl text-text-light dark:text-text-dark text-center font-extrabold">
          First, go through
          <Link to="/my-cart" className="ml-2 text-primary-light dark:text-primary-dark hover:underline transition duration-300">
            My Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:px-4 py-8 min-h-full">
      <h1 className="text-center text-4xl font-extrabold text-text-light dark:text-text-dark mb-4 bg-background-light dark:bg-background-dark rounded-lg p-2">
        Checkout Bill
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-text-light dark:text-text-dark">
              <tr>
                <th className="hidden sm:table-cell sm:px-6 px-1 sm:py-3 py-1 font-medium">Image</th>
                <th className="sm:px-6 px-1 sm:py-3 py-1 font-medium">Product</th>
                <th className="hidden md:table-cell sm:px-6 px-1 sm:py-3 py-1 font-medium">Category</th>
                <th className="sm:px-6 px-1 sm:py-3 py-1 font-medium">Quantity</th>
                <th className="sm:px-6 px-1 sm:py-3 py-1 font-medium">Price</th>
                <th className="hidden sm:table-cell sm:px-6 px-1 sm:py-3 py-1 font-medium">Seller</th>
                <th className="sm:px-6 px-1 sm:py-3 py-1 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="text-center text-text-light dark:text-text-dark">
              {checkoutItems.map((item) => (
                <tr key={item._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <td className="hidden sm:table-cell sm:px-6 px-1 sm:py-3 py-2">
                    {item.image ? (
                      <img src={item.image} alt={item.productName} className="mx-auto bg-black size-12 object-cover rounded-md" />
                    ) : (
                      <Package2 className="mx-auto size-12 rounded-lg p-2 bg-gray-300 dark:bg-gray-600" />
                    )}
                  </td>
                  <td className="text-nowrap sm:px-6 px-1 sm:py-3 py-2 max-w-[100px] overflow-x-hidden text-ellipsis whitespace-nowrap">
                    {item.productName}
                  </td>
                  <td className="text-nowrap hidden md:table-cell sm:px-6 px-1 sm:py-3 py-2">{item.category}</td>
                  <td className="text-nowrap sm:px-6 px-1 sm:py-3 py-2">{numberFormatter(item.quantity)}</td>
                  <td className="text-nowrap sm:px-6 px-1 sm:py-3 py-2">Rs {numberFormatter(item.price)}</td>
                  <td className="text-nowrap hidden sm:table-cell sm:px-6 px-1 sm:py-3 py-2">{item.email}</td>
                  <td className="text-nowrap sm:px-6 px-1 sm:py-3 py-2">Rs {numberFormatter(item.quantity * item.price)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 dark:bg-gray-700 font-semibold text-text-light dark:text-text-dark">
              <tr>
                <th className="px-4 py-2">Total</th>
                <th className="hidden sm:table-cell px-4 py-2"></th>
                <th className="px-4 py-2"></th>
                <th className="px-4 py-2"></th>
                <th className="hidden sm:table-cell px-4 py-2"></th>
                <th className="hidden md:table-cell px-4 py-2"></th>
                <th className="px-4 py-2 text-nowrap">Rs {numberFormatter(totalAmount)}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div className="mt-8 text-center flex gap-8 justify-center items-center">
        <Link to="/my-cart" className="px-6 py-3 text-white bg-secondary-light dark:bg-secondary-dark rounded-md flex items-center gap-3 hover:bg-opacity-90 transition duration-300">
          <ArrowLeft size={20} />
          My Cart
        </Link>
        <button
          onClick={handleOrderCart}
          disabled={checkoutItems.length <= 0}
          className="bg-accent-light dark:bg-accent-dark text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Order Now
          <ShoppingBag size={20} />
        </button>
      </div>
    </div>
  );
};

export default Checkout;
