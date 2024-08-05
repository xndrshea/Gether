import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import PostForm from './PostForm';
import CommentForm from './CommentForm';
import SwapComponent from './SwapComponent';
import '../styles.css';

const TokenPage = () => {
    const { address } = useParams();
    const [currentTokenAddress, setCurrentTokenAddress] = useState(null);
    const [tokenInfo, setTokenInfo] = useState(null);
    const [posts, setPosts] = useState([]);
    const [canCreatePost, setCanCreatePost] = useState(true);
    const [wallet, setWallet] = useState(null);

    useEffect(() => {
        const tokenAddress = address || new URLSearchParams(window.location.search).get('address');
        setCurrentTokenAddress(tokenAddress);

        if (tokenAddress) {
            console.log('Loading token info and posts for address:', tokenAddress);
            loadTokenInfo(tokenAddress);
            loadPosts(tokenAddress);
        } else {
            console.error('Invalid token address');
            setTokenInfo('Invalid token address');
            setCanCreatePost(false);
            updatePostingUI(false);
        }

        const submitPostElement = document.getElementById('submitPost');
        if (submitPostElement) {
            submitPostElement.addEventListener('click', createPost);
        }

        window.addEventListener('resize', updateBodyHeight);
        updateBodyHeight();

        return () => {
            if (submitPostElement) {
                submitPostElement.removeEventListener('click', createPost);
            }
            window.removeEventListener('resize', updateBodyHeight);
        };
    }, [address]);

    const scrollContainerRef = useRef(null);

    const updateBodyHeight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.height = `${window.innerHeight}px`;
        }
    };


    const loadTokenInfo = async (tokenAddress) => {
        console.log('loadTokenInfo called with address:', tokenAddress);
        try {
            const { apiUrl, apiKey } = await initApi();
            const fullUrl = `${apiUrl}getTokenData?address=${tokenAddress}`;
            console.log('Fetching token info from URL:', fullUrl);
            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'X-API-Key': apiKey,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Token info received:', data);
            if (data.error) {
                throw new Error(`API Error: ${data.error}`);
            }
            if (!data.result) {
                throw new Error('No result field in response data');
            }

            let tokenInfo = data.result;

            // Check if there's a URI in the jetton_content
            if (tokenInfo.jetton_content && tokenInfo.jetton_content.data && tokenInfo.jetton_content.data.uri) {
                const uriResponse = await fetch(tokenInfo.jetton_content.data.uri);
                if (uriResponse.ok) {
                    const uriData = await uriResponse.json();
                    // Merge the URI data with the existing token info
                    tokenInfo = { ...tokenInfo, ...uriData };
                } else {
                    console.error('Failed to fetch URI data');
                }
            }

            setTokenInfo(tokenInfo);
            displayTokenInfo(tokenInfo);
            setCanCreatePost(true);
            updatePostingUI(true);
        } catch (error) {
            console.error('Error loading token info:', error);
            setTokenInfo(`Error: ${error.message}`);
            setCanCreatePost(false);
            updatePostingUI(false);
        }
    };

    const loadPosts = async (tokenAddress) => {
        if (!tokenAddress) return;
        console.log('loadPosts called with address:', tokenAddress);
        try {
            const response = await fetch(`http://localhost:5001/posts/${tokenAddress}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const posts = await response.json();
            console.log('Posts received:', posts);
            setPosts(posts);
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    };

    const updatePostingUI = (canPost) => {
        const postForm = document.querySelector('.post-form');
        const postButton = document.getElementById('submitPost');
        const noCommunityMessage = document.getElementById('noCommunityMessage');

        if (postForm && postButton && noCommunityMessage) {
            if (canPost) {
                postForm.style.display = 'block';
                postButton.disabled = false;
                noCommunityMessage.style.display = 'none';
            } else {
                postForm.style.display = 'none';
                postButton.disabled = true;
                noCommunityMessage.style.display = 'block';
            }
        }
    };

    const createPost = () => {
        // Implement the createPost function
    };

    const displayTokenInfo = (info) => {
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

        const htmlContent = `
        <div style="display: flex; align-items: center;">
            ${imageUrl ? `<img src="${imageUrl}" alt="Token Image" style="width: 100px; height: 100px; border-radius: 50%; margin-right: 20px;">` : ''}
            <h2>${symbol || 'N/A'} - ${name || 'Unknown Token'}</h2>
        </div>
        ${description ? `<p>Description: ${description}</p>` : ''}
    `;
        tokenInfoElement.innerHTML = htmlContent;
    };


    const extractImageUrl = (info) => {
        const urlRegex = /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif))/i;
        const match = JSON.stringify(info, null, 2).match(urlRegex);
        return match ? match[0] : null;
    };

    const extractTokenDetails = (info) => {
        if (!info) {
            return { name: null, symbol: null, description: null };
        }

        const name = info.name || (info.jetton_content && info.jetton_content.data && info.jetton_content.data.name) || null;
        const symbol = info.symbol || (info.jetton_content && info.jetton_content.data && info.jetton_content.data.symbol) || null;
        const description = info.description || (info.jetton_content && info.jetton_content.data && info.jetton_content.data.description) || null;

        return { name, symbol, description };
    };

    const displayPosts = (posts) => (
        posts.map((post) => (
            <div key={post._id} className="post">
                <div className="post-content">
                    <p>{post.content}</p>
                </div>
                <div className="comments">
                    {post.comments && post.comments.map((comment) => (
                        <div key={comment._id} className="comment">
                            {comment.content}
                        </div>
                    ))}
                </div>
                <CommentForm postId={post._id} loadPosts={loadPosts} currentTokenAddress={currentTokenAddress} />
            </div>
        ))
    );

    const initApi = async () => {
        try {
            const response = await fetch('/toncenter.config.json');
            const config = await response.json();
            const apiKey = config.tonCenter.apiKey;
            const apiUrl = 'https://toncenter.com/api/v2/';
            return { apiUrl, apiKey };
        } catch (error) {
            console.error('Error loading configuration:', error);
            throw error;
        }
    };

    const handleWalletConnected = (wallet) => {
        setWallet(wallet);
    };

    return (
        <div className="TokenPage" ref={scrollContainerRef}>
            <div className="container">
                <div className="logo">
                    <span>gether</span>
                </div>
                <div id="tokenInfo">{tokenInfo && displayTokenInfo(tokenInfo)}</div>
                {canCreatePost && <PostForm currentTokenAddress={currentTokenAddress} loadPosts={loadPosts} />}
                <div id="posts">{displayPosts(posts)}</div>
                {<SwapComponent currentTokenAddress={currentTokenAddress} wallet={wallet} />} {/* Add the SwapComponent */}
                <div id="noCommunityMessage" style={{ display: 'none' }}>Cannot post in this community.</div>
            </div>
        </div>
    );
};

export default TokenPage;
