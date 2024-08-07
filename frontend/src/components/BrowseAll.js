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
                <div key={post._id} className="post">
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <p>Posted in: {post.token_address ? (
                        <Link to={`/tokenpage/${post.token_address}`}>{post.token_address}</Link>
                    ) : (
                        'Unknown Community'
                    )}</p>
                    <p>Posted on: {new Date(post.created_at).toLocaleString()}</p>
                    <button onClick={() => toggleComments(post._id)}>
                        {post.showComments ? 'Hide Comments' : 'Show Comments'}
                    </button>
                    {post.showComments && (
                        <div className="comments">
                            {post.comments && post.comments.length > 0 ? (
                                post.comments.map(comment => (
                                    <div key={comment._id} className="comment">
                                        <p>{comment.content}</p>
                                        <p>Commented on: {new Date(comment.created_at).toLocaleString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No comments yet.</p>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BrowseAll;