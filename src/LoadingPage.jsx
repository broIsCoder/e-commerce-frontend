import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingPage = ({ msg = "Loading..." }) => {
  return (
    <div className="dark:bg-background-dark bg-background-light min-h-full flex justify-center items-center font-poppins">
      <div className="dark:bg-gray-800 bg-gray-300 text-text-light dark:text-text-dark p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="text-primary-light w-16 h-16 animate-spin" />
          <h2 className="text-2xl md:text-3xl font-bold text-center">{msg}</h2>
        </div>
      </div>
    </div>
  )
}

export default LoadingPage