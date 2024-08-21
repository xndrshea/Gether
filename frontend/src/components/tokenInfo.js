export const displayTokenInfo = (info, address) => {
    const tokenInfoElement = document.getElementById('tokenInfo');

    if (!info) {
        tokenInfoElement.innerHTML = 'No token information available';
        return;
    }

    const imageUrl = extractImageUrl(info);
    const { name, symbol, description } = extractTokenDetails(info);

    const paddingBottom = description ? '0' : '20px';

    const htmlContent = `
        <div style="display: flex; align-items: center; padding-bottom: ${paddingBottom};">
            ${imageUrl ? `<img src="${imageUrl}" alt="Token Image" style="width: 100px; height: 100px; border-radius: 50%; margin-right: 20px; margin-bottom: 20px;">` : ''}
            <div>
                <h2 class="text-3xl font-bold">${symbol || 'N/A'} - ${name || 'Unknown Token'}</h2>
                <p class="text-sm text-gray-500 mt-1 cursor-pointer hover:text-gray-700" onclick="copyToClipboard('${address}')" title="Click to copy">
                    ${address}
                </p>
            </div>
        </div>
    `;
    tokenInfoElement.innerHTML = htmlContent;

    window.copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Address copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };
};

export const extractImageUrl = (data) => {
    if (data.metadata && data.metadata.image) {
        return data.metadata.image;
    }
    return null;
};

export const extractTokenDetails = (info) => {
    if (!info || !info.metadata) {
        return { name: null, symbol: null, description: null };
    }

    const name = info.metadata.name;
    const symbol = info.metadata.symbol;
    const description = info.metadata.description;

    return { name, symbol, description };
};