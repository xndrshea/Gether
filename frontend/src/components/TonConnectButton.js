import React, { useEffect, useState, createContext, useContext } from 'react';
import { TonConnect } from '@tonconnect/sdk';
import './TonConnectButton.css';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

const TonConnectButton = ({ onWalletConnect, children }) => {
    const [wallet, setWallet] = useState(null);
    const [tonConnect, setTonConnect] = useState(null);

    useEffect(() => {
        const connect = new TonConnect({
            manifestUrl: 'https://1083-84-115-238-161.ngrok-free.app/tonconnect-manifest.json' // Ensure this URL is correct
        });

        setTonConnect(connect);

        connect.onStatusChange((walletInfo) => {
            setWallet(walletInfo);
            onWalletConnect(walletInfo);
            console.log('Wallet status changed:', walletInfo);
        });

    }, [onWalletConnect]);

    const handleConnect = async () => {
        if (tonConnect) {
            try {
                console.log('Attempting to connect wallet...');
                await tonConnect.connect({
                    universalLink: 'https://app.tonkeeper.com/ton-connect',
                    bridgeUrl: 'https://bridge.tonapi.io/bridge',
                    jsBridgeKey: 'tonkeeper' // Ensure that Tonkeeper is the target
                });
            } catch (error) {
                console.error('Failed to connect wallet:', error);
            }
        }
    };

    const handleDisconnect = async () => {
        if (tonConnect) {
            try {
                console.log('Attempting to disconnect wallet...');
                await tonConnect.disconnect();
                setWallet(null);
                onWalletConnect(null);
                console.log('Wallet disconnected');
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
                        <p>Connected to wallet:</p>
                        <pre>{JSON.stringify(wallet, null, 2)}</pre>
                        <button onClick={handleDisconnect} className="TonConnectButton">Disconnect</button>
                    </div>
                ) : (
                    <button onClick={handleConnect} className="TonConnectButton">Connect Wallet</button>
                )}
                {children}
            </div>
        </WalletContext.Provider>

    );
};

export default TonConnectButton;
