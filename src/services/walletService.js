import TonConnect from '@tonconnect/sdk';

const connector = new TonConnect();

export const connectWallet = async () => {
    const walletConnectionSource = {
        universalLink: 'https://app.tonkeeper.com/ton-connect',
        bridgeUrl: 'https://bridge.tonapi.io/bridge'
    };

    try {
        const wallet = await connector.connect(walletConnectionSource);
        console.log('Wallet connected:', wallet.account.address);
        return wallet;
    } catch (error) {
        console.error('Failed to connect wallet:', error);
    }
};

export const disconnectWallet = () => {
    connector.disconnect();
    console.log('Wallet disconnected');
};

export const onStatusChange = (callback) => {
    connector.onStatusChange(callback);
};
