const TonWeb = require('tonweb');
const fs = require('fs');
const path = require('path');

async function generateAddress() {
    const tonweb = new TonWeb();
    const keys = JSON.parse(fs.readFileSync(path.join(__dirname, 'keys.json'), 'utf-8'));

    // Initialize a new wallet using the public key
    const WalletClass = tonweb.wallet.all.v3R2; // Assuming you're using a v3 wallet
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: Buffer.from(keys.publicKey, 'hex'),
        wc: 0  // Usually 0 for mainnet/testnet wallets
    });

    // Get the wallet address
    const address = await wallet.getAddress();
    const addressString = address.toString(true, true, true);

    console.log(`Wallet Address: ${addressString}`);

    // Save the wallet address to a file
    const addressData = {
        address: addressString
    };
    fs.writeFileSync(path.join(__dirname, 'address.json'), JSON.stringify(addressData, null, 2));

    console.log('Wallet address saved to address.json');
}

generateAddress().catch(console.error);
