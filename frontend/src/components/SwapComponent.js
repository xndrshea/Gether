import React, { useState, useEffect } from 'react';
import TonWeb from 'tonweb';
import { useWallet } from './TonConnectButton';
import { Asset, PoolType, JettonRoot, VaultJetton } from '@dedust/sdk';
import { toNano, Address } from '@ton/core';

const tonweb = new TonWeb(); // Initialize the TonWeb client
const BN = TonWeb.utils.BN; // Initialize BN for Big Number calculations

const SwapComponent = ({ currentTokenAddress, tokenSymbol }) => {
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState('buy'); // 'buy' or 'sell'
    const [pool, setPool] = useState(null);
    const [isOpen, setIsOpen] = useState(false); // State to track whether the container is open
    const [buttonText, setButtonText] = useState('Open Swap');
    const wallet = useWallet();

    useEffect(() => {
        // Fetch the pool for the current token and TON when the token address changes
        const fetchPool = async () => {
            if (!currentTokenAddress) return;

            const TON = Asset.native();
            const tokenAddress = Address.parse(currentTokenAddress);
            const SCALE = Asset.jetton(tokenAddress);

            // Assuming you need to get the pool using the DeDust SDK
            try {
                const poolData = await PoolType.VOLATILE.getPool([TON, SCALE]);
                setPool(poolData);
            } catch (error) {
                console.error('Failed to fetch the pool:', error);
            }
        };

        fetchPool();
    }, [currentTokenAddress]);

    const handleSwap = async () => {
        try {
            if (!wallet) {
                alert('Please connect your wallet');
                return;
            }

            if (!pool) {
                alert('No liquidity pool found for this token');
                return;
            }

            const swapAmount = new BN(amount).mul(new BN(10).pow(new BN(9))); // Convert to nanograms

            if (mode === 'buy') {
                // Swapping TON to Token
                const tonVault = await VaultJetton.getNativeVault();

                await tonVault.sendSwap(wallet, {
                    poolAddress: pool.address,
                    amount: swapAmount,
                    gasAmount: toNano('0.25'),
                });
            } else {
                // Swapping Token to TON
                const tokenVault = await VaultJetton.getJettonVault(currentTokenAddress);
                const scaleRoot = tonweb.open(JettonRoot.createFromAddress(currentTokenAddress));
                const scaleWallet = tonweb.open(await scaleRoot.getWallet(wallet.address));

                await scaleWallet.sendTransfer(wallet, toNano('0.3'), {
                    amount: swapAmount,
                    destination: tokenVault.address,
                    responseAddress: wallet.address,
                    forwardAmount: toNano('0.25'),
                    forwardPayload: VaultJetton.createSwapPayload({
                        poolAddress: pool.address,
                    }),
                });
            }

            console.log('Swap transaction completed.');
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
        }, 300); // Delay the text change by 300 milliseconds
    };

    return (
        <div
            className={`${isOpen ? 'w-60' : 'w-40'
                } bg-blue-600 text-white p-5 rounded-lg shadow-md z-1000 transition-width duration-300`}
        >
            <button
                className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded w-full cursor-pointer"
                onClick={handleToggle}
            >
                {buttonText}
            </button>
            {isOpen && (
                <div className="mt-4 text-left">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded mb-4 w-full cursor-pointer"
                        onClick={toggleMode}
                    >
                        {mode === 'buy' ? 'Switch to Sell' : 'Switch to Buy'}
                    </button>
                    <h3 className="mt-0 mb-2 font-bold">
                        {mode === 'buy' ? `Swap TON for ${tokenSymbol || 'Token'}` : `Sell ${tokenSymbol || 'Token'} for TON`}
                    </h3>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                        className="w-full p-2 pl-10 text-sm text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-200 border-none mb-4"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded w-full cursor-pointer"
                        onClick={handleSwap}
                    >
                        Swap
                    </button>
                </div>
            )}
        </div>
    );
};

export default SwapComponent;