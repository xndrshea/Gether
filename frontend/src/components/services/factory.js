import { Factory, MAINNET_FACTORY_ADDR } from '@dedust/sdk';

console.log('MAINNET_FACTORY_ADDR:', MAINNET_FACTORY_ADDR.toString());

const factory = new Factory(MAINNET_FACTORY_ADDR);

console.log('Factory initialized with address:', factory.address.toString());

export default factory;