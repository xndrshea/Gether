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
            <h2>${symbol || 'N/A'} - ${name || 'Unknown Token'}</h2>
        </div>
    `;
    tokenInfoElement.innerHTML = htmlContent;
};

export const extractImageUrl = (info) => {
    const urlRegex = /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif))/i;
    const match = JSON.stringify(info, null, 2).match(urlRegex);
    return match ? match[0] : null;
};

export const extractTokenDetails = (info) => {
    if (!info) {
        return { name: null, symbol: null, description: null };
    }

    const name = info.name || (info.jetton_content && info.jetton_content.data && info.jetton_content.data.name) || null;
    const symbol = info.symbol || (info.jetton_content && info.jetton_content.data && info.jetton_content.data.symbol) || null;
    const description = info.description || (info.jetton_content && info.jetton_content.data && info.jetton_content.data.description) || null;

    return { name, symbol, description };
};