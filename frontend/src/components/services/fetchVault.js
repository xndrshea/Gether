/***import factory from './factory';
import { Address } from '@ton/core';

export const fetchVault = async (tokenAddress, isNative = false) => {
    try {
        // Validate tokenAddress and ensure it's correctly initialized as an Address instance
        if (!tokenAddress) {
            throw new Error('Invalid token address provided.');
        }

        const address = tokenAddress instanceof Address
            ? tokenAddress
            : new Address(tokenAddress);

        console.log('Fetching vault for address:', address.toString());

        let vault;
        if (isNative) {
            console.log('Fetching native vault');
            vault = await factory.getNativeVault();
        } else {
            console.log('Fetching jetton vault for address:', address.toString());
            vault = await factory.getJettonVault(address);
        }

        if (!vault) {
            throw new Error('Vault not found');
        }

        const readinessStatus = await vault.getReadinessStatus();
        console.log('Debug: Vault Readiness Status:', readinessStatus);

        if (readinessStatus !== 'READY') {
            throw new Error('Vault is not ready. Status: ' + readinessStatus);
        }

        return vault;
    } catch (error) {
        console.error('Error fetching vault:', error.message);
        console.error('Error stack:', error.stack);
        throw error;
    }
};***/
