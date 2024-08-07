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
            <h1>
                <span className="first-line">Where Tokens</span><br />
                <span className="second-line">become <span className="blue-text">Communities</span></span>
            </h1>
            <div className="search-container">
                <input
                    type="text"
                    id="tokenAddress"
                    placeholder="Enter TON Token Address..."
                    onChange={handleInputChange}
                />
                {hasInput && (
                    <button id="clearSearch" onClick={handleClearSearch}>&times;</button>
                )}
            </div>
            <div className="buttons">
                <button id="scavenge" className="button" onClick={handleScavenge}>Scavenge</button>
                <span className="separator">/</span>
                <button id="browseAll" onClick={handleBrowseAll}>Browse All</button>
            </div>
            <div id="searchResult"></div>
        </div>
    );
};

export default Home;