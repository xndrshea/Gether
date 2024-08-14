const TonWeb = require('tonweb');
const fs = require('fs');
const path = require('path');

// Load saved keys from the file
const keys = JSON.parse(fs.readFileSync(path.join(__dirname, 'keys.json')));

const tonweb = new TonWeb(new TonWeb.HttpProvider('http://localhost:8081'));

async function checkBalance() {
    const WalletClass = tonweb.wallet.all.v3R2;
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: Buffer.from(keys.publicKey, 'hex'),
        wc: 0
    });

    const walletAddress = await wallet.getAddress();
    console.log('Wallet Address:', walletAddress.toString(true, true, true));

    // Use the provider to get the balance directly
    const balance = await tonweb.provider.getBalance(walletAddress.toString(true, true, true));
    console.log(`Wallet balance: ${TonWeb.utils.fromNano(balance)} TON`);
}

checkBalance().catch(console.error);
