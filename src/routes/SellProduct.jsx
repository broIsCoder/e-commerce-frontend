import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UploadImage from '../components/UploadImage';
import { addAlert } from '../redux-slices/alertsSlice';
import { verifyToken } from '../redux-slices/authSlice';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

const ProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.userInfo.user.roles);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    price: '',
    description: '',
    availableQuantity: ''
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'price' || name === 'availableQuantity' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const newFormData = new FormData();
      newFormData.append('productName', formData.productName);
      newFormData.append('category', formData.category);
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
          category: '',
          price: '',
          description: '',
          availableQuantity: ''
        });
        setImages([]);
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

  if (role?.employee === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
        <p className="text-xl font-semibold text-secondary-light dark:text-secondary-dark">Access Denied: Only for employees</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-blue-100 dark:bg-gray-800 rounded-lg p-6 md:p-8 mb-8">
      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="flex-1 space-y-6">
          <div>
            <label className="block text-text-light dark:text-text-dark text-sm font-bold mb-2" htmlFor="productName">
              Product Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-text-light dark:text-text-dark leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-900 transition duration-300 ease-in-out"
              id="productName"
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-text-light dark:text-text-dark text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-text-light dark:text-text-dark leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-900 transition duration-300 ease-in-out"
              id="category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-text-light dark:text-text-dark text-sm font-bold mb-2" htmlFor="price">
              Price
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-text-light dark:text-text-dark leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-900 transition duration-300 ease-in-out"
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-text-light dark:text-text-dark text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-text-light dark:text-text-dark leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-900 transition duration-300 ease-in-out"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-text-light dark:text-text-dark text-sm font-bold mb-2" htmlFor="availableQuantity">
              Available Quantity
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-text-light dark:text-text-dark leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-900 transition duration-300 ease-in-out"
              id="availableQuantity"
              type="number"
              name="availableQuantity"
              value={formData.availableQuantity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <UploadImage images={images} setImages={setImages} />
          <div className='flex-col flex items-end'>

            <div className="flex items-center justify-between">
              <button
                className="bg-primary-light dark:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-primary-dark transition duration-300 ease-in-out"
                type="submit"
              >
                {loading ? 'Releasing...' : 'Release'}
              </button>
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm mt-4 p-3 bg-red-100 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
