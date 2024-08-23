import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { Menu, Search, User, X } from 'lucide-react';
import { toggleSidebar } from '../redux-slices/sidebarSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const showSidebar = useSelector((state) => state.sidebar.showSidebar);

    return (
        <nav className='sticky border-b border-gray-200 dark:border-gray-700 top-0 left-0 z-50 bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-md transition-all duration-300'>
            <div className=' py-2'>
                <div className='flex px-2 justify-between items-center'>
                    <div className='flex items-center space-x-4 lg:space-x-0'>
                        <button
                            onClick={() => dispatch(toggleSidebar())}
                            className="lg:hidden p-2 rounded-md bg-gray-100 dark:bg-gray-800  text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                            aria-label={showSidebar ? "Close sidebar" : "Open sidebar"}
                        >
                            {showSidebar ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <Link to="/" className="flex items-center bg-gray-800 hover:bg-black rounded-full p-1 px-4" onClick={() => setIsOpen(false)}>
                            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light via-secondary-light to-accent-light hover:from-primary-dark hover:via-secondary-dark hover:to-accent-dark transition-all duration-300">
                                <span className='hidden sm:inline'>e-commerce</span>
                                <span className='sm:hidden'>e-com</span>
                            </span>
                        </Link>
                    </div>


                    <div className='flex gap-3'>
                        <Link to="/search" className=''>
                            <button
                                type='button'
                                className='p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200'
                                aria-label="Search"
                            >
                                <Search size={20} />
                            </button>
                        </Link>
                        <NavLink to="/me" className={({ isActive }) => `flex items-center gap-3 rounded-full p-3 transition-colors duration-200 ${isActive
                            ? 'bg-blue-200 dark:bg-primary-dark dark:text-text-dark shadow-md transform scale-105'
                            : 'p-3 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200'
                            }`}>
                            <User size={20} />
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;