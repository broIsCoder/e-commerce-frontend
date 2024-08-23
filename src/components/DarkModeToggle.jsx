import { Moon, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial theme preference
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(darkModePreference);

    if (darkModePreference) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button onClick={toggleDarkMode} className="px-4 py-2 w-full flex gap-2 text-nowrap rounded-xl dark:hover:bg-gray-700 hover:bg-gray-300 duration-200">
      {
        isDarkMode ?
          <>
            <Sun className='text-text-dar' />Light Mode
          </>
          : <>
            <Moon className='text-text-light' /> Dark Mode
          </>
      }
     
    </button>
  );
};

export default DarkModeToggle;
