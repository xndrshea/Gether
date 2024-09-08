import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PostForm from './components/form/PostForm';
import SwapComponent from './components/SwapComponent';
import { displayTokenInfo } from './components/tokenInfo';
import TokenDetails from './components/TokenDetails';
import { fetchTokenData, saveTokenInfoToDatabase, fetchPosts } from './components/fetch/FetchTokenData';
import { getUserIdPrefix } from './utils/userUtils';
import './styles.css';

const TokenPage = ({ userId }) => {
    console.log("TokenPage userId:", userId);
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
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const tokenAddress = address || new URLSearchParams(window.location.search).get('address');
        if (tokenAddress) {
            fetchTokenInfo(tokenAddress);
            loadPosts(tokenAddress);
        } else {
            setTokenInfo('Invalid token address');
            setCanCreatePost(false);
        }
        const updateBodyHeight = () => {
            if (scrollContainerRef.current) scrollContainerRef.current.style.height = `${window.innerHeight}px`;
        };
        window.addEventListener('resize', updateBodyHeight);
        updateBodyHeight();
        return () => window.removeEventListener('resize', updateBodyHeight);
    }, [address]);

    useEffect(() => {
        if (tokenInfo) {
            displayTokenInfo(tokenInfo, address);
        }
    }, [tokenInfo, address]);

    const fetchTokenInfo = useCallback(async (tokenAddress) => {
        try {
            const info = await fetchTokenData(tokenAddress);
            setTokenInfo(info);
            setCanCreatePost(true);
            await saveTokenInfoToDatabase(tokenAddress, info);
        } catch (error) {
            console.error('Error loading token info:', error);
            setTokenInfo(`Error: ${error.message}`);
            setCanCreatePost(false);
        }
    }, []);

    const loadPosts = useCallback(async (tokenAddress) => {
        try {
            const fetchedPosts = await fetchPosts(tokenAddress);
            setPosts(fetchedPosts);
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }, []);

    const displayPosts = useCallback((posts) => {
        return posts.map((post) => (
            <div
                key={post._id}
                className="post bg-gray-1000 p-4 rounded-lg mb-4 cursor-pointer hover:bg-gray-900 transition duration-300 w-full"
                onClick={() => navigate(`/post/${post._id}`)}
            >
                <div className="post-content text-left break-words">
                    <p className="text-sm text-gray-400 mb-2">User: {getUserIdPrefix(post.user_id)}</p>
                    <div className="flex flex-wrap items-center mb-2">
                        <p className="text-sm text-gray-500">Posted on: {new Date(post.created_at).toLocaleString()}</p>
                    </div>
                    <h2 className="text-xl font-bold mb-2 break-words">{post.title}</h2>
                    {post.image && (
                        <img
                            src={post.image}
                            alt="Post image"
                            className="w-full h-auto max-w-[590px] rounded-lg mb-5 object-contain"
                        />
                    )}
                    <p className="text-gray-300 break-words">{post.content}</p>
                </div>
            </div>
        ));
    }, [navigate, address, tokenInfo]);

    const handleWalletConnected = (wallet) => {
        setWallet(wallet);
    };

    return (
        <div className="TokenPage flex relative pt-4" ref={scrollContainerRef}>
            <div className="main-content flex-grow lg:pr-36 xl:pr-0 max-w-[800px] transition-all duration-300">
                <div className="container mx-auto px-4">
                    <div id="tokenInfo"></div>
                    {canCreatePost && <PostForm currentTokenAddress={address} loadPosts={loadPosts} userId={userId} />}
                    <div id="posts" className="py-4 md:py-6 lg:py-8">{displayPosts(posts)}</div>
                    {!canCreatePost && <div id="noCommunityMessage">Cannot post in this community.</div>}
                </div>
            </div>
            {!isMobile ? (
                <div className="sidebar w-72 fixed top-0 right-0 h-screen overflow-y-auto bg-gray-900 p-5 transition-transform duration-300 transform lg:translate-x-0 translate-x-full">
                    <div className="mt-20 space-y-8">
                        <SwapComponent currentTokenAddress={address} tokenSymbol={tokenInfo?.metadata?.symbol || 'Token'} />
                        <TokenDetails tokenInfo={tokenInfo} currentTokenAddress={address} />
                    </div>
                </div>
            ) : sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
                    <div className="fixed right-0 top-0 w-72 h-full bg-gray-900 p-5 overflow-y-auto z-50">
                        <button className="absolute top-2 right-2 text-white" onClick={() => setSidebarOpen(false)}>X</button>
                        <div className="mt-20 space-y-8">
                            <SwapComponent currentTokenAddress={address} tokenSymbol={tokenInfo?.metadata?.symbol || 'Token'} />
                            <TokenDetails tokenInfo={tokenInfo} currentTokenAddress={address} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TokenPage;