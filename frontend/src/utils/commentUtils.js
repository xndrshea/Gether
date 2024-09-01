import { getUserIdPrefix } from './userUtils';

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
            setReplyingTo(null); // Reset replyingTo state to null
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

export const renderComments = (comments, depth = 0, handleReply, replyingTo, CommentForm, postId, onCommentSubmit, userId) => {
    return comments.map((comment, index) => (
        <div
            key={`${comment._id}-${depth}-${index}`}
            className={`comment bg-gray-1000 p-4 mb-4 rounded-lg text-left ${depth > 0 ? `ml-${Math.min(depth * 4, 16)}` : ''}`}
        >
            <div className="flex flex-col space-y-2 break-words">
                <p className="text-sm text-gray-400">User: {getUserIdPrefix(comment.user_id)}</p>
                <p className="text-base">{comment.content}</p>
                <p className="text-gray-500 text-sm">Commented on: {new Date(comment.created_at).toLocaleString()}</p>
                <button
                    onClick={() => handleReply(comment._id)}
                    className="text-blue-500 text-sm hover:underline self-start"
                >
                    Reply
                </button>
            </div>
            {replyingTo === comment._id && (
                <div className="mt-4">
                    <CommentForm
                        postId={postId}
                        parentCommentId={comment._id}
                        onCommentSubmit={onCommentSubmit}
                        userId={userId}
                    />
                </div>
            )}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4">
                    {renderComments(comment.replies, depth + 1, handleReply, replyingTo, CommentForm, postId, onCommentSubmit, userId)}
                </div>
            )}
        </div>
    ));
};