import { getUserIdPrefix } from './userUtils';
import React from 'react';

export const handleNewComment = (setPost, setReplyingTo) => (newComment) => {
    setPost(prevPost => {
        const updateComments = (comments) => {
            return comments.map(comment => {
                if (comment._id === newComment.parent_comment_id) {
                    return {
                        ...comment,
                        replies: [...(comment.replies || []), newComment]
                    };
                } else if (comment.replies && comment.replies.length > 0) {
                    return {
                        ...comment,
                        replies: updateComments(comment.replies)
                    };
                }
                return comment;
            });
        };

        if (newComment.parent_comment_id) {
            const updatedComments = updateComments(prevPost.comments || []);
            setReplyingTo(null);
            return {
                ...prevPost,
                comments: updatedComments
            };
        } else {
            return {
                ...prevPost,
                comments: [...(prevPost.comments || []), newComment]
            };
        }
    });
};

const CommentThread = ({ comment, depth = 0, handleReply, replyingTo, CommentForm, postId, onCommentSubmit, userId, isLastChild }) => {
    const linkColors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-red-500',
        'bg-purple-500'
    ];

    const currentColor = linkColors[depth % linkColors.length];

    return (
        <div className={`relative ${depth > 0 ? 'ml-6 pt-2' : ''}`}>
            {depth > 0 && (
                <>
                    <div
                        className={`absolute left-0 top-0 bottom-0 w-px ${currentColor}`}
                        style={{ transform: 'translateX(-1.5rem)' }}
                    />
                    <div
                        className={`absolute left-0 top-8 w-6 h-px ${currentColor}`}
                        style={{ transform: 'translateX(-1.5rem)' }}
                    />
                </>
            )}
            <div className="relative bg-gray-900 p-3 rounded-lg break-words">
                <div className="flex flex-col space-y-2">
                    <p className="text-sm text-gray-400">User: {getUserIdPrefix(comment.user_id)}</p>
                    <p className="text-base whitespace-pre-wrap">{comment.content}</p>
                    <p className="text-gray-500 text-xs">Commented on: {new Date(comment.created_at).toLocaleString()}</p>
                    <button
                        onClick={() => handleReply(comment._id)}
                        className="text-blue-500 text-sm hover:underline self-start"
                    >
                        Reply
                    </button>
                </div>
                {replyingTo === comment._id && (
                    <div className="mt-3">
                        <CommentForm
                            postId={postId}
                            parentCommentId={comment._id}
                            onCommentSubmit={onCommentSubmit}
                            userId={userId}
                        />
                    </div>
                )}
            </div>
            {comment.replies && comment.replies.length > 0 && (
                <div className="relative">
                    {comment.replies.map((reply, index) => (
                        <CommentThread
                            key={`${reply._id}-${depth + 1}-${index}`}
                            comment={reply}
                            depth={depth + 1}
                            handleReply={handleReply}
                            replyingTo={replyingTo}
                            CommentForm={CommentForm}
                            postId={postId}
                            onCommentSubmit={onCommentSubmit}
                            userId={userId}
                            isLastChild={index === comment.replies.length - 1}
                        />
                    ))}
                </div>
            )}
            {!isLastChild && (
                <div
                    className={`absolute left-0 top-0 bottom-0 w-px ${currentColor}`}
                    style={{ transform: 'translateX(-1.5rem)' }}
                />
            )}
        </div>
    );
};

export const renderComments = (comments, depth = 0, handleReply, replyingTo, CommentForm, postId, onCommentSubmit, userId) => {
    return comments.map((comment, index) => (
        <CommentThread
            key={`${comment._id}-${depth}-${index}`}
            comment={comment}
            depth={depth}
            handleReply={handleReply}
            replyingTo={replyingTo}
            CommentForm={CommentForm}
            postId={postId}
            onCommentSubmit={onCommentSubmit}
            userId={userId}
            isLastChild={index === comments.length - 1}
        />
    ));
};

export default CommentThread;