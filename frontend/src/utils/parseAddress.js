import { Address } from '@ton/core';

export const parseAddress = (addressString) => {
    try {
        return Address.parse(addressString);
    } catch (error) {
        console.error('Failed to parse address:', error);
        throw new Error('Invalid address format');
    }
};
