const TonWeb = require('tonweb');
const fs = require('fs');
const path = require('path');

// Load saved keys from the file
const keys = JSON.parse(fs.readFileSync(path.join(__dirname, 'keys.json')));

// Initialize TonWeb with your local node endpoint
const tonweb = new TonWeb(new TonWeb.HttpProvider('http://localhost:8081'));

// Correctly import the Cell class from TonWeb.boc
const Cell = TonWeb.boc.Cell;

async function deploy() {
    const publicKey = Buffer.from(keys.publicKey, 'hex');
    const secretKey = Buffer.from(keys.secretKey, 'hex');

    console.log('Using Public Key:', keys.publicKey);
    console.log('Using Secret Key:', keys.secretKey);

    const WalletClass = tonweb.wallet.all.v3R2;
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: publicKey,
        wc: 0
    });

    // Load contract code from .cell file
    const contractCode = fs.readFileSync('./build/SwapContract.cell');  // Read the .cell file directly
    const contractCell = Cell.fromBoc(contractCode)[0];  // Decode the contract cell

    // Create an extremely simple contract data cell (minimize data)
    const contractData = new Cell();
    contractData.bits.writeUint(0, 32);  // Store a simple integer (e.g., 0)

    // Create StateInit cell
    const stateInit = new Cell();
    stateInit.bits.writeUint(0, 32);  // Workchain ID
    stateInit.refs.push(contractCell);  // Add code cell
    stateInit.refs.push(contractData);  // Add data cell

    // Generate wallet address
    const contractAddress = wallet.getAddress();

    let seqno;
    try {
        seqno = await wallet.methods.seqno().call();
        if (typeof seqno !== 'number') {
            throw new Error('Invalid seqno retrieved');
        }
    } catch (error) {
        console.error('Error retrieving seqno, defaulting to 0:', error);
        seqno = 0;
    }

    // Deploy the contract
    const transfer = wallet.methods.transfer({
        secretKey: secretKey,
        toAddress: contractAddress,
        amount: TonWeb.utils.toNano('0.01'),  // Adjust the deployment amount as needed
        seqno: seqno,
        payload: stateInit.toBoc(false).toString('base64'),  // Encode stateInit as BOC
        sendMode: 3,
    });

    await transfer.send();

    console.log(`Contract deployed at address: ${contractAddress.toString(true, true, true)}`);
}

deploy().catch(console.error);
