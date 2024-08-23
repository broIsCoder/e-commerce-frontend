import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { verifyToken } from '../redux-slices/authSlice';
import { Search, X, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { useDispatch } from 'react-redux';
import SearchProductItem from '../components/SearchProductItem';
import CategorySelector from '../components/CategorySelector';

const ProductSearch = () => {
  const dispatch = useDispatch();
  const [productName, setProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [count, setCount] = useState(0);
  const [loadingResult, setLoadingResult] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoadingResult(true);
      const options = {
        params: { productName, category: selectedCategory, minPrice, maxPrice },
      };
      const response = await dispatch(verifyToken('/products/search', options));
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
        setCount(data.count);
        setShowResult(true);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoadingResult(false);
    }
  };

  const clearSearch = () => {
    setProductName('');
    setProducts([]);
    setCount(0);
    setShowResult(false);
  };

  const clearCategory = () => setSelectedCategory('');
  const clearMinPrice = () => setMinPrice('');
  const clearMaxPrice = () => setMaxPrice('');

  const renderInput = (type, setter, value, placeholder) => (
    <div className="relative">
      <label>{placeholder}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setter(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
      />
    </div>
  );

  return (
    <div className="w-full min-h-full space-y-2 p-4">
      <div className="flex w-full gap-4 dark:text-text-dark text-text-light">
        <div className="md:min-w-[350px] flex justify-center">
          <button
            onClick={() => {
              setShowFilters(!showFilters);
              clearCategory();
              clearMinPrice();
              clearMaxPrice();
            }}
            className="flex items-center text-xl gap-1 transition-colors duration-200 text-black dark:text-white rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <span className="hidden md:block">Filter</span>
            <SlidersHorizontal size={25} />
          </button>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-1/3 md:min-w-[550px]">
          <div className="w-full flex items-center bg-white dark:bg-gray-700 rounded-full shadow-md">
            <Link to="/" className="p-3">
              <ArrowLeft size={25} />
            </Link>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Search products"
              className="bg-transparent text-xl w-full outline-none px-4 py-2"
            />
            <button
              onClick={clearSearch}
              type="button"
              className="py-3 px-2 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <X size={25} />
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-3 rounded-r-full hover:bg-blue-600 transition duration-200"
            >
              <Search size={25} />
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-4">
        <div className={`flex-col gap-2 ${showFilters ? 'flex' : 'hidden'} lg:flex lg:w-1/3`}>
          {renderInput('number', setMinPrice, minPrice, 'Min Price')}
          {renderInput('number', setMaxPrice, maxPrice, 'Max Price')}
          <CategorySelector setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />
        </div>
        {loadingResult ? (
          <div className="flex w-full items-center justify-center h-16 text-lg text-gray-500">
            Loading Results...
          </div>
        ) : (
          <div className="space-y-4 my-2 w-full">
            {count > 0 && (
              <div>
                <span className="p-2 px-4 dark:bg-accent-dark bg-accent-light rounded-full">
                  {count} Results Found
                </span>
              </div>
            )}
            <ul className="space-y-2">
              {showResult &&
                products.map((product) => (
                  <li key={product._id}>
                    <SearchProductItem product={product} />
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
