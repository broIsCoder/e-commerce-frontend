import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { toggleSidebar } from '../redux-slices/sidebarSlice';

const Root = () => {
  const dispatch = useDispatch();
  const showSidebar = useSelector((state) => state.sidebar.showSidebar);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        dispatch(toggleSidebar(false));
      }
    };

    if (showSidebar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSidebar, dispatch]);

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        <div
          ref={sidebarRef}
          className={`
            absolute lg:relative z-30 h-full
            transition-all duration-300 ease-in-out
            ${showSidebar ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'}
            lg:translate-x-0 lg:shadow-md
          `}
        >
          <Sidebar />
        </div>
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300 ease-in-out"
            onClick={() => dispatch(toggleSidebar(false))}
          />
        )}
        <main className="flex-1 overflow-auto bg-gray-300 dark:bg-background-dark p-4">
          <Outlet />
        </main>
       
      </div>
    </div>
  );
};

export default Root;