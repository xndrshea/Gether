import { toNano } from '@ton/core';
import { SwapContract } from '../wrappers/SwapContract';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const swapContract = provider.open(
        SwapContract.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('SwapContract')
        )
    );

    await swapContract.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(swapContract.address);

    console.log('ID', await swapContract.getID());
}
