import React from 'react';

const ConfirmModal = ({ message, confirmedTask, onClose, isOpen, className , confirmBtn }) => {
    if (!isOpen || !message || !confirmedTask || !className || !onClose) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black bg-opacity-75"
                onClick={onClose}
            ></div>
            <div className="relative max-w-md w-full max-h-[80vh] rounded-lg p-4 bg-gray-300 dark:bg-gray-800 overflow-y-auto text-black dark:text-white">
                <h1 className="text-xl font-bold mb-4">{message}</h1>
                <div className="flex mt-6 justify-between">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-all">
                        Cancel
                    </button>
                    <button onClick={confirmBtn} className={`${className ? className : "bg-gray-300 dark:bg-gray-700  hover:bg-gray-400 dark:hover:bg-gray-600 "} flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary-light dark:focus:ring-secondary-dark focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105`}>
                        {confirmedTask}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
