import React, { useEffect, useState, createContext, useContext, useCallback, useRef } from 'react';
import { TonConnect } from '@tonconnect/sdk';
import { v4 as uuidv4 } from 'uuid';
import Modal from 'react-modal'; // Import Modal

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

const TonConnectButton = ({ onWalletConnect, children }) => {
    const [wallet, setWallet] = useState(null);
    const [tonConnect, setTonConnect] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const lastWalletRef = useRef(null);
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

    const handleStatusChange = useCallback((walletInfo) => {
        console.log("Wallet status changed:", walletInfo);
        if (JSON.stringify(walletInfo) !== JSON.stringify(lastWalletRef.current)) {
            setWallet(walletInfo);
            setIsConnected(!!walletInfo);
            if (walletInfo) {
                const walletAddress = walletInfo.account.address;
                let storedUserIds = JSON.parse(localStorage.getItem('userIds')) || {};
                let newUserId = storedUserIds[walletAddress];
                if (!newUserId) {
                    newUserId = uuidv4();
                    storedUserIds[walletAddress] = newUserId;
                    localStorage.setItem('userIds', JSON.stringify(storedUserIds));
                }
                setUserId(newUserId);
                onWalletConnect(walletInfo, newUserId); // Make sure to call this with both wallet and userId
            } else {
                setUserId(null);
                onWalletConnect(null, null);
            }
            lastWalletRef.current = walletInfo;
        }
    }, [onWalletConnect]);

    useEffect(() => {
        const connect = new TonConnect({
            manifestUrl: 'http://localhost:5001/tonconnect-manifest.json'
        });

        setTonConnect(connect);

        const unsubscribe = connect.onStatusChange(handleStatusChange);

        // Check initial connection status
        connect.restoreConnection();

        return () => {
            unsubscribe();
        };
    }, [handleStatusChange]);

    const handleConnect = useCallback(async () => {
        if (tonConnect) {
            try {
                console.log("Attempting to connect wallet...");
                const result = await tonConnect.connect({
                    universalLink: 'https://ton-connect.github.io/bridge/',
                    bridgeUrl: 'https://bridge.tonapi.io/bridge',
                    jsBridgeKey: 'tonkeeper'
                });
                console.log("Connection result:", result);
            } catch (error) {
                console.error('Failed to connect wallet:', error);
                if (error.message.includes('WalletNotInjectedError')) {
                    setIsModalOpen(true); // Open modal if wallet is not injected
                }
            }
        } else {
            console.error('TonConnect not initialized');
        }
    }, [tonConnect]);

    const handleDisconnect = useCallback(async () => {
        if (isDisconnecting) return;
        setIsDisconnecting(true);
        console.log("Attempting to disconnect wallet...");
        console.log("Current tonConnect state:", tonConnect);
        if (tonConnect && isConnected) {
            try {
                await tonConnect.disconnect();
                console.log("Disconnect successful");
            } catch (error) {
                if (error.message === 'Missing connection' && error.code === 1) {
                    console.log('Connection already closed');
                } else {
                    console.error('Failed to disconnect wallet:', error);
                }
            } finally {
                setWallet(null);
                setUserId(null);
                setIsConnected(false);
                onWalletConnect(null, null);
            }
        } else {
            console.log('No active connection to disconnect');
        }
        setIsDisconnecting(false);
    }, [tonConnect, onWalletConnect, isConnected, isDisconnecting]);

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <WalletContext.Provider value={{ wallet, userId }}>
            <div>
                {isConnected ? (
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
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Wallet Not Found"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#1a1a1a',
                        borderRadius: '8px',
                        padding: '20px',
                        maxWidth: '400px',
                        zIndex: 9999, // Add this line
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        zIndex: 9998, // Add this line
                    },
                }}
            >
                <h2>TON Wallet Extension Not Found</h2>
                <p>Please install a TON wallet extension to connect your wallet.</p>
                <div className="flex justify-end">
                    <button onClick={closeModal} className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">Close</button>
                </div>
            </Modal>
        </WalletContext.Provider>
    );
};

export default TonConnectButton;