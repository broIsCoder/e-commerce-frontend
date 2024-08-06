import React, { useState } from 'react'
import { Search, X } from 'lucide-react';

const SearchBox = () => {
    const [searchText, setSearchText] = useState("");

    const handleSearch = async(e)=>{
        e.preventDefault();
    }

    return (
        <form onSubmit={handleSearch} className="flex items-center w-full ">
            <div className="flex bg-light-background dark:bg-gray-400 text-black dark:text-white  rounded-full justify-center items-center w-full">
                <input
                    type="text"
                    placeholder="Search Products..."
                    value={searchText}
                    onChange={(e) => { setSearchText(e.target.value) }}
                    className="p-3 w-full rounded-l-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white  focus:ring-none focus:outline-none"
                />
                {searchText &&
                    <button type='button' onClick={() => { setSearchText("") }} className='py-3 px-2 bg-gray-200 dark:bg-gray-700'>
                        <X />
                    </button>
                }
                <button type='submit' className='bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600  p-3 pr-4 pl-2 rounded-r-full'>
                    <Search />
                </button>
            </div>
        </form>
    )
}

export default SearchBox