document.addEventListener('DOMContentLoaded', function() {
    const tokenInput = document.getElementById('tokenAddress');
    const clearButton = document.getElementById('clearSearch');
    const scavengeButton = document.getElementById('scavenge');
    const browseAllButton = document.getElementById('browseAll');

    clearButton.addEventListener('click', function() {
        tokenInput.value = '';
        tokenInput.focus();
    });

    tokenInput.addEventListener('input', function() {
        clearButton.style.display = this.value ? 'block' : 'none';
    });

    scavengeButton.addEventListener('click', function() {
        console.log('Scavenge clicked');
        // Add scavenge functionality here
    });

    browseAllButton.addEventListener('click', function() {
        console.log('Browse All clicked');
        window.location.href = 'browseall.html';
    });

    // Initially hide the clear button
    clearButton.style.display = 'none';
});