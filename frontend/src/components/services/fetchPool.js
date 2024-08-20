import tonweb from './tonClient.js';
import factory from './factory';
import { Asset, PoolType } from '@dedust/sdk';
import { Address } from '@ton/core';

export const fetchPool = async (tokenAddress) => {
    try {
        // Fetch all pools from the Dedust API
        const response = await fetch('https://api.dedust.io/v2/pools');
        const pools = await response.json();

        // Ensure tokenAddress is an Address instance
        const formattedTokenAddress = tokenAddress instanceof Address
            ? tokenAddress.toString()
            : new Address(tokenAddress).toString();

        // Find the pool that includes the given token address
        const targetPool = pools.find(pool =>
            pool.assets.some(asset =>
                asset.type === 'jetton' && asset.address === formattedTokenAddress
            )
        );

        if (!targetPool) {
            throw new Error('Pool not found for the given token address');
        }

        console.log('Found Pool Address:', targetPool.address);
        return targetPool.address;

    } catch (error) {
        console.error('Error finding pool:', error.message);
        console.error('Error stack:', error.stack);
        throw error;
    }
};