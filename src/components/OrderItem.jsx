import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAlert } from '../redux-slices/alertsSlice';
import { verifyToken } from '../redux-slices/authSlice';
import formatDate from '../utils/dateFormatter';
import numberFormatter from '../utils/numberFormatter';
import { Calendar, DollarSign, Package2, Truck } from 'lucide-react';
import { updateOrder } from '../redux-slices/userInfoSlice';

const OrderItem = ({ order }) => {
  const dispatch = useDispatch();
  const [orderItem, setOrderItem] = useState({
    products: [],
    totalAmount: order.totalAmount,
    orderStatus: order.orderStatus,
    orderDate: order.orderDate
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const productPromises = order.items.map(async (item) => {
          const response = await dispatch(verifyToken(`/products/${item.productId}`));
          if (!response.ok && response.status === 500) {
            throw new Error(`${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          if (data.success) {
            return { valid: true, ...data.product, quantity: item.quantity };
          } else {
            return { valid: false, message: data.message };
          }
        });

        const products = await Promise.all(productPromises);
        setOrderItem((prev) => ({
          ...prev,
          products: products
        }));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [order.items, dispatch]);

  const handleCancelOrder = async () => {
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({ "cancelOrders": [order._id] })
      };
      const response = await dispatch(verifyToken(`/products/cancelOrders`, options));
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        dispatch(addAlert({ message: data.message, type: "success" }));
        dispatch(updateOrder({ orders: data.orders }));
      } else {
        dispatch(addAlert({ message: data.message, type: "warning" }));
      }
    } catch (error) {
      dispatch(addAlert({ message: error.message, type: "error" }));
      setError(error.message);
    }
  };

  if (loading) {
    return <div className='dark:text-white text-black animate-pulse'>Loading...</div>;
  }

  if (error) {
    return <div className='text-red-500 dark:text-red-400 mb-4'>{error}</div>;
  }

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300'>
      <div className='p-2 sm:p-6'>
        <div className='flex items-center justify-between mb-2 sm:mb-4'>
          <h2 className='text-xl font-bold text-gray-800 dark:text-white text-nowrap'>Order Id : {order._id}</h2>
          {order.orderStatus === 'Pending' && (
            <button
              onClick={handleCancelOrder}
              className='bg-secondary-light dark:bg-secondary-dark text-white font-bold py-2 px-4 text-nowrap rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg'
            >
              Cancel Order
            </button>
          )}
        </div>

        <ul className='space-y-4'>
          {orderItem.products.map((product) => (
            product.valid ? (
              <li key={product._id} className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                <div className='flex items-start space-x-4 mb-4 md:mb-0'>
                  {product?.image ? (
                    <img src={product.image} alt={product.productName} className='w-24 h-24 object-cover rounded-md' />
                  ) : (
                    <div className="w-24 h-24 border-2 border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <Package2 className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h3 className='font-bold text-lg text-gray-800 dark:text-white'>{product.productName}</h3>
                    <p className='text-sm text-gray-600 dark:text-gray-300'>Seller: {product.email}</p>
                    <div className='mt-2 flex items-center'>
                      <span className='text-sm text-gray-600 dark:text-gray-300 mr-2'>Quantity:</span>
                      <span className='font-semibold text-gray-800 dark:text-white'>{numberFormatter(product.quantity)}</span>
                    </div>
                  </div>
                </div>
                <div className='text-left md:text-right'>
                  <p className='text-lg font-bold text-green-600 dark:text-green-400'>
                    Rs {numberFormatter(product.price * product.quantity)}
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Rs {numberFormatter(product.price)} each
                  </p>
                </div>
              </li>
            ) : null
          ))}
        </ul>

        <div>
          {orderItem.products.some(product => !product.valid) && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded-lg">
              <h4 className="text-red-700 dark:text-red-300 font-bold mb-2">Errors:</h4>
              <ul className="list-disc pl-5">
                {orderItem.products.map((product, index) => (
                  !product.valid && (
                    <li key={index} className="text-red-600 dark:text-red-400">{product.message}</li>
                  )
                ))}
              </ul>
            </div>
          )}

          <div className='bg-gray-100 dark:bg-gray-700 p-6 mt-4'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-end justify-between'>
                <span className='text-gray-700 dark:text-gray-300 flex items-center'>
                  <DollarSign className="w-5 h-5 mr-2" />
                  Total:
                </span>
                <span className='text-2xl font-bold text-green-600 dark:text-green-400'>
                  Rs {numberFormatter(order.totalAmount)}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-gray-700 dark:text-gray-300 flex items-center'>
                  <Truck className="w-5 h-5 mr-2" />
                  Status:
                </span>
                <span className={`font-semibold ${
                  order.orderStatus === "Pending" ? "text-yellow-500" :
                  order.orderStatus === "Cancelled" ? "text-secondary-light dark:text-red-400" :
                  "text-green-500"
                }`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-gray-700 dark:text-gray-300 flex items-center'>
                  <Calendar className="w-5 h-5 mr-2" />
                  Ordered Date:
                </span>
                <span className='text-gray-800 dark:text-gray-200'>
                  {formatDate(order.orderDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;