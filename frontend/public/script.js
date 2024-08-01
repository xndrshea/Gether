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

    // TON address validation (simplified)
    if (!/^[0-9A-Za-z_-]{48}$/.test(tokenAddress)) {
        searchResult.innerHTML = 'Invalid TON address format. Please enter a valid TON address.';
        return;
    }

    // Redirect to the token-specific page
    window.location.href = `token-page.html?address=${encodeURIComponent(tokenAddress)}`;
}