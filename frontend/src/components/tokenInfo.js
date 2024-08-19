export const displayTokenInfo = (info) => {
    const tokenInfoElement = document.getElementById('tokenInfo');
    console.log('Displaying token info:', info);

    if (!info) {
        tokenInfoElement.innerHTML = 'No token information available';
        return;
    }

    const imageUrl = extractImageUrl(info);
    const { name, symbol, description } = extractTokenDetails(info);

    console.log('Name:', name);
    console.log('Symbol:', symbol);
    console.log('Description:', description);

    const paddingBottom = description ? '0' : '20px';

    const htmlContent = `
        <div style="display: flex; align-items: center; padding-bottom: ${paddingBottom};">
            ${imageUrl ? `<img src="${imageUrl}" alt="Token Image" style="width: 100px; height: 100px; border-radius: 50%; margin-right: 20px; margin-bottom: 20px;">` : ''}
            <h2 class="text-3xl font-bold">${symbol || 'N/A'} - ${name || 'Unknown Token'}</h2>
        </div>

    `;
    tokenInfoElement.innerHTML = htmlContent;
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