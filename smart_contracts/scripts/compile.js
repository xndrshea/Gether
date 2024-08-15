const { compileFunc } = require('@ton-community/func-js');
const fs = require('fs');
const path = require('path');

async function compile() {
    try {
        const buildDir = path.join(__dirname, '../build');
        if (!fs.existsSync(buildDir)) {
            fs.mkdirSync(buildDir);
        }

        const result = await compileFunc({
            sources: [
                {
                    filename: 'contracts/imports/stdlib.fc',
                    content: fs.readFileSync(path.join(__dirname, '../contracts/imports/stdlib.fc')).toString(),
                },
                {
                    filename: 'contracts/SwapContract.fc',
                    content: fs.readFileSync(path.join(__dirname, '../contracts/SwapContract.fc')).toString(),
                },
            ],
        });

        if (result.status === 'error') {
            console.error('Compilation failed:', result.message);
            return;
        }

        fs.writeFileSync(path.join(buildDir, 'SwapContract.cell'), result.codeBoc, 'base64');
        console.log('Compilation successful, BOC saved to build/SwapContract.cell');
    } catch (error) {
        console.error('Error during compilation:', error);
    }
}

compile();