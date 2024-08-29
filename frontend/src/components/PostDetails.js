import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentForm from './form/CommentForm';
import { fetchPostDetails } from './fetch/FetchPost';
import { getUserIdPrefix } from '../utils/userUtils';
import { handleNewComment, renderComments } from '../utils/commentUtils';

const PostDetails = ({ userId }) => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [tokenInfo, setTokenInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);

    const fetchDetails = useCallback(async () => {
        try {
            setLoading(true);
            const { post, tokenInfo } = await fetchPostDetails(postId);
            setPost(post);
            setTokenInfo(tokenInfo);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => { fetchDetails(); }, [fetchDetails, postId]);

    const handleReply = (commentId) => setReplyingTo(commentId === replyingTo ? null : commentId);

    const onCommentSubmit = handleNewComment(setPost);

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
                                {tokenInfo ? `${tokenInfo.name} (${tokenInfo.symbol})` : post.token_address}
                            </Link>
                        ) : 'Unknown Community'}
                    </p>
                    <p className="text-sm text-gray-400 mb-2">User: {getUserIdPrefix(post.user_id)}</p>
                    <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                    <p className="text-gray-500 mb-4">Posted on: {post.created_at ? new Date(post.created_at).toLocaleString() : 'Date not available'}</p>
                    {post.image && <img src={post.image} alt="Post" className="max-w-full h-auto mb-4 rounded-lg" />}
                    <p className="text-base mb-4">{post.content}</p>
                    <hr className="my-6 border-t border-gray-700" />
                    <h2 className="text-2xl font-bold mb-4">Comments</h2>
                    {post.comments && post.comments.length > 0 ? (
                        <div className="comments">
                            {renderComments(post.comments, 0, handleReply, replyingTo, CommentForm, postId, onCommentSubmit, userId)}
                        </div>
                    ) : (
                        <p className="text-gray-500">No comments yet.</p>
                    )}
                    <CommentForm postId={postId} onCommentSubmit={onCommentSubmit} userId={userId} />
                </div>
            </div>
        </div>
    );
};

export default PostDetails;