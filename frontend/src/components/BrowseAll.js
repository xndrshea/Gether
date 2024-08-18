import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { extractTokenDetails } from './tokenInfo';

const BrowseAll = () => {
    const [posts, setPosts] = useState([]);
    const [tokenInfo, setTokenInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollContainerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllPosts();
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

    const fetchTokenInfo = async (posts) => {
        const tokenInfoPromises = posts.map(post =>
            post.token_address ? fetch(`http://localhost:5001/tokens/${post.token_address}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .catch(error => {
                    console.error(`Error fetching token info for ${post.token_address}:`, error);
                    return null;
                })
                : null
        );
        const tokenInfoResults = await Promise.all(tokenInfoPromises);
        const newTokenInfo = {};
        tokenInfoResults.forEach((info, index) => {
            if (info && posts[index].token_address) {
                newTokenInfo[posts[index].token_address] = extractTokenDetails(info);
            }
        });
        setTokenInfo(newTokenInfo);
    };

    const fetchAllPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5001/posts');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPosts(data);
            await fetchTokenInfo(data);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading posts...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="browse-all" ref={scrollContainerRef}>
            <h1>All Posts</h1>
            {posts.map(post => (
                <div key={post._id} className="post text-left bg-gray-1000 text-white rounded-lg p-4 mb-4 w-full max-w-2xl">
                    <p className="mb-2">Posted on: {new Date(post.created_at).toLocaleString()}</p>
                    {post.image && (
                        <div className="mb-2">
                            <img
                                src={post.image}
                                alt="Post preview"
                                className="w-144 h-96 object-cover rounded-lg"
                            />
                        </div>
                    )}
                    <h2 className="text-2xl font-semibold">{post.title}</h2>
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
                    <button
                        onClick={() => navigate(`/post/${post._id}`)}
                        className="py-2 px-5 rounded-full text-base font-semibold cursor-pointer bg-blue-600 text-white ml-2"
                    >
                        View Post Details
                    </button>
                </div>
            ))}
        </div>
    );
};

export default BrowseAll;