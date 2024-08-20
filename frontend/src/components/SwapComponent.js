import React, { useState, useEffect } from 'react';
import { Asset, PoolType, VaultJetton, Factory, MAINNET_FACTORY_ADDR, VaultNative } from '@dedust/sdk';
import { Address, toNano } from '@ton/core';
import { useWallet } from './TonConnectButton';
import { ReadinessStatus } from '@dedust/sdk';
import TonWeb from 'tonweb';

const factory = tonClient.open(Factory.createFromAddress(MAINNET_FACTORY_ADDR));
const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'));

const SwapComponent = ({ currentTokenAddress, tokenSymbol }) => {
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState('buy'); // 'buy' or 'sell'
    const [pool, setPool] = useState(null);
    const [vault, setVault] = useState(null);
    const [isOpen, setIsOpen] = useState(false); // State to track whether the container is open
    const [buttonText, setButtonText] = useState('Open Swap');
    const wallet = useWallet();

    useEffect(() => {
        const fetchPoolAndVault = async () => {
            if (!currentTokenAddress) return;

            if (typeof currentTokenAddress !== 'string') {
                console.error('Invalid token address. Expected a string.');
                return;
            }


            try {
                const TON = Asset.native();
                const tokenAddress = Address.parse(currentTokenAddress);
                const TOKEN = Asset.jetton(tokenAddress);

                // Fetch the pool using the Factory
                const poolData = await factory.getPool(PoolType.VOLATILE, [TON, TOKEN]);

                if (!poolData) {
                    console.error('Failed to fetch pool data: poolData is undefined.');
                    return;
                }

                // Ensure the pool is deployed and ready
                if ((await poolData.getReadinessStatus()) !== ReadinessStatus.READY) {
                    console.error('Pool is not deployed or ready.');
                    return;
                }

                setPool(poolData);
                console.log("Fetched Pool Data:", poolData);

                // Fetch the vault for the token
                const vaultData = await factory.getJettonVault(tokenAddress);

                if ((await vaultData.getReadinessStatus()) !== ReadinessStatus.READY) {
                    console.error('Vault is not deployed or ready.');
                    return;
                }

                setVault(vaultData);
                console.log("Fetched Vault Data:", vaultData);

            } catch (error) {
                console.error('Failed to fetch the pool or vault:', error);
            }
        };

        fetchPoolAndVault();
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

            const swapAmount = toNano(amount);

            if (mode === 'buy') {
                // Swapping TON to Token
                await vault.sendSwap(wallet, {
                    poolAddress: pool.address,
                    amount: swapAmount,
                    gasAmount: toNano('0.25'),
                });
            } else {
                // Swapping Token to TON
                const jettonRoot = VaultJetton.getJettonRoot(currentTokenAddress);
                const jettonWallet = await jettonRoot.getWallet(wallet.address);

                await jettonWallet.sendTransfer(wallet, toNano('0.3'), {
                    amount: swapAmount,
                    destination: vault.address,
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

                    {/* Display the fetched pool address */}
                    {pool && (
                        <div className="mt-2">
                            <p><strong>Pool Address:</strong> {pool.address.toString()}</p>
                        </div>
                    )}

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
