// script.js

document.addEventListener('DOMContentLoaded', function() {
    const tokenInput = document.getElementById('tokenAddress');
    const clearButton = document.getElementById('clearSearch');
    const scavengeButton = document.getElementById('scavenge');
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

async function initApi() {
    try {
        const response = await fetch('toncenter.config.json');
        const config = await response.json();
        const apiKey = config.tonCenter.apiKey;
        const apiUrl = 'https://toncenter.com/api/v2/';
        return { apiUrl, apiKey };
    } catch (error) {
        console.error('Error loading configuration:', error);
        throw error;
    }
}

async function searchToken() {
    const tokenAddress = document.getElementById('tokenAddress').value.trim();
    const searchResult = document.getElementById('searchResult');

    if (!tokenAddress) {
        searchResult.innerHTML = 'Please enter a token address.';
        return;
    }

    try {
        const { apiUrl, apiKey } = await initApi();

        // TON address validation (simplified)
        if (!/^[0-9A-Za-z_-]{48}$/.test(tokenAddress)) {
            searchResult.innerHTML = 'Invalid TON address format. Please enter a valid TON address.';
            return;
        }

        try {
            const fullUrl = `${apiUrl}getAddressInformation?address=${tokenAddress}`;
            console.log('Full API URL:', fullUrl);

            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'X-API-Key': apiKey
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (data.error) {
                throw new Error(`API Error: ${data.error}`);
            }

            // Process and display the token info
            searchResult.innerHTML = `
                <h3>Address Information:</h3>
                <p>Address: ${tokenAddress}</p>
                <p>Balance: ${data.result.balance / 1e9} TON</p>
                <p>Status: ${data.result.state}</p>
                <pre>${JSON.stringify(data.result, null, 2)}</pre>
            `;
        } catch (error) {
            console.error('API Error:', error);
            searchResult.innerHTML = `Error connecting to API: ${error.message}. Please try again.`;
        }

    } catch (error) {
        console.error('Error searching token:', error);
        searchResult.innerHTML = `Error searching for token: ${error.message}. Please try again.`;
    }
}