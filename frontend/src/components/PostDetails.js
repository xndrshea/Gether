import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PostDetails = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5001/posts/detail/${postId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                setPost(data);
            } catch (err) {
                console.error('Error fetching post details:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [postId]);

    if (loading) return <div>Loading post...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!post) return <div>Post not found</div>;

    return (
        <div className="post-details">
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            {post.image && <img src={post.image} alt="Post" style={{ maxWidth: '100%', height: 'auto' }} />}
            <p>Posted on: {post.created_at ? new Date(post.created_at).toLocaleString() : 'Date not available'}</p>
            <h2>Comments</h2>
            {post.comments && post.comments.length > 0 ? (
                <div className="comments">
                    {post.comments.map(comment => (
                        <div key={comment._id} className="comment">
                            <p>{comment.content}</p>
                            <p>Commented on: {new Date(comment.createdAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No comments yet.</p>
            )}
        </div>
    );
};

export default PostDetails;