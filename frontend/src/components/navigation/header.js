import React from 'react';
import { useLocation } from 'react-router-dom';
import TonConnectButton from '../TonConnectButton';
import LogoHeader from './LogoHeader';
import SearchContainer from '../SearchContainer';

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

export default Header;