import React, { useState, useEffect } from 'react';
import { fetchPool } from './services/fetchPool';
import { fetchVault } from './services/fetchVault';
import { performSwap } from './services/performSwap';
import { parseAddress } from '../utils/parseAddress';
import { useWallet } from './TonConnectButton';

const SwapComponent = ({ currentTokenAddress, tokenSymbol }) => {
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState('buy'); // 'buy' or 'sell'
    const [pool, setPool] = useState(null);
    const [vault, setVault] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [buttonText, setButtonText] = useState('Open Swap');
    const wallet = useWallet();

    useEffect(() => {
        const initializePoolAndVault = async () => {
            if (!currentTokenAddress) return;

            try {
                const tokenAddress = parseAddress(currentTokenAddress);

                const poolData = await fetchPool(tokenAddress);
                setPool(poolData);

                const vaultData = await fetchVault(tokenAddress);
                setVault(vaultData);
            } catch (error) {
                console.error('Error initializing pool or vault:', error);
            }
        };

        initializePoolAndVault();
    }, [currentTokenAddress]);

    const handleSwap = async () => {
        try {
            if (!wallet) {
                alert('Please connect your wallet');
                return;
            }

            if (!pool || !vault) {
                alert('No liquidity pool or vault found for this token');
                return;
            }

            await performSwap(wallet, pool, vault, amount, mode, currentTokenAddress);
        } catch (error) {
            console.error('Error performing swap:', error);
        }
    };

    const toggleMode = () => {
        setMode((prevMode) => (prevMode === 'buy' ? 'sell' : 'buy'));
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
        setTimeout(() => {
            setButtonText(isOpen ? 'Open Swap' : 'Collapse Swap');
        }, 300);
    };

    return (
        <div className={`${isOpen ? 'w-60' : 'w-40'} bg-blue-600 text-white p-5 rounded-lg shadow-md transition-width duration-300`}>
            <button className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded w-full cursor-pointer" onClick={handleToggle}>
                {buttonText}
            </button>
            {isOpen && (
                <div className="mt-4 text-left">
                    <button className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded mb-4 w-full cursor-pointer" onClick={toggleMode}>
                        {mode === 'buy' ? 'Switch to Sell' : 'Switch to Buy'}
                    </button>
                    <h3 className="mt-0 mb-2 font-bold">{mode === 'buy' ? `Swap TON for ${tokenSymbol || 'Token'}` : `Sell ${tokenSymbol || 'Token'} for TON`}</h3>
                    <button className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded w-full cursor-pointer" onClick={handleSwap}>
                        Swap
                    </button>
                </div>
            )}
        </div>
    );
};

export default SwapComponent;
