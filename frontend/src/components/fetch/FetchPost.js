// FetchPost.js

import { extractTokenDetails } from '../tokenInfo';

const API_BASE_URL = 'http://localhost:5001';

export const fetchTokenInfo = async (tokenAddress) => {
    try {
        const response = await fetch(`${API_BASE_URL}/tokens/${tokenAddress}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return extractTokenDetails(data);
    } catch (error) {
        console.error(`Error fetching token info for ${tokenAddress}:`, error);
        return null;
    }
};

export const fetchAllPosts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const posts = await response.json();
        const tokenInfoPromises = posts.map(post =>
            post.token_address ? fetchTokenInfo(post.token_address) : null
        );
        const tokenInfoResults = await Promise.all(tokenInfoPromises);
        const tokenInfo = {};
        tokenInfoResults.forEach((info, index) => {
            if (info && posts[index].token_address) {
                tokenInfo[posts[index].token_address] = info;
            }
        });
        return { posts, tokenInfo };
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const fetchPostDetails = async (postId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/detail/${postId}`);
        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }
        const post = await response.json();
        let tokenInfo = null;
        if (post.token_address) {
            tokenInfo = await fetchTokenInfo(post.token_address);
        }
        return { post, tokenInfo };
    } catch (error) {
        console.error('Error fetching post details:', error);
        throw error;
    }
};

