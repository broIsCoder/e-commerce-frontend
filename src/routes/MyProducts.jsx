import React, { useEffect, useState } from 'react';
import { verifyToken } from '../redux-slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert } from '../redux-slices/alertsSlice';
import LoadingPage from '../LoadingPage';
import MyProductItem from '../components/MyProductItem';
import { Link} from 'react-router-dom';

const MyProducts = () => {
  const role = useSelector((state) => state.userInfo.user.roles);
  const dispatch = useDispatch();
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        setError('');
        setLoading(true)
        const options = { method: 'GET' };
        const response = await dispatch(verifyToken('/employee/getMyProducts', options));
        if (!response.ok && response.status === 500) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
          setMyProducts(data.myProducts);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError(error.message);
        dispatch(addAlert({ message: error.message, type: 'error' }));
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, [dispatch]);

  if (role?.employee === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
        <p className="text-xl font-semibold text-secondary-light dark:text-secondary-dark">Access Denied: Only for employees</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
        <p className="text-xl font-semibold text-secondary-light dark:text-secondary-dark">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <h1 className="text-3xl font-bold mb-6 text-text-light dark:text-text-dark">My Products In Market</h1>
      {myProducts.length === 0 ? (
        <p className="text-xl text-text-light dark:text-text-dark">You haven't added any products yet.</p>
      ) : (
        <div className="grid grid-cols-1 ss:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myProducts.map((product) => (
            <Link key={product._id} to={`/my-products/product?data=${encodeURIComponent(JSON.stringify(product))}`}>
              <MyProductItem product={product} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
