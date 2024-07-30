import React, { useEffect, useState } from 'react';
import { connectWallet, disconnectWallet, onStatusChange } from '../services/walletService';

const WalletConnectButton = () => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Listen for wallet connection status changes
        onStatusChange((wallet) => {
            setIsConnected(!!wallet);
        });
    }, []);

    const handleConnect = async () => {
        await connectWallet();
    };

    const handleDisconnect = () => {
        disconnectWallet();
        setIsConnected(false);
    };

    return (
        <button onClick={isConnected ? handleDisconnect : handleConnect}>
            {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
        </button>
    );
};

export default WalletConnectButton;
