import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UploadImage from '../components/UploadImage';
import { addAlert } from '../redux-slices/alertsSlice';
import { verifyToken } from '../redux-slices/authSlice';
import { useNavigate } from 'react-router-dom';
import CategorySelector from '../components/CategorySelector';

const ProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.userInfo.user.roles);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    description: '',
    availableQuantity: '',
  });
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("General");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'price' || name === 'availableQuantity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newFormData = new FormData();
      newFormData.append('productName', formData.productName);
      newFormData.append('category', selectedCategory);
      newFormData.append('price', formData.price);
      newFormData.append('description', formData.description);
      newFormData.append('availableQuantity', formData.availableQuantity);

      images.forEach((image) => {
        newFormData.append('images', image);
      });

      setError('');
      setLoading(true);

      const options = {
        method: 'POST',
        body: newFormData,
      };

      const response = await dispatch(verifyToken('/employee/sellProduct', options));
      const data = await response.json();

      if (data.success) {
        dispatch(addAlert({ message: data.message, type: 'success' }));
        setFormData({
          productName: '',
          price: '',
          description: '',
          availableQuantity: '',
        });
        setImages([]);
        setSelectedCategory([]); // Reset categories
        navigate('/my-products');
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

  const renderInput = (type, value, name, placeholder) => (
    <div className="relative">
      <label className='font-semibold'>{placeholder}</label>
      <input
        type={type}
        value={value}
        name={name}
        id={name}
        required
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
      />
    </div>
  );

  if (role?.employee === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
        <p className="text-xl font-semibold text-secondary-light dark:text-secondary-dark">
          Access Denied: Only for employees
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-blue-100 dark:bg-gray-800 rounded-lg p-6 md:p-8 mb-8">
      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="flex-1 space-y-4 mb-4">
          {renderInput('text', formData.productName, 'productName', 'Product Name')}
          {renderInput('number', formData.price, 'price', 'Price')}
          {renderInput('number', formData.availableQuantity, 'availableQuantity', 'Available Quantity')}
          <div className="">
            <label className='font-semibold'>Description</label>
            <textarea
              placeholder='Description'
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            ></textarea>
          </div>
        </div>
      </div>
      <CategorySelector setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />
      <div className="flex-1 space-y-4 my-4">
        <UploadImage images={images} setImages={setImages} />
      </div>
      <div className="flex items-center justify-end">
        <button
          className="bg-primary-light dark:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-primary-dark transition duration-300 ease-in-out"
          type="submit"
        >
          {loading ? 'Releasing...' : 'Release'}
        </button>
      </div>
      {error && (
        <div className="text-red-500 text-sm mt-4 p-3 bg-red-100 rounded-md">
          {error}
        </div>
      )}
    </form>
  );
};

export default ProductForm;
