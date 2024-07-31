import { getblock } from './getblock.config.js';

document.addEventListener('DOMContentLoaded', function() {
    const tokenInput = document.getElementById('tokenAddress');
    const clearButton = document.getElementById('clearSearch');
    const scavengeButton = document.getElementById('scavenge');
    scavengeButton.addEventListener('click', searchToken);
    const browseAllButton = document.getElementById('browseAll');
    const searchResult = document.getElementById('searchResult');

    clearButton.addEventListener('click', function() {
        tokenInput.value = '';
        tokenInput.focus();
        searchResult.innerHTML = '';
    });

    tokenInput.addEventListener('input', function() {
        clearButton.style.display = this.value ? 'block' : 'none';
    });

    scavengeButton.addEventListener('click', searchToken);

    browseAllButton.addEventListener('click', function() {
        console.log('Browse All clicked');
        window.location.href = 'browseall.html';
    });

    clearButton.style.display = 'none';
});

function initApi() {
    const tonToken = getblock.shared.ton.mainnet.indexerV3[0];
    const apiUrl = tonToken.go();
    const apiKey = tonToken.token();

    return { apiUrl, apiKey };
}

async function searchToken() {
    const tokenAddress = document.getElementById('tokenAddress').value.trim();
    const searchResult = document.getElementById('searchResult');

    if (!tokenAddress) {
        searchResult.innerHTML = 'Please enter a token address.';
        return;
    }

    try {
        const { apiUrl, apiKey } = initApi();

        // Validate the address (simplified)
        if (!/^[0-9a-fA-F]{64}$/.test(tokenAddress)) {
            searchResult.innerHTML = 'Invalid TON address format.';
            return;
        }

        // Test API connection
        try {
            const testResponse = await tonweb.provider.getVersion();
            console.log('API Test Response:', testResponse);
        } catch (error) {
            console.error('API Test Error:', error);
            searchResult.innerHTML = 'Error connecting to API. Please try again.';
            return;
        }

        // Fetch token info
        const tokenInfo = await fetchTokenInfo(apiUrl, apiKey, tokenAddress);

        // Display the result
        searchResult.innerHTML = `
            <h3>Token Information:</h3>
            <p>Address: ${tokenInfo.address}</p>
            <p>Balance: ${TonWeb.utils.fromNano(tokenInfo.balance)} TON</p>
            <p>Type: ${tokenInfo.type}</p>
            ${tokenInfo.name ? `<p>Name: ${tokenInfo.name}</p>` : ''}
            ${tokenInfo.symbol ? `<p>Symbol: ${tokenInfo.symbol}</p>` : ''}
            ${tokenInfo.collection ? `<p>Collection: ${tokenInfo.collection}</p>` : ''}
        `;
    } catch (error) {
        console.error('Error searching token:', error);
        searchResult.innerHTML = `Error searching for token: ${error.message}. Please try again.`;
    }
}

async function fetchTokenInfo(apiUrl, apiKey, address) {
    const response = await fetch(`${apiUrl}getAddressInformation`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        },
        body: JSON.stringify({ address })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch token info');
    }

    const data = await response.json();

    // Simplified processing of the response
    return {
        address: address,
        balance: data.result.balance,
        type: determineContractType(data.result),
        // Add more fields as needed
    };
}

function determineContractType(accountInfo) {
    // Simplified logic to determine contract type
    if (accountInfo.code && accountInfo.code.length > 0) {
        return 'smart contract';
    }
    return 'wallet';
}