// src/components/PostForm.js
import React, { useState } from 'react';

const PostForm = ({ currentTokenAddress, loadPosts }) => {
    const [postContent, setPostContent] = useState('');

    const createPost = async () => {
        if (postContent && currentTokenAddress) {
            try {
                const response = await fetch('http://localhost:5001/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: '60d9f1f1f1f1f1f1f1f1f1f1', token_address: currentTokenAddress, content: postContent }),
                });
                const post = await response.json();
                setPostContent('');
                loadPosts(currentTokenAddress);
            } catch (error) {
                console.error('Error creating post:', error);
            }
        }
    };

    return (
        <div className="post-form">
            <h3>Create a Post</h3>
            <textarea
                id="postContent"
                rows="4"
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
            />
            <button onClick={createPost}>Post</button>
        </div>
    );
};

export default PostForm;