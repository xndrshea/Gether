const TonWeb = require('tonweb');
const fs = require('fs');
const tonweb = new TonWeb(new TonWeb.HttpProvider('http://localhost:8081')); // Initialize TonWeb with local endpoint

async function deploy() {
    // Generate a new key pair
    const keyPair = TonWeb.utils.newKeyPair();
    const publicKey = keyPair.publicKey;
    const secretKey = keyPair.secretKey;

    console.log('Generated Public Key:', publicKey.toString('hex'));
    console.log('Generated Secret Key:', secretKey.toString('hex'));

    // Create a wallet using the generated keys
    const WalletClass = tonweb.wallet.all.v3R2; // Use the correct wallet class
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: publicKey,
        wc: 0 // Workchain ID
    });

    // Retrieve the sequence number
    let seqno;
    try {
        seqno = await wallet.methods.seqno().call();
        if (seqno === undefined) {
            seqno = 0; // Default to 0 if there's an error
        }
    } catch (error) {
        console.error('Error retrieving seqno, defaulting to 0:', error);
        seqno = 0; // Default to 0 if there's an error
    }

    // Read the compiled contract code
    const contractCode = fs.readFileSync('./build/SwapContract.cell', { encoding: 'base64' });
    const contractData = new TonWeb.boc.Cell(); // Modify this to include your contract's initial data

    // Prepare the deploy message
    const transfer = wallet.methods.transfer({
        secretKey: secretKey,
        toAddress: wallet.getAddress(),
        amount: TonWeb.utils.toNano('0.01'), // Amount in nanograms (1 TON = 1,000,000,000 nanograms)
        seqno: seqno,
        payload: contractCode,
        sendMode: 3,
    });

    // Send the deploy message
    await transfer.send();

    console.log(`Contract deployed at address: ${wallet.getAddress().toString(true, true, true)}`);
}

deploy().catch(console.error);