import React from 'react';
import WalletConnectButton from './components/WalletConnectButton';
import './App.css';

const App = () => {
    return (
        <div className="container">
            <h1>Welcome to My Crypto App</h1>
            <p>Explore the world of cryptocurrencies</p>
            <div className="search-container">
                <input type="text" id="search-input" placeholder="Search for a cryptocurrency..." />
                <button id="search-button">Search</button>
            </div>
            <WalletConnectButton />
        </div>
    );
};

export default App;
