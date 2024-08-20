import { toNano } from '@ton/core';
import VaultJetton from '@dedust/sdk';

export const performSwap = async (wallet, pool, vault, amount, mode, tokenAddress) => {
    const swapAmount = toNano(amount);

    if (mode === 'buy') {
        // Swapping TON to Token
        await vault.sendSwap(wallet, {
            poolAddress: pool.address,
            amount: swapAmount,
            gasAmount: toNano('0.25'),
        });
    } else {
        // Swapping Token to TON
        const jettonRoot = VaultJetton.getJettonRoot(tokenAddress);
        const jettonWallet = await jettonRoot.getWallet(wallet.address);

        await jettonWallet.sendTransfer(wallet, toNano('0.3'), {
            amount: swapAmount,
            destination: vault.address,
            responseAddress: wallet.address,
            forwardAmount: toNano('0.25'),
            forwardPayload: VaultJetton.createSwapPayload({
                poolAddress: pool.address,
            }),
        });
    }
};
