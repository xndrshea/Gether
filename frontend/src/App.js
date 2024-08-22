// src/App.js
import React from 'react';
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

function Header() {
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
        <TonConnectButton />
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <div className="App">
        <div className="App-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tokenpage/:address" element={<TokenPage />} />
            <Route path="/browse" element={<BrowseAll />} />
            <Route path="/post/:postId" element={<PostDetails />} />
          </Routes>
        </div>
        <ScrollButton />
      </div>
    </Router>
  );
}

export default App;