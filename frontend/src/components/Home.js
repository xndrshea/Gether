// src/components/Home.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [hasInput, setHasInput] = useState(false);

    const handleScavenge = () => {
        const tokenAddress = document.getElementById('tokenAddress').value.trim();
        if (tokenAddress) {
            navigate(`/tokenpage/${tokenAddress}`);
        } else {
            alert('Please enter a token address.');
        }
    };

    const handleClearSearch = () => {
        document.getElementById('tokenAddress').value = '';
        setHasInput(false);
    };

    const handleInputChange = (event) => {
        setHasInput(event.target.value.trim().length > 0);
    };

    const handleBrowseAll = () => {
        navigate('/browse');
    };

    return (
        <div className="container">
            <div className="logo">
                <span>gether</span>
            </div>
            <h1 className="mb-4">
                <span className="first-line font-semibold">Where Tokens</span><br />
                <span className="second-line font-semibold">become <span className="blue-text font-bold">Communities</span></span>
            </h1>
            <div className="search-container relative mb-6 mt-2">
                <input
                    type="text"
                    id="tokenAddress"
                    placeholder="Enter TON Token Address..."
                    onChange={handleInputChange}
                    className="w-full py-3 px-5 rounded-full border-none text-base bg-white text-black"
                />
                {hasInput && (
                    <button
                        id="clearSearch"
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-xl text-gray-500 cursor-pointer"
                    >
                        &times;
                    </button>
                )}
            </div>
            <div className="flex justify-center items-center gap-5 mt-8">
                <button
                    id="scavenge"
                    className="py-2 px-5 rounded-full text-base font-semibold cursor-pointer bg-blue-600 text-white"
                    onClick={handleScavenge}
                >
                    Scavenge
                </button>
                <span className="text-3xl text-white">/</span>
                <button
                    id="browseAll"
                    className="py-2 px-5 rounded-full text-base font-semibold cursor-pointer bg-white text-blue-600"
                    onClick={handleBrowseAll}
                >
                    Browse All
                </button>
            </div>
            <div id="searchResult"></div>
        </div>
    );
};

export default Home;