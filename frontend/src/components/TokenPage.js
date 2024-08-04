import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import PostForm from './PostForm';
import CommentForm from './CommentForm';
import SwapComponent from './SwapComponent';
import '../styles.css';
import TonConnectButton from './TonConnectButton';

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
            document.getElementById('tokenTitle').textContent = `Token Community: ${tokenAddress}`;
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
            const fullUrl = `${apiUrl}getAddressInformation?address=${tokenAddress}`;
            console.log('Fetching token info from URL:', fullUrl);

            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'X-API-Key': apiKey,
                },
            });

            if (response.status === 416) {
                console.error('Error 416: Requested Range Not Satisfiable');
                setTokenInfo('Error loading token info');
                setCanCreatePost(false);
                updatePostingUI(false);
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Token info received:', data);

            if (data.error) {
                throw new Error(`API Error: ${data.error}`);
            }

            if (!data.result) {
                console.error('No result field in response data');
                throw new Error('No result field in response data');
            }

            displayTokenInfo(data.result);
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

        // Ensure data field is present before processing it
        if (!info.data) {
            console.error('No data field in token info');
            tokenInfoElement.innerHTML = 'No data available for this token';
            return;
        }

        // Format balance using parseInt
        const balanceInTON = (parseInt(info.balance, 10) / 1e9).toFixed(2);
        const decodedData = decodeBase64(info.data);
        const processedData = processDecodedData(decodedData);
        const imageUrl = extractImageUrl(processedData);

        const formattedInfo = {
            Balance: `${balanceInTON} TON`,
            State: info.state,
            'Last Transaction': info.last_transaction_id ? {
                Lt: info.last_transaction_id.lt,
                Hash: truncateString(info.last_transaction_id.hash, 20),
            } : null,
            'Block ID': info.block_id ? {
                Workchain: info.block_id.workchain,
                Shard: info.block_id.shard,
                Seqno: info.block_id.seqno,
                'Root Hash': truncateString(info.block_id.root_hash, 20),
                'File Hash': truncateString(info.block_id.file_hash, 20),
            } : null,
            'Sync Time': new Date(info.sync_utime * 1000).toLocaleString(),
        };

        let htmlContent = '<h3>Token Information:</h3>';

        if (imageUrl) {
            htmlContent += `<img src="${imageUrl}" alt="Token Image" style="max-width: 200px; max-height: 200px;"><br>`;
        }

        for (const [key, value] of Object.entries(formattedInfo)) {
            if (value && typeof value === 'object') {
                htmlContent += `<details>
                                    <summary>${key}</summary>
                                    <ul>
                                        ${Object.entries(value).map(
                    ([subKey, subValue]) => `<li><strong>${subKey}:</strong> ${subValue}</li>`
                ).join('')}
                                    </ul>
                                </details>`;
            } else if (value) {
                htmlContent += `<p><strong>${key}:</strong> ${value}</p>`;
            }
        }

        htmlContent += `
            <details>
                <summary>Data (Processed)</summary>
                <pre>${processedData}</pre>
            </details>
        `;

        htmlContent += `
            <details>
                <summary>Raw Data</summary>
                <pre>${JSON.stringify(info, null, 2)}</pre>
            </details>
        `;

        tokenInfoElement.innerHTML = htmlContent;
    };

    const isValidBase64 = (str) => {
        try {
            return btoa(atob(str)) === str;
        } catch (err) {
            return false;
        }
    };

    const decodeBase64 = (str) => {
        if (!isValidBase64(str)) {
            console.error('Invalid Base64 string:', str);
            return ''; // Return an empty string or handle it as per your requirement
        }
        try {
            return atob(str);
        } catch (e) {
            console.error('Failed to decode Base64 string:', e);
            return ''; // Return an empty string or handle it as per your requirement
        }
    };

    const processDecodedData = (decodedString) => {
        let result = '';

        for (let i = 0; i < decodedString.length; i++) {
            const charCode = decodedString.charCodeAt(i);
            if (charCode >= 32 && charCode <= 126) {
                result += decodedString[i];
            }
        }

        return result;
    };

    const extractImageUrl = (processedData) => {
        const urlRegex = /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif))/i;
        const match = processedData.match(urlRegex);
        return match ? match[0] : null;
    };

    const truncateString = (str, maxLength) => {
        if (str.length <= maxLength) return str;
        return str.substr(0, maxLength) + '...';
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
                <h1 id="tokenTitle">Token Community: {currentTokenAddress}</h1>
                <TonConnectButton onWalletConnected={handleWalletConnected} /> {/* Add the TonConnectButton */}
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
