import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostForm from './PostForm';
import CommentForm from './CommentForm';
import '../styles.css'; // Ensure this path is correct

const TokenPage = () => {
    const { address } = useParams();
    const [currentTokenAddress, setCurrentTokenAddress] = useState(null);
    const [tokenInfo, setTokenInfo] = useState(null);
    const [posts, setPosts] = useState([]);
    const [canCreatePost, setCanCreatePost] = useState(true);

    useEffect(() => {
        if (address) {
            setCurrentTokenAddress(address);
            loadTokenInfo(address);
            loadPosts(address);
        } else {
            setTokenInfo('Invalid token address');
            setCanCreatePost(false);
        }
    }, [address]);

    const loadTokenInfo = async (tokenAddress) => {
        try {
            const { apiUrl, apiKey } = await initApi();
            const fullUrl = `${apiUrl}getAddressInformation?address=${tokenAddress}`;

            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'X-API-Key': apiKey,
                },
            });

            if (response.status === 416) {
                setTokenInfo('Error loading token info');
                setCanCreatePost(false);
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(`API Error: ${data.error}`);
            }

            setTokenInfo(data.result);
            setCanCreatePost(true);
        } catch (error) {
            console.error('Error loading token info:', error);
            setTokenInfo(`Error: ${error.message}`);
            setCanCreatePost(false);
        }
    };

    const loadPosts = async (tokenAddress) => {
        if (!tokenAddress) return;
        try {
            const response = await fetch(`http://localhost:5001/posts/${tokenAddress}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const posts = await response.json();
            setPosts(posts);
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    };

    const displayTokenInfo = (info) => (
        <div id="tokenInfo">
            <h3>Token Information:</h3>
            <p>Balance: {info.balance / 1e9} TON</p>
            <p>Status: {info.state}</p>
            <pre>{JSON.stringify(info, null, 2)}</pre>
        </div>
    );

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

    return (
        <div className="TokenPage">
            <div className="container">
                <div className="logo">
                    <span>gether</span>
                </div>
                <h1 id="tokenTitle">Token Community: {currentTokenAddress}</h1>
                {tokenInfo && displayTokenInfo(tokenInfo)}
                {canCreatePost && <PostForm currentTokenAddress={currentTokenAddress} loadPosts={loadPosts} />}
                <div id="posts">{displayPosts(posts)}</div>
            </div>
        </div>
    );
};

export default TokenPage;
