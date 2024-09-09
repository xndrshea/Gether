import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/navigation/header.js';
import TokenPage from './TokenPage';
import Home from './components/Home';
import { ScrollToTop, ScrollButton } from './utils/ScrollUtils';
import BrowseAll from './components/BrowseAll';
import PostDetails from './components/PostDetails';
import Footer from './components/navigation/footer.js';

function App() {
  const [userId, setUserId] = useState(null);
  const [wallet, setWallet] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Check if there's a stored wallet and userId
    const storedWallet = localStorage.getItem('wallet');
    if (storedWallet) {
      const parsedWallet = JSON.parse(storedWallet);
      setWallet(parsedWallet);
      const storedUserIds = JSON.parse(localStorage.getItem('userIds')) || {};
      setUserId(storedUserIds[parsedWallet.account.address] || null);
    }
  }, []);

  const handleWalletConnect = (newWallet, newUserId) => {
    setWallet(newWallet);
    setUserId(newUserId);
    if (newWallet) {
      localStorage.setItem('wallet', JSON.stringify(newWallet));
      // Update the userIds in localStorage
      const storedUserIds = JSON.parse(localStorage.getItem('userIds')) || {};
      storedUserIds[newWallet.account.address] = newUserId;
      localStorage.setItem('userIds', JSON.stringify(storedUserIds));
    } else {
      localStorage.removeItem('wallet');
      // Optionally, you might want to remove the userId from storage when disconnecting
      // const storedUserIds = JSON.parse(localStorage.getItem('userIds')) || {};
      // delete storedUserIds[wallet.account.address];
      // localStorage.setItem('userIds', JSON.stringify(storedUserIds));
    }
  };

  return (
    <>
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
      {location.pathname === '/' && <Footer />}
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;