import React, { useState } from 'react';

const PostForm = ({ currentTokenAddress, loadPosts, userId }) => {
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [file, setFile] = useState(null);

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        console.log('Image selected:', selectedFile);
    };

    const createPost = async () => {
        console.log('Post button clicked');
        console.log('postTitle:', postTitle);
        console.log('postContent:', postContent);
        console.log('currentTokenAddress:', currentTokenAddress);
        console.log('file:', file);
        console.log('userId:', userId);

        if (postTitle && postContent && currentTokenAddress && userId) {
            try {
                const formData = new FormData();
                formData.append('user_id', userId);
                formData.append('token_address', currentTokenAddress);
                formData.append('title', postTitle);
                formData.append('content', postContent);

                if (file) {
                    formData.append('image', file);
                }

                // Log FormData contents
                for (let pair of formData.entries()) {
                    console.log(`${pair[0]}: ${pair[1]}`);
                }

                const response = await fetch('http://localhost:5001/posts', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error status: ${response.status}`);
                }

                const post = await response.json();
                console.log('Post created:', post);
                console.log('Post created at:', new Date(post.created_at).toLocaleString());

                setPostTitle('');
                setPostContent('');
                setFile(null);
                loadPosts(currentTokenAddress);
            } catch (error) {
                console.error('Error creating post:', error);
            }
        } else {
            console.log('Missing title, content, token address, or user ID');
        }
    };

    return (
        <div className="post-form">
             <h3 className="px-1 font-bold mb-3 text-[#0066ff]">Create a Post</h3>
            <input
                type="text"
                id="postTitle"
                placeholder="Enter post title"
                value={postTitle}
                onChange={(e) => {
                    setPostTitle(e.target.value);
                    console.log('Post title updated:', e.target.value);
                }}
                className="w-full mb-2 p-2 border rounded bg-[#1a1a1a] text-white placeholder-gray-400"
            />
            <textarea
                id="postContent"
                rows="4"
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => {
                    setPostContent(e.target.value);
                    console.log('Post content updated:', e.target.value);
                }}
                 className="w-full mb-2 p-2 border rounded resize-none bg-[#1a1a1a] text-white placeholder-gray-400 "
            />
            <div className="flex justify-end">
                <label
                    htmlFor="image-upload"
                    className="flex items-center py-2 px-5 rounded-full text-base font-semibold cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
                >
                    <input
                        id="image-upload"
                        type="file"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <img
                        src="https://getherlolbucket.s3.eu-central-1.amazonaws.com/assets/add-image-icon.png"
                        alt="Upload Image"
                        className="h-5 w-5 mr-2"
                    />
                    {file ? 'One image chosen' : 'Upload Image'}
                </label>

                <button
                    onClick={createPost}
                    className="py-2 px-5 rounded-full text-base font-semibold cursor-pointer bg-blue-600 text-white ml-2"
                >
                    Post
                </button>
            </div>
        </div>
    );
};

export default PostForm;