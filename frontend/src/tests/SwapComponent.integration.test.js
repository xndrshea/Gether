import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SwapComponent from '../components/SwapComponent';
import { Asset, PoolType } from '@dedust/sdk';
import { Address } from '@ton/core';

// Mock the wallet connection
jest.mock('../components/TonConnectButton', () => ({
    useWallet: () => ({ address: 'EQD__________________________________________' }),
}));

describe('SwapComponent Integration', () => {
    it('fetches real pool data and performs a swap', async () => {
        const realTokenAddress = "EQB02DJ0cdUD4iQDRbBv4aYG3htePHBRK1tGeRtCnatescK0"; // Replace with a real token address

        render(<SwapComponent currentTokenAddress={realTokenAddress} tokenSymbol="TEST" />);

        // Wait for the component to load and fetch pool data
        await waitFor(() => {
            expect(screen.getByText(/Swap TON for TEST/i)).toBeInTheDocument();
        });

        // Input a swap amount
        const amountInput = screen.getByPlaceholderText('Amount');
        userEvent.type(amountInput, '1');

        // Click the swap button
        const swapButton = screen.getByText('Swap');
        userEvent.click(swapButton);

        // Wait for the swap to complete (this might take a while in a real scenario)
        await waitFor(() => {
            expect(screen.getByText(/Swap transaction completed/i)).toBeInTheDocument();
        }, { timeout: 10000 });

        // You can add more specific assertions here based on what your component does after a successful swap
    });

    it('fetches the correct pool address', async () => {
        const realTokenAddress = "EQB02DJ0cdUD4iQDRbBv4aYG3htePHBRK1tGeRtCnatescK0"; // Replace with a real token address

        const TON = Asset.native();
        const SCALE = Asset.jetton(Address.parse(realTokenAddress));

        const poolData = await PoolType.VOLATILE.getPool([TON, SCALE]);

        console.log('Real Pool address:', poolData.address);
        expect(poolData.address).toMatch(/^EQ[a-zA-Z0-9]{48}$/); // Expect TON address format
    });
});