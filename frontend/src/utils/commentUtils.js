import { getUserIdPrefix } from './userUtils';

export const handleNewComment = (setPost) => (newComment) => {
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
            return {
                ...prevPost,
                comments: updateComments(prevPost.comments || [])
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
        <div key={`${comment._id}-${depth}-${index}`} className={`comment bg-gray-1000 p-4 mb-4 rounded-lg text-left ml-${depth * 4}`}>
            <p className="text-sm text-gray-400 mb-2">User: {getUserIdPrefix(comment.user_id)}</p>
            <p className="text-base mb-2">{comment.content}</p>
            <p className="text-gray-500">Commented on: {new Date(comment.created_at).toLocaleString()}</p>
            <button onClick={() => handleReply(comment._id)} className="text-blue-500 text-sm mt-2 hover:underline">Reply</button>
            {replyingTo === comment._id && (
                <CommentForm
                    postId={postId}
                    parentCommentId={comment._id}
                    onCommentSubmit={onCommentSubmit}
                    userId={userId}
                />
            )}
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-4 mt-4">
                    {renderComments(comment.replies, depth + 1, handleReply, replyingTo, CommentForm, postId, onCommentSubmit, userId)}
                </div>
            )}
        </div>
    ));
};