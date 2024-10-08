import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentForm from '../form/CommentForm';
import { fetchPostDetails } from '../fetch/FetchPost';
import { getUserIdPrefix } from '../../utils/userUtils';
import { handleNewComment, renderComments } from '../../utils/commentUtils';

export default function PostDetails({ userId }) {
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

    const onCommentSubmit = useCallback(handleNewComment(setPost, setReplyingTo), [setPost, setReplyingTo]);

    if (loading) return <div className="text-white">Loading post...</div>;
    if (error) return <div className="text-white">Error: {error}</div>;
    if (!post) return <div className="text-white">Post not found</div>;

    return (
        <div className="post-details w-full px-4 pt-4 flex justify-center">
            <div className="w-[40rem] max-w-full">
                <div className="post bg-gray-1000 p-4 rounded-lg mb-4">
                    <div className="text-left">
                        <p className="text-sm text-gray-400 mb-2 break-words">User: {getUserIdPrefix(post.user_id)}</p>
                        <div className="flex flex-wrap items-center mb-2">
                            {post.token_address && tokenInfo ? (
                                <p className="text-sm font-semibold text-gray-400 mr-4 mb-2 sm:mb-0">
                                    g/<Link
                                        to={`/tokenpage/${post.token_address}`}
                                        className="text-gray-400 hover:text-blue-400"
                                    >
                                        {tokenInfo.name} ({tokenInfo.symbol})
                                    </Link>
                                </p>
                            ) : (
                                <p className="text-sm text-gray-400 mr-4 mb-2 sm:mb-0">Unknown Community</p>
                            )}
                            <p className="text-sm text-gray-500">Posted on: {new Date(post.created_at).toLocaleString()}</p>
                        </div>
                        <h2 className="text-xl font-bold mb-2 break-words">{post.title}</h2>
                        <div className="post-content">
                            {post.image ? (
                                <img
                                    src={post.image}
                                    alt="Post image"
                                    className="w-full h-auto rounded-lg mb-5 object-contain"
                                />
                            ) : (
                                <p className="text-base mb-2 whitespace-pre-wrap break-words">{post.content}</p>
                            )}
                        </div>

                        <hr className="my-6 border-t border-gray-700" />

                        <h3 className="text-lg font-bold mb-4">Comments</h3>
                        {post.comments && post.comments.length > 0 ? (
                            <div className="comments space-y-4 overflow-x-auto">
                                {renderComments(post.comments, 0, handleReply, replyingTo, CommentForm, postId, onCommentSubmit, userId)}
                            </div>
                        ) : (
                            <p className="text-gray-500">No comments yet.</p>
                        )}
                        <CommentForm postId={postId} onCommentSubmit={onCommentSubmit} userId={userId} />
                    </div>
                </div>
            </div>
        </div>
    );
}