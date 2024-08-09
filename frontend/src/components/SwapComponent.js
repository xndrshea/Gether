import React, { useState } from 'react';
import TonWeb from 'tonweb';
import { useWallet } from './TonConnectButton';

const tonweb = new TonWeb();
const BN = TonWeb.utils.BN;

const SwapComponent = ({ currentTokenAddress }) => {
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState('buy'); // 'buy' or 'sell'
    const wallet = useWallet();

    const handleSwap = async () => {
        try {
            if (!wallet) {
                alert('Please connect your wallet');
                return;
            }

            const swapAmount = new BN(amount).mul(new BN(10).pow(new BN(9))); // Convert to nanograms

            let tx;
            if (mode === 'buy') {
                tx = await wallet.methods.transfer({
                    to: currentTokenAddress,
                    value: swapAmount,
                    bounce: false,
                    payload: '', // Payload for the swap contract
                    sendMode: 3,
                }).send();
            } else {
                // Implement the sell logic
                const swapContractAddress = 'YOUR_SWAP_CONTRACT_ADDRESS'; // Replace with your swap contract address
                const payload = ''; // Construct the payload as needed for your contract

                tx = await wallet.methods.transfer({
                    to: swapContractAddress,
                    value: swapAmount,
                    bounce: false,
                    payload,
                    sendMode: 3,
                }).send();
            }

            console.log('Swap transaction:', tx);
        } catch (error) {
            console.error('Error performing swap:', error);
        }
    };

    const toggleMode = () => {
        setMode((prevMode) => (prevMode === 'buy' ? 'sell' : 'buy'));
    };

    return (
        <div className="swap-component">
            <button className="toggle-button" onClick={toggleMode}>
                {mode === 'buy' ? 'Switch to Sell' : 'Switch to Buy'}
            </button>
            <h3>
                {mode === 'buy' ? `Swap TON for ${currentTokenAddress}` : `Sell ${currentTokenAddress} for TON`}
            </h3>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
            />
            <button onClick={handleSwap}>Swap</button>
        </div>
    );
};

export default SwapComponent;
