import React, { useEffect, useState } from 'react';
import { TonConnect } from '@tonconnect/sdk';

const TonConnectButton = () => {
    const [wallet, setWallet] = useState(null);
    const [tonConnect, setTonConnect] = useState(null);

    useEffect(() => {
        const connect = new TonConnect({
            manifestUrl: 'http://localhost:5000/tonconnect-manifest.json' // Update with your actual URL
        });
        setTonConnect(connect);

        connect.onStatusChange((wallet) => {
            setWallet(wallet);
        });

    }, []);

    const handleConnect = async () => {
        if (tonConnect) {
            try {
                await tonConnect.connectWallet();
            } catch (error) {
                console.error('Failed to connect wallet:', error);
            }
        }
    };

    const handleDisconnect = async () => {
        if (tonConnect) {
            try {
                await tonConnect.disconnectWallet();
                setWallet(null);
            } catch (error) {
                console.error('Failed to disconnect wallet:', error);
            }
        }
    };

    return (
        <div>
            {wallet ? (
                <div>
                    <p>Connected to: {wallet.name}</p>
                    <button onClick={handleDisconnect}>Disconnect</button>
                </div>
            ) : (
                <button onClick={handleConnect}>Connect Wallet</button>
            )}
        </div>
    );
};

export default TonConnectButton;
