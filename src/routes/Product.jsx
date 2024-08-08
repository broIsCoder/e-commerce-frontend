import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyToken } from '../redux-slices/authSlice';
import { addAlert } from '../redux-slices/alertsSlice';
import numberFormatter from '../utils/numberFormatter';
import { EmptyStar, FilledStar } from '../components/Star';
import ImageModal from '../components/ImageModal';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, ShoppingCart } from 'lucide-react';
import { updateCart, updateOrder } from '../redux-slices/userInfoSlice';
import LoadingPage from '../LoadingPage';
import UserRating from '../components/UserRating';

const Product = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState({});
  const [totalRaters, setTotalRaters] = useState(0);
  const [currentUserActivity, setCurrentUserActivity] = useState({});
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [orderLoading, updateOrderLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartQuantity, setCartQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setError('');
        setLoading(true);
        const response = await dispatch(verifyToken(`/products/${productId}`));
        if (!response.ok && response.status === 500) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
          setProduct(data.product);
          setCurrentUserActivity(data.currentUserActivityInProduct);
          setTotalRaters(data.product.delieveredBuyers.filter((buyer) => buyer?.userRating > 0).length);
        } else {
          dispatch(addAlert({ message: data.message, type: 'warning' }));
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, dispatch]);

  const renderStars = () => {
    const stars = [];
    const rating = product.rating;
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? <FilledStar key={i} /> : <EmptyStar key={i} />);
    }
    return stars;
  };

  const handleAddToCart = async () => {
    try {
      setError('');
      setCartLoading(true);
      const response = await dispatch(verifyToken('/products/addToCart', {
        method: 'POST',
        body: JSON.stringify({ items: [{ productId, quantity: cartQuantity }] }),
      }));
      const data = await response.json();
      if (data.success) {
        setCartQuantity(1)
        dispatch(addAlert({ message: data.message, type: 'success' }));
        dispatch(updateCart({ cart: data.newCart }));
      } else {
        dispatch(addAlert({ message: data.message, type: 'warning' }));
        setError(data.message);
      }
    } catch (error) {
      dispatch(addAlert({ message: error.message, type: 'error' }));
      setError(error.message);
    } finally {
      setCartLoading(false);
    }
  };

  const handleOrderNow = async () => {
    try {
      setError('');
      updateOrderLoading(true);
      const response = await dispatch(verifyToken('/products/orderProducts', {
        method: 'POST',
        body: JSON.stringify({ orders: [{ items: [{ productId, quantity: cartQuantity }] }] }),
      }));
      const data = await response.json();
      if (data.success) {
        setCartQuantity(1)
        dispatch(addAlert({ message: data.message, type: 'success' }));
        dispatch(updateOrder({ orders: data.orders }));
        setProduct((prev) => ({
          ...prev,
          availableQuantity: prev.availableQuantity - cartQuantity,
        }));
      } else {
        dispatch(addAlert({ message: data.message, type: 'warning' }));
      }
    } catch (error) {
      dispatch(addAlert({ message: error.message, type: 'error' }));
      setError(error.message);
    } finally {
      updateOrderLoading(false);
    }
  };

  const scrollContainerRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftScroll(container.scrollLeft > 0);
      setShowRightScroll(container.scrollLeft < container.scrollWidth - container.clientWidth);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
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

  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const navigateImage = (direction) => {
    setCurrentImageIndex((prevIndex) =>
      direction === 'prev'
        ? prevIndex > 0 ? prevIndex - 1 : product.images.length - 1
        : prevIndex < product.images.length - 1 ? prevIndex + 1 : 0
    );
  };

  if (loading) {
    return <LoadingPage msg="Getting The Product" />;
  }

  if (error) {
    throw new Error(error);
  }

  return (
    <div className="text-text-light dark:text-text-dark font-poppins">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 md:py-12">
        <div className="gap-4 flex flex-col sm:flex-row md:flex-col ">
          <div
            className="relative w-full h-36 sm:h-64 sm:w-2/5 md:w-full flex justify-center items-center rounded-lg overflow-hidden shadow-lg"
            style={{ backgroundImage: `url(${product.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <span className="absolute right-2 top-2 flex text-nowrap justify-center items-center bg-primary-light dark:bg-primary-dark text-white text-xs font-bold px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          <div className='w-full flex items-end sm:w-3/5 md:w-full'>
            <div className="relative">
              {showLeftScroll && (
                <button
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-600 p-2 rounded-full shadow-md z-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
              )}
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide"
              >
                {product.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.productName} - ${index + 1}`}
                    className="w-20 h-20 flex-shrink-0 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => openModal(index)}
                  />
                ))}
              </div>
              {showRightScroll && (
                <button
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-600 p-2 rounded-full shadow-md z-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2">
          <div className=''>
            <div className='flex justify-between'>
              <h1 className="text-2xl mb-4 md:text-4xl md:mb-6 font-bold truncate">{product.productName}</h1>
              <div className="flex items-center">
                <div className="flex items-center space-x-1">{renderStars()}</div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 truncate">({totalRaters})</span>
              </div>
            </div>
            <div className='flex justify-between items-center mt-2'>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setCartQuantity((prev) => Math.max(prev - 1, 1))}
                  disabled={cartQuantity <= 1}
                  className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 text-center min-w-[3rem]">{numberFormatter(cartQuantity)}</span>
                <button
                  onClick={() => setCartQuantity((prev) => Math.min(prev + 1, product.availableQuantity))}
                  disabled={cartQuantity >= product.availableQuantity}
                  className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <p className="text-2xl font-semibold text-accent-light dark:text-accent-dark">
                Rs {numberFormatter(product.price * cartQuantity)}
              </p>
            </div>
            <div className="flex flex-col xs:flex-row gap-4 mt-4">
              <button
                disabled={cartLoading}
                onClick={handleAddToCart}
                className="bg-accent-light w-full hover:bg-accent-dark dark:bg-accent-dark dark:hover:bg-accent-light text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
              >
                <div className="flex">
                  <ShoppingCart className="mr-2" />  {cartLoading ? " Adding to Cart" : " Add to Cart"}
                </div>
              </button>
              <button
                disabled={orderLoading}
                onClick={handleOrderNow}
                className="w-full bg-secondary-light hover:bg-secondary-dark dark:hover:bg-secondary-light dark:bg-secondary-dark text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
              >
                <div className="flex">
                  <ShoppingBag className="mr-2" />  {orderLoading ? "Ordering " : "Order Now"}
                </div>
              </button>
            </div>
            <div className="my-4 space-y-2 text-sm">
              <p><span className='font-semibold '>Price:</span> Rs {numberFormatter(product.price)}</p>
              <p><span className="font-semibold ">Available Quantity:</span> {product.availableQuantity}</p>
              <p><span className="font-semibold ">Total Customers:</span> {product.delieveredBuyers.length}</p>
              <p><span className="font-semibold ">Total Quantity Sold:</span> {product.productQuantitySold}</p>
              <p><span className="font-semibold ">Seller:</span> {product.email}</p>
              <p className="text-gray-700 dark:text-gray-300 line-clamp-3"><span className="font-semibold">Description:</span> {product.description}</p>
            </div>
          </div>
          <UserRating
            setProduct={setProduct}
            productId={productId}
            rating={currentUserActivity?.userRating || 0}
            changeRating={(newRating) => {
              setCurrentUserActivity((prev) => ({ ...prev, userRating: newRating }));
            }}
          />
        </div>
      </div>
      {product.images && (
        <ImageModal
          isOpen={modalOpen}
          onClose={closeModal}
          images={product.images}
          currentIndex={currentImageIndex}
          onNavigate={navigateImage}
        />
      )}
    </div>
  );
};

export default Product;