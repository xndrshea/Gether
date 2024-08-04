// src/components/SwapComponent.js
import React, { useState } from 'react';
import TonWeb from 'tonweb';

const tonweb = new TonWeb();
const BN = TonWeb.utils.BN;

const SwapComponent = ({ currentTokenAddress, wallet }) => {
    const [amount, setAmount] = useState('');
    const [swapAddress, setSwapAddress] = useState(currentTokenAddress);

    const handleSwap = async () => {
        try {
            if (!wallet) {
                alert('Please connect your wallet');
                return;
            }

            const swapAmount = new BN(amount).mul(new BN(10).pow(new BN(9))); // Convert to nanograms

            const tx = await wallet.methods.transfer({
                to: swapAddress,
                value: swapAmount,
                bounce: false,
                payload: '', // Payload for the swap contract
                sendMode: 3,
            }).send();

            console.log('Swap transaction:', tx);
        } catch (error) {
            console.error('Error performing swap:', error);
        }
    };

    return (
        <div className="swap-component">
            <h3>Swap</h3>
            <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
            />
            <input
                type="text"
                value={swapAddress}
                onChange={(e) => setSwapAddress(e.target.value)}
                placeholder="To Address"
            />
            <button onClick={handleSwap}>Swap</button>
        </div>
    );
};

export default SwapComponent;
