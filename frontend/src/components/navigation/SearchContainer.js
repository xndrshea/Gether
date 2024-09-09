// src/components/SearchContainer.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsPhone } from '../../utils/useMediaQuery';

const SearchContainer = () => {
    const [tokenAddress, setTokenAddress] = useState('');
    const [hasInput, setHasInput] = useState(false);
    const navigate = useNavigate();
    const isPhone = useIsPhone();

    const handleSearch = (e) => {
        e.preventDefault();
        if (tokenAddress.trim()) {
            navigate(`/tokenpage/${tokenAddress.trim()}`);
            // Clear the input after navigation
            setTokenAddress('');
            setHasInput(false);
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

    return (
        <form onSubmit={handleSearch} className="flex items-center relative">
            <input
                type="text"
                value={tokenAddress}
                onChange={handleInputChange}
                placeholder="Enter TON Token Address..."
                className={`py-2 px-4 border rounded-full focus:outline-none border-none text-sm bg-gray-900 bg-opacity-80 text-white pr-8 ${
                    isPhone ? 'w-full max-w-[20rem]' : 'w-[40rem]'
                }`}
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
        </form>
    );
};

export default SearchContainer;