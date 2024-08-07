// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import TonConnectButton from './components/TonConnectButton';
import TokenPage from './components/TokenPage';
import Home from './components/Home';
import ScrollToTop from './components/ScrollToTop';
import ScrollButton from './components/ScrollButton';
import BrowseAll from './components/BrowseAll';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <header className="App-header">
        <div className="wallet-connect-container">
          <TonConnectButton />
        </div>
      </header>
      <div className="App">
        <div className="App-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tokenpage/:address" element={<TokenPage />} />
            <Route path="/browse" element={<BrowseAll />} />
          </Routes>
        </div>
        <ScrollButton />
      </div>
    </Router>
  );
}

export default App;