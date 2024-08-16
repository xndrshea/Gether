import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from './PostForm';
import CommentForm from './CommentForm';
import SwapComponent from './SwapComponent';
import { displayTokenInfo } from './tokenInfo';
import TokenDetails from './TokenDetails';
import TonConnectButton from './TonConnectButton';
import '../styles.css';

const TokenPage = () => {
    const { address } = useParams();
    const [tokenInfo, setTokenInfo] = useState(null);
    const [posts, setPosts] = useState([]);
    const [canCreatePost, setCanCreatePost] = useState(true);
    const [wallet, setWallet] = useState(null);
    const scrollContainerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const tokenAddress = address || new URLSearchParams(window.location.search).get('address');

        if (tokenAddress) {
            console.log('Loading token info and posts for address:', tokenAddress);
            fetchTokenData(tokenAddress);
            fetchPosts(tokenAddress);
        } else {
            console.error('Invalid token address');
            setTokenInfo('Invalid token address');
            setCanCreatePost(false);
        }

        const updateBodyHeight = () => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.style.height = `${window.innerHeight}px`;
            }
        };

        window.addEventListener('resize', updateBodyHeight);
        updateBodyHeight();

        return () => {
            window.removeEventListener('resize', updateBodyHeight);
        };
    }, [address]);

    useEffect(() => {
        if (tokenInfo) {
            displayTokenInfo(tokenInfo);
        }
    }, [tokenInfo]);

    const fetchTokenData = useCallback(async (tokenAddress) => {
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
            setTokenInfo(data.result || data);
            setCanCreatePost(true);
        } catch (error) {
            console.error('Error loading token info:', error);
            setTokenInfo(`Error: ${error.message}`);
            setCanCreatePost(false);
        }
    }, []);

    const fetchPosts = useCallback(async (tokenAddress) => {
        try {
            const response = await fetch(`http://localhost:5001/posts/${tokenAddress}`);
            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
            const posts = await response.json();
            console.log('Fetched posts:', posts); // Log fetched posts
            setPosts(posts);
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }, []);

    const displayPosts = useCallback((posts) => {
        return posts.map((post) => (
            <div key={post._id} className="post">
                <div className="post-content">
                    {post.image && (
                        <img src={post.image} alt="Post image" />
                    )}
                    <p>{post.content}</p>
                </div>
                <button
                    onClick={() => navigate(`/post/${post._id}`)}
                    className="py-2 px-5 rounded-full text-base font-semibold cursor-pointer bg-blue-600 text-white ml-2"
                >
                    View Details
                </button>
            </div>
        ));
    }, [fetchPosts, address, navigate]);

    const initApi = async () => {
        try {
            const apiUrl = 'https://tonapi.io/v2/';
            const apiKey = 'AE7SQYEEE7WRMNIAAAAKKP7NQD563K2HAZFZOCO4IV4DVONWHB5A7P3ESI6XTHVH7WETHWI';
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
                    <div id="tokenInfo"></div>
                    {canCreatePost && <PostForm currentTokenAddress={address} loadPosts={fetchPosts} />}
                    <div id="posts">{displayPosts(posts)}</div>
                    <TokenDetails tokenInfo={tokenInfo} currentTokenAddress={address} />
                    <SwapComponent currentTokenAddress={address} wallet={wallet} />
                    {!canCreatePost && <div id="noCommunityMessage">Cannot post in this community.</div>}
                </div>
            </div>
    );
};

export default TokenPage;