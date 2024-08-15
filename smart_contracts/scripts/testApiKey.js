const axios = require('axios');
require('dotenv').config();

async function testAPIKey() {
    try {
        const response = await axios.post(
            'https://api.tonfura.com/v1/jsonrpc',  // Replace with the correct Tonfura API endpoint
            {
                jsonrpc: "2.0",
                method: "getWalletInformation",  // Ensure this is the correct method
                params: {
                    address: "EQAcuoEhBGqXHuSFjpPKQ0UlaspmlE_DeWDgQ0P8rLE7GSbl"  // Ensure this is the correct format
                },
                id: 1
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.TONFURA_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("API Key is valid. Response:", response.data);
    } catch (error) {
        console.error("API Key Test Failed:", error.response ? error.response.data : error.message);
    }
}

testAPIKey();
