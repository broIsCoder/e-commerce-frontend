import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom'
import { addAlert } from '../redux-slices/alertsSlice';
import { verifyToken } from '../redux-slices/authSlice';
import formatDate from '../utils/dateFormatter';
import numberFormatter from '../utils/numberFormatter';
import { Calendar, DollarSign, Package2, TruckIcon, X } from 'lucide-react';
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
          return data.success
            ? { valid: true, ...data.product, quantity: item.quantity }
            : { valid: false, message: data.message };
        });

        const products = await Promise.all(productPromises);
        setOrderItem((prev) => ({ ...prev, products }));
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
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="w-1/6 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className='text-red-500 dark:text-red-400 mb-4'>{error}</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    }
  };

  return (
    <div className='bg-white dark:bg-gray-800 ease-in-out transform hover:scale-105 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl'>
      <div className='px-4 py-2 space-y-2'>
        <div className='flex items-center justify-end'>
          <div className='flex items-center space-x-2'>
            <span className={`px-2 py-1 rounded-full font-semibold ${getStatusColor(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
            {order.orderStatus === 'Pending' && (
              <button
                onClick={handleCancelOrder}
                className='bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition duration-300 ease-in-out'
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className='space-y-2'>
          {orderItem.products.map((product) => (
            product.valid && (
              <div key={product._id} className='flex items-center space-x-4 bg-gray-200 dark:bg-gray-700 p-3 rounded-lg'>
                {product?.images ? (
                  <img src={product.images[0]} alt={product.productName} className='w-16 h-16 object-cover rounded-md' />
                ) : (
                  <div className="w-16 h-16 border-2 border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <Package2 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
                <div className='flex-grow'>
                  <h3 className='hover:underline font-semibold text-gray-800 dark:text-white'>
                    <Link to={`/products/${product._id}`}>
                      {product.productName}
                    </Link></h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Qty: {numberFormatter(product.quantity)}</p>
                </div>
                <div className='text-right'>
                  <p className='font-bold text-green-600 dark:text-green-400'>
                    Rs {numberFormatter(product.price * product.quantity)}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    Rs {numberFormatter(product.price)} each
                  </p>
                </div>
              </div>
            )
          ))}
        </div>

        {orderItem.products.some(product => !product.valid) && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 rounded-lg text-sm">
            <h4 className="text-red-700 dark:text-red-300 font-semibold mb-1">Errors:</h4>
            <ul className="list-disc pl-5">
              {orderItem.products.map((product, index) => (
                !product.valid && (
                  <li key={index} className="text-red-600 dark:text-red-400">{product.message}</li>
                )
              ))}
            </ul>
          </div>
        )}

        <div className='mt-4'>
          <div className='text-sm space-y-2'>
            <div className='flex justify-between'>
              <span className='flex items-center space-x-2'>
                <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className='text-gray-700 dark:text-gray-300'>Total:</span>
              </span>
              <span className='text-right font-bold text-green-600 dark:text-green-400'>
                Rs {numberFormatter(order.totalAmount)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='flex items-center space-x-2'>
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className='text-gray-700 dark:text-gray-300'>Ordered:</span>
              </span>
              <span className='text-right text-gray-800 dark:text-gray-200 overflow-hidden text-ellipsis text-nowrap'>
                {formatDate(order.orderDate)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='flex items-center space-x-2'>
                <TruckIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className='text-gray-700 dark:text-gray-300'>Delievered:</span>
              </span>
              <span className='text-right text-gray-800 dark:text-gray-200 overflow-hidden text-ellipsis text-nowrap'>
                {order.deliveredDate ? formatDate(order.deliveredDate) : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;