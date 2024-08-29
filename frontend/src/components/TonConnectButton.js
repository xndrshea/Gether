import React, { useEffect, useState, createContext, useContext } from 'react';
import { TonConnect } from '@tonconnect/sdk';
import { v4 as uuidv4 } from 'uuid';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

const TonConnectButton = ({ onWalletConnect, children }) => {
    const [wallet, setWallet] = useState(null);
    const [tonConnect, setTonConnect] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const connect = new TonConnect({
            manifestUrl: 'https://your-manifest-url/tonconnect-manifest.json'
        });

        setTonConnect(connect);

        connect.onStatusChange((walletInfo) => {
            setWallet(walletInfo);
            if (walletInfo) {
                const newUserId = uuidv4();
                setUserId(newUserId);
                localStorage.setItem('userId', newUserId);
                onWalletConnect(walletInfo, newUserId);
            } else {
                setUserId(null);
                localStorage.removeItem('userId');
                onWalletConnect(null, null);
            }
        });

    }, [onWalletConnect]);

    const handleConnect = async () => {
        if (tonConnect) {
            try {
                await tonConnect.connect({
                    universalLink: 'https://app.tonkeeper.com/ton-connect',
                    bridgeUrl: 'https://bridge.tonapi.io/bridge',
                    jsBridgeKey: 'tonkeeper'
                });
            } catch (error) {
                console.error('Failed to connect wallet:', error);
            }
        }
    };

    const handleDisconnect = async () => {
        if (tonConnect) {
            try {
                await tonConnect.disconnect();
                setWallet(null);
                setUserId(null);
                localStorage.removeItem('userId');
                onWalletConnect(null, null);
            } catch (error) {
                console.error('Failed to disconnect wallet:', error);
            }
        }
    };

    return (
        <WalletContext.Provider value={wallet}>
            <div>
                {wallet ? (
                    <div>
                        <button
                            onClick={handleDisconnect}
                            className="bg-white text-black h-9 px-4 rounded-md cursor-pointer m-2.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-20 flex items-center justify-center"
                        >
                            <span className="hidden custom:inline">Disconnect Wallet</span>
                            <span className="custom:hidden">Disconnect</span>
                        </button>
                    </div>
                ) : (
                        <button
                            onClick={handleConnect}
                            className="bg-white text-black h-9 px-4 rounded-md cursor-pointer m-2.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-20 flex items-center justify-center"
                        >
                            <span className="hidden custom:inline">Connect Wallet</span>
                            <span className="custom:hidden">Connect</span>
                        </button>
                )}
                {children}
            </div>
        </WalletContext.Provider>
    )
};

export default TonConnectButton;
