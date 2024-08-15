const { beginCell, contractAddress, Cell, contractAddressFromStateInit } = require('@ton/core');
const fs = require('fs');

async function test() {
    try {
        console.log("Loading contract code...");
        const codeCell = Cell.fromBoc(fs.readFileSync('./build/SwapContract.cell'))[0];

        console.log("Creating a minimal StateInit cell...");
        const stateInit = beginCell()
            .storeRef(codeCell)
            .endCell();

        console.log("StateInit Cell:");
        console.log(stateInit.toString());

        console.log("Calculating contract address...");
        const contractAddr = contractAddress({
            workchain: 0,
            initialData: stateInit,
            initialCode: codeCell,
        });

        console.log(`Contract Address: ${contractAddr.toString()}`);
    } catch (err) {
        console.log("Error calculating contract address:", err);
    }
}

test();
