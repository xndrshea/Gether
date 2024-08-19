// FetchTokenData.js

const API_BASE_URL = 'http://localhost:5001';

export const initApi = async () => {
    try {
        const apiUrl = 'https://tonapi.io/v2/';
        const apiKey = 'AE7SQYEEE7WRMNIAAAAKKP7NQD563K2HAZFZOCO4IV4DVONWHB5A7P3ESI6XTHVH7WETHWI';
        return { apiUrl, apiKey };
    } catch (error) {
        console.error('Error loading configuration:', error);
        throw error;
    }
};

export const fetchTokenData = async (tokenAddress) => {
    try {
        const { apiUrl, apiKey } = await initApi();
        const response = await fetch(`${apiUrl}jettons/${tokenAddress}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'accept': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        return data.result || data;
    } catch (error) {
        console.error('Error loading token info:', error);
        throw error;
    }
};

export const saveTokenInfoToDatabase = async (address, tokenInfo) => {
    try {
        const response = await fetch(`${API_BASE_URL}/tokens`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address,
                name: tokenInfo.metadata?.name,
                symbol: tokenInfo.metadata?.symbol,
                description: tokenInfo.metadata?.description,
                metadata: tokenInfo.metadata,
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Token info saved to database');
    } catch (error) {
        console.error('Error saving token info to database:', error);
        throw error;
    }
};

export const fetchPosts = async (tokenAddress) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${tokenAddress}`);
        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }
        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error('Error loading posts:', error);
        throw error;
    }
};