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
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-75"
        onClick={onClose}
      ></div>
      <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white rounded-full p-1 text-gray-700 transition-colors duration-200 z-20"
        >
          <X className="w-7 h-7" />
        </button>
      <div className="relative flex justify-center items-center">
        
        <div className="relative bg-black max-w-[60vw] max-h-[60vh] min-w-[30vw] min-h-[30vh] flex items-center justify-center">
          <img
            src={currentImage}
            alt={`Full size ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      {currentIndex > 0 && (
        <button
          ref={prevButtonRef}
          onClick={() => onNavigate('prev')}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-xl z-10 bg-opacity-70 hover:bg-opacity-100 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500"
        >
          <ChevronLeft className="w-12 h-12 text-black" />
        </button>
      )}
      {currentIndex < images.length - 1 && (
        <button
          ref={nextButtonRef}
          onClick={() => onNavigate('next')}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-xl z-10 bg-opacity-70 hover:bg-opacity-100 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500"
        >
          <ChevronRight className="w-12 h-12 text-black" />
        </button>
      )}
    </div>
  );
};

export default ImageModal;