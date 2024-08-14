import React, { useState } from 'react';

const PostForm = ({ currentTokenAddress, loadPosts }) => {
    const [postContent, setPostContent] = useState('');
    const [image, setImage] = useState(null);

    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        setImage(selectedImage);
        console.log('Image selected:', selectedImage);
    };

    const createPost = async () => {
        console.log('Post button clicked');
        console.log('postContent:', postContent);
        console.log('currentTokenAddress:', currentTokenAddress);
        console.log('image:', image);

        // Only require postContent and currentTokenAddress
        if (postContent && currentTokenAddress) {
            try {
                console.log('Creating post with content:', postContent);
                const formData = new FormData();
                if (image) {
                    formData.append('image', image);
                }
                formData.append('user_id', '60d9f1f1f1f1f1f1f1f1f1f1'); // Example user ID
                formData.append('token_address', currentTokenAddress);
                formData.append('content', postContent);

                const response = await fetch('http://localhost:5001/posts', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const post = await response.json();
                setPostContent('');
                setImage(null);
                loadPosts(currentTokenAddress);
            } catch (error) {
                console.error('Error creating post:', error);
            }
        } else {
            console.log('Missing content or token address');
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
                onChange={(e) => {
                    setPostContent(e.target.value);
                    console.log('Post content updated:', e.target.value);
                }}
            />
            <input type="file" onChange={(e) => {
                handleImageChange(e);
                console.log('Image selected:', e.target.files[0]);
            }} />
            <button onClick={createPost}>Post</button>
        </div>
    );
};

export default PostForm;