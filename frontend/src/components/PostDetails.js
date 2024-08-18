import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentForm from './CommentForm';

const PostDetails = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [tokenInfo, setTokenInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);

    const fetchPostDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5001/posts/detail/${postId}`);
            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
            const data = await response.json();
            setPost(data);
            if (data.token_address) {
                await fetchTokenInfo(data.token_address);
            }
        } catch (err) {
            console.error('Error fetching post details:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchPostDetails();
    }, [fetchPostDetails]);

    const fetchTokenInfo = async (tokenAddress) => {
        try {
            const response = await fetch(`http://localhost:5001/tokens/${tokenAddress}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTokenInfo(data);
        } catch (err) {
            console.error('Error fetching token info:', err);
            setTokenInfo(null);
        }
    };

    const handleReply = (commentId) => {
        setReplyingTo(commentId === replyingTo ? null : commentId);
    };

    const handleNewComment = (newComment) => {
        setPost(prevPost => ({
            ...prevPost,
            comments: [...(prevPost.comments || []), newComment]
        }));
        setReplyingTo(null);
    };

    const renderComments = (comments, depth = 0) => {
        return comments.map((comment, index) => (
            <div key={`${comment._id}-${depth}-${index}`} className={`comment bg-gray-1000 p-4 mb-4 rounded-lg text-left ml-${depth * 4}`}>
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
                        onCommentSubmit={handleNewComment}
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
        <div className="post-details">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="post text-left bg-gray-1000 text-white rounded-lg p-4 mb-4">
                    <p className="text-gray-500 mb-4">
                        g/{post.token_address ? (
                            <Link to={`/tokenpage/${post.token_address}`} className="text-blue-500 underline">
                                {tokenInfo ?
                                    `${tokenInfo.name} (${tokenInfo.symbol})` :
                                    post.token_address}
                            </Link>
                        ) : (
                            'Unknown Community'
                        )}
                    </p>
                    <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                    <p className="text-gray-500 mb-4">
                        Posted on: {post.created_at ? new Date(post.created_at).toLocaleString() : 'Date not available'}
                    </p>
                    {post.image && (
                        <img
                            src={post.image}
                            alt="Post"
                            className="max-w-full h-auto mb-4 rounded-lg"
                        />
                    )}
                    <p className="text-base mb-4">{post.content}</p>

                    <hr className="my-6 border-t border-gray-700" />

                    <h2 className="text-2xl font-bold mb-4">Comments</h2>
                    {post.comments && post.comments.length > 0 ? (
                        <div className="comments">
                            {renderComments(post.comments)}
                        </div>
                    ) : (
                        <p className="text-gray-500">No comments yet.</p>
                    )}
                    <CommentForm postId={postId} onCommentSubmit={handleNewComment} />
                </div>
            </div>
        </div>
    );
};

export default PostDetails;