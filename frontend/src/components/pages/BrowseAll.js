import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllPosts } from '../fetch/FetchPost';
import { getUserIdPrefix } from '../../utils/userUtils';

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
        <div className="browse-all px-4 pt-4 flex justify-center">
            <div className="max-w-[40rem] w-full ">
                {Array.isArray(posts) && posts.length > 0 ? (
                    <div className="flex flex-col space-y-4">
                        {posts.map((post) => (
                            <div
                                key={post._id}
                                className="post bg-gray-1000 p-4 rounded-lg cursor-pointer hover:bg-gray-900 transition duration-300"
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
                                            className="w-full h-auto rounded-lg mb-5"
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
        </div>
    );
};

export default BrowseAll;