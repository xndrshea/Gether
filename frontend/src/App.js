// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import TonConnectButton from './components/TonConnectButton';
import TokenPage from './components/TokenPage';
import Home from './components/Home'; // Import the Home component

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <TonConnectButton />
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tokenpage/:address" element={<TokenPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
