import React from 'react'
import { Link, useRouteError } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, RotateCw } from 'lucide-react'

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error)

    return (
        <div className="bg-background-dark min-h-full flex justify-center items-center font-poppins">
            <div className="bg-gray-800 text-text-dark p-12 rounded-xl shadow-2xl sm:max-w-lg w-full mx-4">
                <div className="flex flex-col items-center gap-6">
                    <span className="text-4xl md:text-5xl font-extrabold text-primary-light flex gap-4 items-end"><AlertTriangle className="text-secondary-light w-20 h-20" />Oops!</span>
                    <p className=" text-md sm:text-xl text-center">Sorry, an unexpected error has occurred.</p>
                    <div className="bg-gray-700 p-4 rounded-lg w-full">
                        <p className="text-lg italic text-center break-words">
                            {error.statusText || error.message || "Unknown error"}
                        </p>
                    </div>
                    <div className='flex gap-4'>
                        <Link to="/" className='flex gap-2 bg-accent-dark hover:bg-accent-light text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105'>
                            <ArrowLeft /> Home
                        </Link>

                        <button
                            onClick={() => window.location.reload()}
                            className="flex gap-2 bg-primary-dark hover:bg-primary-light text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            <RotateCw />
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage