// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import TonConnectButton from './components/TonConnectButton';
import LogoHeader from './components/LogoHeader';
import TokenPage from './TokenPage';
import Home from './components/Home';
import { ScrollToTop, ScrollButton } from './components/ScrollUtils';
import BrowseAll from './components/BrowseAll';
import PostDetails from './components/PostDetails';
import SearchContainer from './components/SearchContainer';

function Header({ userId, onWalletConnect }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="App-header flex items-center justify-between px-4">
      <div className="logo-container">
        <LogoHeader />
      </div>
      {!isHomePage && (
        <div className="search-container flex-grow mx-4">
          <SearchContainer />
        </div>
      )}
      <div className="wallet-connect-container">
        <TonConnectButton onWalletConnect={onWalletConnect} />
      </div>
    </header>
  );
}

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const handleWalletConnect = (wallet, newUserId) => {
    setUserId(newUserId);
  };

  return (
    <Router>
      <ScrollToTop />
      <Header userId={userId} onWalletConnect={handleWalletConnect} />
      <div className="App">
        <div className="App-content">
          <Routes>
            <Route path="/" element={<Home userId={userId} />} />
            <Route path="/tokenpage/:address" element={<TokenPage userId={userId} />} />
            <Route path="/browse" element={<BrowseAll userId={userId} />} />
            <Route path="/post/:postId" element={<PostDetails userId={userId} />} />
          </Routes>
        </div>
        <ScrollButton />
      </div>
    </Router>
  );
}

export default App;