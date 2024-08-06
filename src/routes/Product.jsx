import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyToken } from '../redux-slices/authSlice';
import { addAlert } from '../redux-slices/alertsSlice';
import numberFormatter from '../utils/numberFormatter';
import { EmptyStar, FilledStar } from '../components/Star';
import ImageModal from '../components/ImageModal'
import { ChevronLeft, ChevronRight, Minus, Package2, Plus, ShoppingBag, ShoppingCart, Star } from 'lucide-react';
import { updateCart, updateOrder } from '../redux-slices/userInfoSlice';
import LoadingPage from '../LoadingPage';
import UserRating from '../components/UserRating';

const Product = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState({});
  const [totalNumberOfRaters, setTotalNumberOfRaters] = useState(0)
  const [currentUserActivityInProduct, setCurrentUserActivityInProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [orderLoading, updateOrderLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartQuantity, setCartQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setError('');
        setLoading(true)
        const options = { method: 'GET' };
        const response = await dispatch(verifyToken(`/products/${productId}`, options));
        if (!response.ok && response.status === 500) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
          setProduct(data.product);
          setCurrentUserActivityInProduct(data.currentUserActivityInProduct)
          setTotalNumberOfRaters(data.product.delieveredBuyers.length > 0 ? data.product.delieveredBuyers.filter((buyer) => buyer?.userRating > 0).length : 0)
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
      if (i <= rating) {
        stars.push(<FilledStar key={i} />);
      } else {
        stars.push(<EmptyStar key={i} />);
      }
    }

    return stars;
  };

  const handleAddToCart = async () => {
    try {
      setError('');
      setCartLoading(true)
      const options = {
        method: 'POST', body: JSON.stringify({
          items: [
            {
              "productId": productId,
              "quantity": cartQuantity
            },
          ]
        })
      };

      const response = await dispatch(verifyToken('/products/addToCart', options));;
      // catch server error
      if (!response.ok && response.status === 500) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        dispatch(addAlert({ message: data.message, type: "success" }));
        dispatch(updateCart({ cart: data.newCart }))
        setError('')
      } else {
        dispatch(addAlert({ message: data.message, type: "warning" }));
        setError(data.message);
      }
    } catch (error) {
      dispatch(addAlert({ message: error.message, type: "error" }));
      setError(error.message);
    } finally {
      setCartLoading(false)
    }
  };

  const handleOrderNow = async () => {
    try {
      setError("")
      updateOrderLoading(true)
      const options = {
        method: 'POST', body: JSON.stringify(
          {
            "orders": [
              {
                "items": [
                  {
                    "productId": productId,
                    "quantity": cartQuantity
                  }
                ]
              }
            ]
          })
      };
      const response = await dispatch(verifyToken('/products/orderProducts', options));;
      // catch server error
      if (response.status === 500) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        dispatch(addAlert({ message: data.message, type: "success" }))
        dispatch(updateOrder({ orders: data.orders }))
        setProduct((prev) => {
          return {
            ...prev,
            availableQuantity: prev.availableQuantity - cartQuantity
          };
        });

      } else {
        dispatch(addAlert({ message: data.message, type: "warning" }))
      }
    } catch (error) {
      dispatch(addAlert({ message: error.message, type: "error" }))
      setError(error.message);
    } finally {
      updateOrderLoading(false)
    }
  };


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

  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ... other functions

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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

  if (loading) {
    return (
      <LoadingPage msg="Getting The Product" />
    )
  }

  if (error) {
    throw new Error(error)
  };


  return (
    <div className="min-h-full text-text-light dark:text-text-dark font-poppins">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              {product.images ? (
                <img src={product.images[0]} alt={product.productName} className="w-full max-h-98 object-cover bg-black" />
              ) : (
                <div className="flex justify-center items-center w-full h-96 bg-gray-200 dark:bg-gray-700">
                  <Package2 className="w-24 h-24 text-gray-400 dark:text-gray-500" />
                </div>
              )}
              <div className="absolute top-4 right-4 bg-primary-light dark:bg-primary-dark text-white text-xs font-bold px-3 py-1 rounded-full">
                {product.category}
              </div>
            </div>
            <div className="relative">
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
                      onClick={() => openModal(index)}
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
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{product.productName}</h1>
              <div className="flex items-center">
                <div className="flex items-center space-x-1">{renderStars()}</div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">({totalNumberOfRaters} ratings)</span>
              </div>
              <p className="text-3xl font-semibold text-accent-light dark:text-accent-dark">
                Rs {numberFormatter(product.price)}
              </p>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Available Quantity:</span> {product.availableQuantity}</p>
                <p><span className="font-semibold">Total Customers:</span> {product.delieveredBuyers.length}</p>
                <p><span className="font-semibold">Total Quantity Sold:</span> {product.productQuantitySold}</p>
                <p><span className="font-semibold">Seller:</span> {product.email}</p>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Description:</span> {product.description}
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Quantity:</span>
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
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  disabled={cartLoading}
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary-light hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary-light text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                >
                  {cartLoading ? (
                    "Adding To Cart..."
                  ) : (
                    <>
                      <ShoppingCart className="mr-2" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  disabled={orderLoading}
                  onClick={handleOrderNow}
                  className="flex-1 bg-gradient-to-r from-primary-light via-secondary-light to-accent-light hover:from-primary-dark hover:via-secondary-dark hover:to-accent-dark text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                >
                  {orderLoading ? (
                    "Ordering..."
                  ) : (
                    <>
                      <ShoppingBag className="mr-2" /> Order Now
                    </>
                  )}
                </button>
              </div>
              <UserRating
                setProduct={setProduct}
                productId={productId}
                rating={currentUserActivityInProduct?.userRating || 0}
                changeRating={(newRating) => {
                  setCurrentUserActivityInProduct((prev) => ({
                    ...prev,
                    userRating: newRating,
                  }));
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {product && product.images && (
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
