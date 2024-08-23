import React, { useEffect, useState } from 'react';
import { verifyToken } from '../redux-slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert } from '../redux-slices/alertsSlice';
import OrderItem from '../components/OrderItem';
import { ShoppingBag, Clock, Truck, X } from 'lucide-react';
import LoadingPage from '../LoadingPage'
import { updateOrder } from '../redux-slices/userInfoSlice';

const MyOrder = () => {
  const dispatch = useDispatch();
  const [orderType, updateOrderType] = useState('');

  const orders = useSelector((state) => state.userInfo.user.orders);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setError('');
        setLoading(true)
        const options = { method: 'GET' };
        const response = await dispatch(verifyToken('/products/getOrders', options));
        if (!response.ok && response.status === 500) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
          dispatch(updateOrder({ orders: data.orders }));
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

    fetchOrder();
  }, [dispatch]);

  const filteredOrders = orders.filter((order) => {
    if (orderType === '') {
      return true;
    }
    return order.orderStatus.toLowerCase() === orderType;
  }).reverse();          // show latest order at top

  if (loading) {
    return (
      <LoadingPage msg="Getting Your Orders" />
    )
  }

  
  return (
    <div className='container mx-auto max-w-4xl min-h-full'>
      <div className='flex flex-wrap'>
        {[
          { type: 'All', icon: ShoppingBag },
          { type: 'Pending', icon: Clock },
          { type: 'Delivered', icon: Truck },
          { type: 'Cancelled', icon: X }
        ].map(({ type, icon: Icon }) => (
          <button
            key={type}
            onClick={() => updateOrderType(type === 'All' ? '' : type.toLowerCase())}
            className={`flex items-center justify-center gap-1 px-4 py-2 mx-1 mb-4 rounded-full text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 ${(orderType === '' && type === 'All') || orderType === type.toLowerCase()
                ? 'bg-primary-light dark:bg-primary-dark text-white shadow-lg'
                : 'bg-white dark:bg-gray-700 text-text-light dark:text-text-dark hover:bg-gray-400 dark:hover:bg-gray-600'
              }`}
          >
            <Icon size={16} className="mr-1" />
            <span className="inline">{type}</span>
          </button>
        ))}
      </div>
      {filteredOrders.length <= 0 ? (
        <div className='text-3xl py-8 text-text-light dark:text-text-dark animate-fadeInUp'>
          No orders found...
        </div>
      ) : (
        <ul className='w-full lg:max-w-4xl space-y-4'>
          {filteredOrders.map((order, index) => (
            <li key={order._id} className={`animate-fadeInUp`} style={{ animationDelay: `${index * 0.1}s` }}>
              <OrderItem order={order} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrder;