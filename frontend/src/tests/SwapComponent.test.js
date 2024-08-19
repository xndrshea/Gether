import React from 'react';
import { render, act } from '@testing-library/react';
import SwapComponent from '../components/SwapComponent';
import { Asset, PoolType } from '@dedust/sdk';

jest.mock('@dedust/sdk', () => ({
    Asset: {
        native: jest.fn(),
        jetton: jest.fn(),
    },
    PoolType: {
        VOLATILE: {
            getPool: jest.fn(),
        },
    },
}));

jest.mock('../components/TonConnectButton', () => ({
    useWallet: () => ({ address: 'mocked-wallet-address' }),
}));

describe('SwapComponent', () => {
    it('fetches pool data correctly', async () => {
        const mockPool = { address: 'mock-pool-address' };
        PoolType.VOLATILE.getPool.mockResolvedValue(mockPool);

        await act(async () => {
            render(<SwapComponent currentTokenAddress="EQB02DJ0cdUD4iQDRbBv4aYG3htePHBRK1tGeRtCnatescK0" />);
        });

        expect(PoolType.VOLATILE.getPool).toHaveBeenCalled();

        // Print the mock pool address
        console.log('Pool address:', mockPool.address);
    });
});