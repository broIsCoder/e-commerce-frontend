import React, { useState, useRef } from 'react';

const UploadImage = ({ images, setImages }) => {
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = [...e.dataTransfer.files];
        handleFiles(files);
    };

    const handleFileInput = (e) => {
        const files = [...e.target.files];
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const imageFiles = files.filter(file => validImageTypes.includes(file.type));
        setImages(prevImages => [...prevImages, ...imageFiles]);
    };

    const removeImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    return (
        <div>
            <label className="block text-text-light dark:text-text-dark text-sm font-bold mb-2">
                Product Images
            </label>
            <div className='bg-white dark:bg-gray-900 p-4 rounded-xl'>
                <div className="w-full shadow-md ">
                    <div className="w-full">
                        <div
                            className="border-2 w-full border-dashed border-gray-300 rounded-lg p-4 py-16 text-center cursor-pointer hover:border-primary-light transition duration-300 ease-in-out"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <p className="text-gray-500 dark:text-gray-400">Drag and drop images here, or click to select files</p>
                            <p className='text-gray-500 dark:text-gray-400'>(Maximum of 5 Images)</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileInput}
                                multiple
                                accept="image/*"
                                className="hidden"
                                required
                            />
                        </div>
                        {images.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-4">
                                {images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Uploaded ${index + 1}`}
                                            className="w-full h-24 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadImage;
