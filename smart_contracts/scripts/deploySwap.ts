import { toNano } from '@ton/core';
import { Swap } from '../wrappers/Swap';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const swap = provider.open(
        Swap.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('Swap')
        )
    );

    await swap.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(swap.address);

    console.log('ID', await swap.getID());
}
