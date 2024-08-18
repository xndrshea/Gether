import React, { useState } from 'react';

const CommentForm = ({ postId, parentCommentId, onCommentSubmit }) => {
    const [commentContent, setCommentContent] = useState('');

    const createComment = async (e) => {
        e.preventDefault(); // Prevent form submission
        if (commentContent) {
            try {
                const response = await fetch('http://localhost:5001/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        post_id: postId,
                        parent_comment_id: parentCommentId,
                        user_id: '60d9f1f1f1f1f1f1f1f1f1f1',
                        content: commentContent
                    }),
                });
                const newComment = await response.json();
                setCommentContent('');
                if (onCommentSubmit) onCommentSubmit(newComment);
            } catch (error) {
                console.error('Error creating comment:', error);
            }
        }
    };

    return (
        <div className="flex flex-col items-start mt-2">
            <div className="w-full">
                <form onSubmit={createComment} className="relative">
                    <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-blue-600">
                        <textarea
                            id="comment"
                            name="comment"
                            rows={4}
                            placeholder="Add your comment..."
                            className="block w-full resize-none border-0 bg-transparent py-2 px-3 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 caret-grey-600"
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                        />
                    </div>
                    <div className="absolute bottom-2 right-2">
                        <button
                            type="submit"
                            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommentForm;