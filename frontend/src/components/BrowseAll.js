import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllPosts } from './fetch/FetchPost';
import { getUserIdPrefix } from '../utils/userUtils';

const BrowseAll = () => {
    const [posts, setPosts] = useState([]);
    const [tokenInfo, setTokenInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollContainerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const { posts, tokenInfo } = await fetchAllPosts();
                setPosts(posts);
                setTokenInfo(tokenInfo);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
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
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Date not available';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
    };

    if (loading) return <div>Loading posts...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="browse-all-container">
            {posts.map((post, index) => (
                <React.Fragment key={post._id}>
                    <div className="post text-left bg-gray-1000 text-white rounded-lg p-4 mb-4 w-full max-w-2xl">
                        <p className="text-sm text-gray-400 mb-2">User: {getUserIdPrefix(post.user_id)}</p>
                        <p className="mb-2">Posted on: {formatDate(post.created_at)}</p>
                        <h2 className="text-2xl font-semibold">{post.title}</h2>
                        {post.image && (
                            <div className="mb-2">
                                <img
                                    src={post.image}
                                    alt="Post preview"
                                    className="w-auto h-auto w-max[590px] object-cover rounded-lg"
                                />
                            </div>
                        )}
                        <p className="mb-2">{post.content}</p>
                        <p className="mb-2">Posted in: {post.token_address ? (
                            <Link to={`/tokenpage/${post.token_address}`} className="text-blue-500 underline">
                                {tokenInfo[post.token_address] ?
                                    `${tokenInfo[post.token_address].name} (${tokenInfo[post.token_address].symbol})` :
                                    post.token_address}
                            </Link>
                        ) : (
                            'Unknown Community'
                        )}</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => navigate(`/post/${post._id}`)}
                                className="py-2 px-5 rounded-full text-base font-semibold cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
                            >
                                View Post Details
                            </button>
                        </div>
                    </div>
                    {index < posts.length - 1 && (
                        <hr className="mb-6 border-t border-gray-700" />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default BrowseAll;