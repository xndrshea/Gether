import React, { useState } from 'react';

const PostForm = ({ currentTokenAddress, loadPosts }) => {
    const [postContent, setPostContent] = useState('');
    const [file, setFile] = useState(null);

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        console.log('Image selected:', selectedFile);
    };

    const createPost = async () => {
        console.log('Post button clicked');
        console.log('postContent:', postContent);
        console.log('currentTokenAddress:', currentTokenAddress);
        console.log('file:', file);

        if (postContent && currentTokenAddress) {
            try {
                const formData = new FormData();
                formData.append('user_id', '60d9f1f1f1f1f1f1f1f1f1f1'); // Example user ID
                formData.append('token_address', currentTokenAddress);
                formData.append('content', postContent);

                // Only append the image if a file is selected
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

                setPostContent('');
                setFile(null);
                loadPosts(currentTokenAddress);
            } catch (error) {
                console.error('Error creating post:', error);
            }
        } else {
            console.log('Missing content, token address, or file');
        }
    };

    return (
        <div className="post-form">
            <h3 className="font-bold">Create a Post</h3>
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
