const TonWeb = require('tonweb');
const fs = require('fs');
const path = require('path');

async function generateKeys() {
    const tonweb = new TonWeb();
    const keyPair = tonweb.utils.newKeyPair();
    const keys = {
        publicKey: keyPair.publicKey.toString('hex'),
        secretKey: keyPair.secretKey.toString('hex')
    };

    console.log('Public Key:', keys.publicKey);
    console.log('Secret Key:', keys.secretKey);

    fs.writeFileSync(path.join(__dirname, 'keys.json'), JSON.stringify(keys, null, 2));
}

generateKeys().catch(console.error);
