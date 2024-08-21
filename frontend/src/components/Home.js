// src/components/Home.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaXTwitter, FaGithub } from 'react-icons/fa6';

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
        <div className="container relative"> 
            <div className="w-20 h-20 bg-[#0066ff] rounded-full flex justify-center items-center mx-auto mb-10 text-2xl font-bold relative -left-[calc(7vw+200px)] top-5 transition-left duration-300 ease-in-out">
                <span>gether</span>
            </div>
            <h1 className="mb-4 text-5xl leading-tight">
                <span className="first-line font-semibold inline-block -ml-[5.5em]">Where Tokens</span><br />
                <span className="second-line font-semibold inline-block ml-[2em]">become <span className="text-blue-600 font-bold">Communities</span></span>
            </h1>
            <div className="search-container relative mt-2">
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
            <div className="flex justify-center items-center gap-5 mt-2">
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
            <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-[rgba(15,15,15,0.9)] border-t border-[rgba(255,255,255,0.2)] flex justify-center items-center">
                <a href="https://x.com/getherlol" target="_blank" rel="noopener noreferrer" className="mx-4 transition-transform duration-300 hover:scale-110">
                    <FaXTwitter size={24} color="white" />
                </a>
                <a href="https://github.com/xndrshea/Gether" target="_blank" rel="noopener noreferrer" className="mx-4 transition-transform duration-300 hover:scale-110">
                    <FaGithub size={24} color="white" />
                </a>
            </div>
        </div>
    );
};

export default Home;