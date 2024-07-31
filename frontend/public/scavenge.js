document.addEventListener('DOMContentLoaded', function() {
    // Function to extract token name from URL or other source
    function getTokenName() {
        // This is a placeholder. You'll need to implement your own logic here.
        // For example, you could extract it from the URL:
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('token') || 'TokenName'; // Default to 'TONcoin' if not specified
    }

    // Function to update the token name in the HTML
    function updateTokenName(name) {
        document.getElementById('tokenName').textContent = name;
    }

    // Get and set the token name
    const tokenName = getTokenName();
    updateTokenName(tokenName);
});