import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { verifyToken } from '../redux-slices/authSlice';
import ProductItem from '../components/ProductItem';
import LoadingPage from '../LoadingPage'
import { ShoppingBag } from 'lucide-react';

const Products = () => {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError('');
        setLoading(true)
        const options = { method: 'GET' };
        const response = await dispatch(verifyToken('/products', options));
        if (!response.ok && response.status === 500) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
          setError('')
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  if (loading) {
    return (
      <LoadingPage msg="Getting All The Products In The Marekt" />
    )
  }

  if (error) {
    throw new Error (error)
  };

  if (products.length > 0) {
    return (
      <div className="mx-auto ">
         <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product._id} className=''>
              <ProductItem product={product} />
            </div>
          ))}
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex flex-col items-center justify-center min-h-full text-text-light dark:text-text-dark">
        <ShoppingBag className="w-24 h-24 text-gray-400 mb-6" />
        <h2 className='text-3xl font-extrabold text-center'>No Products in Market</h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Check back later for new arrivals!</p>
      </div>
    )
  }
};

export default Products;