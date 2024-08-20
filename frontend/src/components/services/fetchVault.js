import factory from './factory';

export const fetchVault = async (tokenAddress) => {
    const vault = await factory.getJettonVault(tokenAddress);

    if (!vault || (await vault.getReadinessStatus()) !== 'READY') {
        throw new Error('Vault is not deployed or ready.');
    }

    return vault;
};
