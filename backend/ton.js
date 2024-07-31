const { TonClient } = require("ton-client-node-js");

const client = new TonClient({
    network: {
        server_address: "https://main.ton.dev"
    }
});

async function getBalance(address) {
    const { result } = await client.net.query_collection({
        collection: "accounts",
        filter: { id: { eq: address } },
        result: "balance"
    });

    return result[0] ? parseInt(result[0].balance, 16) : 0;
}

module.exports = { getBalance };
