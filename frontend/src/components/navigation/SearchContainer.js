// src/components/SearchContainer.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsPhone } from '../../utils/useMediaQuery';

const SearchContainer = () => {
    const [tokenAddress, setTokenAddress] = useState('');
    const [hasInput, setHasInput] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();
    const isPhone = useIsPhone();

    useEffect(() => {
        if (isSearchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isSearchOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (tokenAddress.trim()) {
            navigate(`/tokenpage/${tokenAddress.trim()}`);
            setTokenAddress('');
            setHasInput(false);
            if (isPhone) setIsSearchOpen(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setTokenAddress(value);
        setHasInput(value.trim().length > 0);
    };

    const handleClearSearch = () => {
        setTokenAddress('');
        setHasInput(false);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    if (isPhone && !isSearchOpen) {
        return (
            <button onClick={toggleSearch} className="p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        );
    }

    const searchForm = (
        <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
                <input
                    type="text"
                    value={tokenAddress}
                    onChange={handleInputChange}
                    placeholder="Enter TON Token Address..."
                    className="w-full py-2 px-4 pr-10 rounded-full focus:outline-none border-none bg-gray-800 text-white text-base"
                    autoFocus={isPhone}
                />
                {hasInput && (
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-xl text-gray-500 cursor-pointer"
                    >
                        &times;
                    </button>
                )}
            </div>
        </form>
    );

    if (isPhone) {
        return (
            <div className={`fixed inset-0 bg-black bg-opacity-90 z-50 transition-opacity duration-300 ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4">
                        <h2 className="text-white text-xl font-bold">Search</h2>
                        <button onClick={toggleSearch} className="text-white text-2xl">&times;</button>
                    </div>
                    <div className="flex-grow flex items-center px-4">
                        {searchForm}
                    </div>
                </div>
            </div>
        );
    }

    return searchForm;
};

export default SearchContainer;