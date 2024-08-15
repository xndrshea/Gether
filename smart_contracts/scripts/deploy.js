const { Network, Tonfura } = require('tonfura-sdk');
const { WalletContractV4, internal, SendMode, beginCell, storeMessage } = require('@ton/ton');
const fs = require('fs');
const { Cell, contractAddress } = require('@ton/core');
require('dotenv').config();

const { TONFURA_KEY } = process.env;

async function deploy() {
    try {
        console.log("Loading contract code...");
        const codeCell = Cell.fromBoc(fs.readFileSync('./build/SwapContract.cell'))[0];
        const dataCell = new Cell(); // Assuming no initial data

        console.log("Loading wallet keys...");
        const keyData = JSON.parse(fs.readFileSync('./keys.json', 'utf8'));
        const publicKey = Buffer.from(keyData.publicKey, 'hex');
        const secretKey = Buffer.from(keyData.secretKey, 'hex');

        console.log("TONFURA_KEY:", TONFURA_KEY);

        // Initialize Tonfura with the custom endpoint
        const tonfura = new Tonfura({
            apiKey: TONFURA_KEY,
            endpoint: 'https://testnet-rpc.tonfura.com/v2/json-rpc',  // Custom endpoint without the key
            network: Network.Testnet,
        });

        const wallet = WalletContractV4.create({
            workchain: 0,
            publicKey,
        });

        console.log(`Wallet address: ${wallet.address}`);

        const seqno = (await tonfura.core.getWalletInformation(wallet.address.toString())).data.result.seqno;
        console.log(`Wallet seqno: ${seqno}`);

        const internalMessage = {
            to: wallet.address,
            value: "0.1", // Ensure you have enough balance
            init: {
                code: codeCell,
                data: dataCell,
            },
            body: 'data:application/json,{"p":"ton-20","op":"deploy","tick":"YourFirstInscription","amt":"1"}',
        };

        const externalMessage = internal({
            to: wallet.address,
            init: null,
            body: internalMessage,
        });

        const boc = beginCell()
            .store(storeMessage(externalMessage))
            .endCell()
            .toBoc();

        await tonfura.transact.sendBoc(boc.toString("base64"));
        console.log("Deployment successful!");
    } catch (error) {
        console.error("Deployment failed:", error.message);
        console.error("Stack trace:", error.stack);
    }
}

deploy();
