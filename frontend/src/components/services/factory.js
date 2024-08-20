import { Factory, MAINNET_FACTORY_ADDR } from '@dedust/sdk';
import tonClient from './tonClient';

// Debugging
console.log('MAINNET_FACTORY_ADDR:', MAINNET_FACTORY_ADDR);

// Ensure MAINNET_FACTORY_ADDR is an Address object
if (typeof MAINNET_FACTORY_ADDR !== 'object' || !MAINNET_FACTORY_ADDR.toString) {
    throw new Error('MAINNET_FACTORY_ADDR is not a valid Address object');
}

const factory = new Factory(MAINNET_FACTORY_ADDR);

export default factory;
