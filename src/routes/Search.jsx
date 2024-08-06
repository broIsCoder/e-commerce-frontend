import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import SearchBox from '../components/SearchBox';

const Search = () => {
  return (
    <div className='h-screen bg-primary p-4'>
      <div className='flex gap-4'>
        <div className='px-3 py-2 border-2 border-gray-700 flex justify-center items-center dark:text-white text-black bg-white dark:bg-tertiary rounded-full'>
          <Link to={'/'}>
            <Home/>
          </Link>
        </div>
        <SearchBox />
      </div>
      <div></div>
    </div>
  );
};

export default Search;
