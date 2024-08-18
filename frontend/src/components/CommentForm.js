import React, { useState } from 'react';

const CommentForm = ({ postId, loadPosts, currentTokenAddress }) => {
    const [commentContent, setCommentContent] = useState('');  

    const createComment = async () => {
        if (commentContent) {
            try {
                const response = await fetch('http://localhost:5001/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ post_id: postId, user_id: '60d9f1f1f1f1f1f1f1f1f1f1', content: commentContent }),
                });
                const comment = await response.json();
                setCommentContent('');
                loadPosts(currentTokenAddress);
            } catch (error) {
                console.error('Error creating comment:', error);
            }
        }
    };

    return (
        <div className="comment-input-container">
            <input
                type="text"
                id={`commentInput-${postId}`}
                placeholder="Write a comment..."
                value={commentContent}
                autoComplete="off"
                onChange={(e) => setCommentContent(e.target.value)}
                className="w-[97%] h-24 resize-none bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg mb-5 p-5"
            />
            <button onClick={createComment} className="py-2 px-5 rounded-full text-base font-semibold cursor-pointer bg-blue-600 text-white">Submit</button>
        </div>
    );
};

export default CommentForm;