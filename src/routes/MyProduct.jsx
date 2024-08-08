import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import numberFormatter from '../utils/numberFormatter';
import { ChevronLeft, ChevronRight, Package2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addAlert } from '../redux-slices/alertsSlice';
import { verifyToken } from '../redux-slices/authSlice';
import ImageModal from '../components/ImageModal';
import ConfirmModal from '../components/ConfirmModal';

const MyProduct = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const productData = queryParams.get('data');
  const product = productData ? JSON.parse(decodeURIComponent(productData)) : null;

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
        <p className="text-xl font-semibold text-secondary-light dark:text-secondary-dark">Error: No product data found.</p>
      </div>
    );
  }

  const removeProductFromMarket = async () => {
    try {
      setError('');
      setLoading(true)
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: product._id
        })
      };
      const response = await dispatch(verifyToken('/employee/removeProduct', options));
      if (!response.ok && response.status === 500) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        dispatch(addAlert({ message: data.message, type: 'success' }));
        navigate("/my-products")
      } else {
        dispatch(addAlert({ message: data.message, type: 'warning' }));
      }
    } catch (error) {
      setError(error.message);
      dispatch(addAlert({ message: error.message, type: 'error' }));
    } finally {
      setLoading(false);
    }
  }

  const renderRating = () => {
    return (
      <div className="flex items-center">
        <div className="w-16 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
          <div
            className="bg-yellow-400 h-2.5 rounded-full"
            style={{ width: `${(product.rating / 5) * 100}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {product.rating}/5 ({product.delieveredBuyers.length})
        </span>
      </div>
    );
  };

  const renderInfoRow = (label, value) => (
    <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 text-nowrap">{label}:</span>
      <span className="text-sm text-gray-800 dark:text-gray-200 truncate">{value}</span>
    </div>
  );


  const scrollContainerRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftScroll(container.scrollLeft > 0);
      setShowRightScroll(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
      }
    };
  }, [product.images]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const [imageModelOpen, setImageModelOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setImageModelOpen(true);
  };

  const closeImageModal = () => {
    setImageModelOpen(false);
  };

  const navigateImage = (direction) => {
    if (direction === 'prev') {
      setCurrentImageIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : product.images.length - 1
      );
    } else {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < product.images.length - 1 ? prevIndex + 1 : 0
      );
    }
  };

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const openConfirmModal = () => {
    setConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalOpen(false);
  };

  return (
    <div className="min-h-full text-text-light dark:text-text-dark font-poppins">
      <div className="p-8">
        <div className="space-y-6 md:items-center space-x-6 flex flex-col md:flex-row">
          <div className="relative rounded-lg overflow-hidden">
            {product.images ? (
              <img src={product.images[0]} alt={product.productName} className="rounded-lg max-h-64 min-h-64 object-contain bg-black" />
            ) : (
              <div className="flex justify-center items-center w-full h-96 bg-gray-200 dark:bg-gray-700">
                <Package2 className="w-24 h-24 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>
          <div className="relative h-full">
            {showLeftScroll && (<button
              onClick={() => scroll('left')}
              className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-600 p-2 rounded-full shadow-md z-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>)}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide"
            >
              {product.images &&
                product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.productName} - ${index + 1}`}
                    className="w-24 h-24 flex-shrink-0 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => openImageModal(index)}
                  />
                ))}
            </div>
            {showRightScroll && (<button
              onClick={() => scroll('right')}
              className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-600 p-2 rounded-full shadow-md z-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>)}
          </div>
        </div>

        <div className='flex-1 mt-4'>
          <h2 className="text-2xl hover:underline font-semibold text-gray-800 dark:text-gray-200 mb-2">
            <Link to={`/products/${product._id}`}>
              {product.productName}
            </Link>
          </h2>
          <div className="space-y-1 ">
            {renderInfoRow("ID", product._id)}
            {renderInfoRow("Price", `Rs ${numberFormatter(product.price)}`)}
            {renderInfoRow("Category", product.category)}
            {renderInfoRow("Available Quantity", numberFormatter(product.availableQuantity))}
            {renderInfoRow("Quantity Sold", numberFormatter(product.productQuantitySold))}
            {renderInfoRow("Total Revenue", `Rs ${numberFormatter(product.productTotalRevenue)}`)}
            {renderInfoRow("Delivered Buyers", product.delieveredBuyers.length)}
            {renderInfoRow("Orders", product.orders.length)}
            {renderInfoRow("Seller Email", product.email)}
            <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Rating:</span>
              {renderRating()}
            </div>
            <div className="text-sm text-gray-800 flex dark:text-gray-200 py-1 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <span className="block text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Description:</span>
              {product.description}
            </div>
            <div className='flex justify-end py-3'>
              <button onClick={openConfirmModal} className='flex items-center justify-start gap-2 px-4 py-2 font-medium bg-secondary-light hover:text-white dark:bg-secondary-dark rounded-lg'>{loading ? "Removing" : "Remove From Market "}</button>
            </div>
          </div>
        </div>
      </div>
      {product && product.images && (
        <ImageModal
          isOpen={imageModelOpen}
          onClose={closeImageModal}
          images={product.images}
          currentIndex={currentImageIndex}
          onNavigate={navigateImage}
        />
      )}
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={closeConfirmModal}
        message={"Do you want to remove this product from market ?"}
        confirmedTask={"Remove"}
        className={" bg-secondary-light dark:bg-secondary-dark "}
        confirmBtn={removeProductFromMarket}
      />
    </div>
  );
};

export default MyProduct;
