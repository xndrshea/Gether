import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllPosts } from './fetch/FetchPost';
import { getUserIdPrefix } from '../utils/userUtils';

const BrowseAll = () => {
    const [posts, setPosts] = useState([]);
    const [tokenInfo, setTokenInfo] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const { posts, tokenInfo } = await fetchAllPosts();
                console.log('Fetched posts:', posts);
                console.log('Fetched token info:', tokenInfo);
                setPosts(posts);
                setTokenInfo(tokenInfo);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        loadPosts();
    }, []);

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    const handleLinkClick = (event) => {
        event.stopPropagation();
    };

    return (
        <div className="browse-all max-w-6xl px-4">
            {Array.isArray(posts) && posts.length > 0 ? (
                <div className="flex flex-wrap justify-start">
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            className="post bg-gray-1000 p-4 rounded-lg mb-4 cursor-pointer hover:bg-gray-900 transition duration-300 min-w-[600px] w-full md:w-1/2 lg:w-2/3 xl:w-3/4"
                            onClick={() => handlePostClick(post._id)}
                        >
                            <div className="text-left">
                                <p className="text-sm text-gray-400 mb-2">User: {getUserIdPrefix(post.user_id)}</p>
                                <div className="flex items-center mb-2">
                                    {post.token_address && tokenInfo[post.token_address] ? (
                                        <p className="text-sm font-semibold text-gray-400 mr-4">
                                            g/<Link
                                                to={`/tokenpage/${post.token_address}`}
                                                className="text-gray-400 hover:text-blue-400"
                                                onClick={handleLinkClick}
                                            >
                                                {tokenInfo[post.token_address].name} ({tokenInfo[post.token_address].symbol})
                                            </Link>
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-400 mr-4">Unknown Community</p>
                                    )}
                                    <p className="text-sm text-gray-500">Posted on: {new Date(post.created_at).toLocaleString()}</p>
                                </div>
                                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                                {post.image ? (
                                    <img
                                        src={post.image}
                                        alt="Post image"
                                        className="w-full h-auto max-w-[590px] rounded-lg mb-5"
                                    />
                                ) : (
                                    <p className="text-base mb-2">{post.content}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No posts available.</p>
            )}
        </div>
    );
};

export default BrowseAll;