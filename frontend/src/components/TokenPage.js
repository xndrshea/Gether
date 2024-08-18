import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from './PostForm';
import SwapComponent from './SwapComponent';
import { displayTokenInfo } from './tokenInfo';
import TokenDetails from './TokenDetails';
import '../styles.css';

const TokenPage = () => {
    const { address } = useParams();
    const [tokenInfo, setTokenInfo] = useState(null);
    const [posts, setPosts] = useState([]);
    const [canCreatePost, setCanCreatePost] = useState(true);
    const [wallet, setWallet] = useState(null);
    const scrollContainerRef = useRef(null);
    const navigate = useNavigate();

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            const tokenInfo = data.result || data;
            setTokenInfo(tokenInfo);
            setCanCreatePost(true);

            // Save token info to your database
            await saveTokenInfoToDatabase(tokenAddress, tokenInfo);
        } catch (error) {
            console.error('Error loading token info:', error);
            setTokenInfo(`Error: ${error.message}`);
            setCanCreatePost(false);
        }
    }, []);

    const saveTokenInfoToDatabase = async (address, tokenInfo) => {
        try {
            const response = await fetch('http://localhost:5001/tokens', {
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
        }
    };

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
        return posts.map((post, index) => (
            <React.Fragment key={post._id}>
                <div className="post bg-[#1a1a1a] rounded-lg">
                    <div className="post-content">
                        {post.image && (
                            <img
                                src={post.image}
                                alt="Post image"
                                className="w-full h-auto rounded-lg mb-5"
                            />
                        )}
                        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                        <p className="text-gray-300">{post.content}</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => navigate(`/post/${post._id}`)}
                            className="py-2 px-5 rounded-full text-base font-semibold cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
                        >
                            View Details
                        </button>
                    </div>
                </div>
                {index < posts.length - 1 && (
                    <hr className="my-6 border-t border-gray-700" />
                )}
            </React.Fragment>
        ));
    }, [navigate]);

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
        <div className="TokenPage flex relative" ref={scrollContainerRef}>
            <div className="main-content flex-grow lg:pr-36 xl:pr-0 transition-all duration-300">
                <div className="container mx-auto px-4">
                    <div id="tokenInfo"></div>
                    {canCreatePost && <PostForm currentTokenAddress={address} loadPosts={fetchPosts} />}
                    <div id="posts" className="py-4 md:py-6 lg:py-8">{displayPosts(posts)}</div>
                    {!canCreatePost && <div id="noCommunityMessage">Cannot post in this community.</div>}
                </div>
            </div>
            {!isMobile && (
                <div className="sidebar w-72 fixed top-0 right-0 h-screen overflow-y-auto bg-gray-900 p-5 transition-transform duration-300 transform lg:translate-x-0 translate-x-full">
                    <div className="mt-20 space-y-8">
                        <SwapComponent currentTokenAddress={address} wallet={wallet} />
                        <TokenDetails tokenInfo={tokenInfo} currentTokenAddress={address} />
                    </div>
                </div>
            )}
            {isMobile && sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
                    <div className="fixed right-0 top-0 w-72 h-full bg-gray-900 p-5 overflow-y-auto z-50">
                        <button
                            className="absolute top-2 right-2 text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            X
                        </button>
                        <div className="mt-20 space-y-8">
                            <SwapComponent currentTokenAddress={address} wallet={wallet} />
                            <TokenDetails tokenInfo={tokenInfo} currentTokenAddress={address} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TokenPage;