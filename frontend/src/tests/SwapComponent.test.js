import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SwapComponent from '../components/SwapComponent';
import { Asset, PoolType } from '@dedust/sdk';
import { Address } from '@ton/core';

// Mock the wallet connection
jest.mock('../components/TonConnectButton', () => ({
    useWallet: () => ({ address: 'EQD__________________________________________' }),
}));

describe('SwapComponent Integration', () => {
    it('fetches real pool data correctly', async () => {
        const realTokenAddress = "EQB02DJ0cdUD4iQDRbBv4aYG3htePHBRK1tGeRtCnatescK0"; // Replace with a real token address

        render(<SwapComponent currentTokenAddress={realTokenAddress} tokenSymbol="TEST" />);

        // Wait for the component to load and fetch pool data
        await waitFor(() => {
            // Check if the component renders without crashing
            expect(screen.getByText(/Open Swap/i)).toBeInTheDocument();
        }, { timeout: 5000 });

        // You can add more specific checks here if your component displays pool data
    });

    it('fetches the correct pool address directly', async () => {
        const realTokenAddress = "EQB02DJ0cdUD4iQDRbBv4aYG3htePHBRK1tGeRtCnatescK0"; // Replace with a real token address

        const TON = Asset.native();
        const SCALE = Asset.jetton(Address.parse(realTokenAddress));

        try {
            const poolData = await PoolType.VOLATILE.getPool([TON, SCALE]);
            console.log('Real Pool address:', poolData.address);
            expect(poolData.address).toMatch(/^EQ[a-zA-Z0-9]{48}$/); // Expect TON address format
        } catch (error) {
            console.error('Failed to fetch pool data:', error);
            throw error; // Re-throw the error to fail the test
        }
    });
});