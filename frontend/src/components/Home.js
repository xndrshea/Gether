// frontend/src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleScavenge = () => {
        const tokenAddress = document.getElementById('tokenAddress').value.trim();
        if (tokenAddress) {
            navigate(`/tokenpage/${tokenAddress}`);
        } else {
            alert('Please enter a token address.');
        }
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
                <input type="text" id="tokenAddress" placeholder="Enter TON Token Address..." />
                <button id="clearSearch">&times;</button>
            </div>
            <div className="buttons">
                <button id="scavenge" className="button" onClick={handleScavenge}>Scavenge</button>
                <span className="separator">/</span>
                <button id="browseAll">Browse All</button>
            </div>
            <div id="searchResult"></div>
        </div>
    );
};

export default Home;
