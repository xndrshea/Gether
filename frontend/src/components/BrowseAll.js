import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const BrowseAll = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollContainerRef = useRef(null);

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

    const fetchAllPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5001/posts');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPosts(data); // The posts are already sorted on the server
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleComments = (postId) => {
        setPosts(posts.map(post =>
            post._id === postId ? { ...post, showComments: !post.showComments } : post
        ));
    };

    if (loading) return <div>Loading posts...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="browse-all" ref={scrollContainerRef}>
            <h1>All Posts</h1>
            {posts.map(post => (
                <div key={post._id} className="post bg-gray-800 text-white rounded-lg p-4 mb-4 w-full max-w-2xl">
                    <h2 className="text-2xl font-semibold">{post.title}</h2>
                    <p className="mb-2">{post.content}</p>
                    <p className="mb-2">Posted in: {post.token_address ? (
                        <Link to={`/tokenpage/${post.token_address}`} className="text-blue-500 underline">{post.token_address}</Link>
                    ) : (
                        'Unknown Community'
                    )}</p>
                    <p className="mb-2">Posted on: {new Date(post.created_at).toLocaleString()}</p>
                    {/* Add this button to navigate to the PostDetails page */}
                    <Link to={`/post/${post._id}`} className="mt-4 inline-block text-center bg-blue-500 text-white py-2 px-4 rounded">
                        View Post Details
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default BrowseAll;