import React from 'react';
import './App.css';
import TonConnectButton from './components/TonConnectButton'; // Import the TonConnectButton component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TonConnectButton /> {/* Add the TonConnectButton component here */}
      </header>
    </div>
  );
}

export default App;
