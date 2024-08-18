import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CommentForm from './CommentForm';

const PostDetails = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);

    useEffect(() => {
        fetchPostDetails();
    }, [postId]);

    const fetchPostDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5001/posts/detail/${postId}`);
            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
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

    const handleReply = (commentId) => {
        setReplyingTo(commentId === replyingTo ? null : commentId);
    };

    const renderComments = (comments, depth = 0) => {
        return comments.map(comment => (
            <div key={comment._id} className={`comment bg-gray-1000 p-4 mb-4 rounded-lg text-left ml-${depth * 4}`}>
                <p className="text-base mb-2">{comment.content}</p>
                <p className="text-gray-500">
                    Commented on: {new Date(comment.created_at).toLocaleString()}
                </p>
                <button
                    onClick={() => handleReply(comment._id)}
                    className="text-blue-500 text-sm mt-2 hover:underline"
                >
                    Reply
                </button>
                {replyingTo === comment._id && (
                    <CommentForm
                        postId={postId}
                        parentCommentId={comment._id}
                        loadPosts={fetchPostDetails}
                        currentTokenAddress={postId}
                        onCommentSubmit={() => setReplyingTo(null)}
                    />
                )}
                {comment.replies && comment.replies.length > 0 && renderComments(comment.replies, depth + 1)}
            </div>
        ));
    };

    if (loading) return <div>Loading post...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!post) return <div>Post not found</div>;

    return (
        <div className="post-details p-4 bg-gray-900 rounded-lg shadow-md text-left">
            <h1 className="text-3xl font-bold mb-4 text-left">{post.title}</h1>
            <p className="text-gray-500 mb-4 text-left">
                Posted on: {post.created_at ? new Date(post.created_at).toLocaleString() : 'Date not available'}
            </p>
            <p className="text-base mb-4 text-left">{post.content}</p>
            {post.image && (
                <img
                    src={post.image}
                    alt="Post"
                    className="max-w-full h-auto mb-4"
                />
            )}
            <h2 className="text-2xl font-bold mb-4 text-left">Comments</h2>
            {post.comments && post.comments.length > 0 ? (
                <div className="comments">
                    {renderComments(post.comments)}
                </div>
            ) : (
                <p className="text-gray-500 text-left">No comments yet.</p>
            )}
            <CommentForm postId={postId} loadPosts={fetchPostDetails} currentTokenAddress={postId} />
        </div>
    );
};

export default PostDetails;