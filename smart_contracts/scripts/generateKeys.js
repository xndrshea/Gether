const TonWeb = require('tonweb');

async function generateKeys() {
    const tonweb = new TonWeb();
    const keyPair = tonweb.utils.newKeyPair();
    console.log('Public Key:', keyPair.publicKey.toString('hex'));
    console.log('Secret Key:', keyPair.secretKey.toString('hex'));
    return keyPair;
}

generateKeys().catch(console.error);