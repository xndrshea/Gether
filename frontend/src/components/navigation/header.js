import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TonConnectButton from '../TonConnectButton';
import LogoHeader from './LogoHeader';
import SearchContainer from './SearchContainer';
import { useIsPhone } from '../../utils/useMediaQuery';

function Header({ userId, onWalletConnect }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isPhone = useIsPhone();
  const [logoWidth, setLogoWidth] = useState(0);
  const tonConnectRef = useRef(null);
  const logoContainerRef = useRef(null);

  useEffect(() => {
    const updateWidth = () => {
      if (tonConnectRef.current && logoContainerRef.current) {
        const width = tonConnectRef.current.offsetWidth;
        setLogoWidth(width);
        logoContainerRef.current.style.width = `${width}px`;
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [userId]);

  return (
    <header className="App-header flex items-stretch justify-between px-4 py-2 h-16">
      <div ref={logoContainerRef} className="flex-shrink-0 pl-2 flex items-center">
        <LogoHeader />
      </div>
      {!isHomePage && !isPhone && (
        <div className="flex-grow flex justify-center items-center mx-4" style={{ maxWidth: `calc(100% - ${2 * logoWidth}px)` }}>
          <div className="w-full max-w-[40rem]">
            <SearchContainer />
          </div>
        </div>
      )}
      <div ref={tonConnectRef} className="flex-shrink-0 flex items-center">
        <TonConnectButton onWalletConnect={onWalletConnect} />
      </div>
    </header>
  );
}

export default Header;