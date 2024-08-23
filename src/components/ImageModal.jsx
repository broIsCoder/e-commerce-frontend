import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, images, currentIndex, onNavigate }) => {
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && prevButtonRef.current) {
        prevButtonRef.current.click();
        setTimeout(() => {
          if (prevButtonRef.current) {
            prevButtonRef.current.focus();
          }
        }, 0);
      } else if (e.key === 'ArrowRight' && nextButtonRef.current) {
        nextButtonRef.current.click();
        setTimeout(() => {
          if (nextButtonRef.current) {
            nextButtonRef.current.focus();
          }
        }, 0);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, onClose]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 h-screen w-screen z-50 flex justify-center items-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-75"
      ></div>
      <div className="relative w-full h-full flex justify-around items-center">
      {currentIndex > 0 && (
        <button
          ref={prevButtonRef}
          onClick={() => onNavigate('prev')}
          className="absolute left-8 lg:left-32 xl:left-96 top-[94vh] sm:top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-xl z-10 bg-opacity-70 hover:bg-opacity-100 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500"
        >
          <ChevronLeft className="w-12 h-12 text-black" />
        </button>
      )}
        <div className="relative bg-black rounded-2xl overflow-hidden w-full h-full sm:w-5/6 sm:h-5/6 md:w-4/6 md:h-4/6 lg:w-1/2 lg:h-1/2 flex items-center justify-center">
          <img
            src={currentImage}
            alt={`Full size ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-white rounded-full p-1 text-gray-700 transition-colors duration-200 z-20"
          >
            <X className="w-7 h-7" />
          </button>
        </div>
        {currentIndex < images.length - 1 && (
        <button
          ref={nextButtonRef}
          onClick={() => onNavigate('next')}
          className="absolute right-8 lg:right-32 xl:right-96 top-[94vh] sm:top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-xl z-10 bg-opacity-70 hover:bg-opacity-100 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500"
        >
          <ChevronRight className="w-12 h-12 text-black" />
        </button>
      )}
      </div>
     
      
    </div>
  );
};

export default ImageModal;