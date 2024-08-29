const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define Schemas
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    created_at: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    user_id: { type: String, required: true }, // Change from ObjectId to String if needed
    token_address: String,
    title: String,
    content: String,
    image: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    created_at: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
    post_id: mongoose.Schema.Types.ObjectId,
    parent_comment_id: mongoose.Schema.Types.ObjectId,
    user_id: { type: String, required: true }, // Change from ObjectId to String if needed
    content: String,
    created_at: { type: Date, default: Date.now },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

// Define Models
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

// Get posts for a token address
// Ensure this route is correctly defined
router.get('/api/:tokenAddress/posts', async (req, res) => {
    try {
        const posts = await Post.find({ token_address: req.params.tokenAddress });
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Create a post
router.post('/posts', async (req, res) => {
    console.log('Creating a new post:', req.body);
    try {
        const { user_id, token_address, title, content, image } = req.body;
        // Ensure user_id is provided and not hardcoded
        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const post = new Post({ user_id, token_address, title, content, image });
        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Create a comment
router.post('/comments', async (req, res) => {
    console.log('Creating a new comment:', req.body);
    try {
        const { post_id, parent_comment_id, user_id, content } = req.body;
        // Ensure user_id is provided and not hardcoded
        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const comment = new Comment({ post_id, parent_comment_id, user_id, content });
        await comment.save();

        if (parent_comment_id) {
            // If it's a reply, add it to the parent comment's replies
            await Comment.findByIdAndUpdate(parent_comment_id, { $push: { replies: comment._id } });
        } else {
            // If it's a top-level comment, add it to the post
            await Post.findByIdAndUpdate(post_id, { $push: { comments: comment._id } });
        }

        res.json(comment);
    } catch (err) {
        console.error('Error creating comment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific post with its comments
router.get('/posts/detail/:postId', async (req, res) => {
    console.log(`Fetching details for post ID: ${req.params.postId}`);
    try {
        const post = await Post.findById(req.params.postId).populate({
            path: 'comments',
            populate: {
                path: 'replies',
                model: 'Comment'
            }
        });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error('Error fetching post details:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

// Get a specific post with its comments
router.get('/posts/detail/:postId', async (req, res) => {
    console.log(`Fetching details for post ID: ${req.params.postId}`);
    try {
        const post = await Post.findById(req.params.postId).populate('comments');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error('Error fetching post details:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a post
router.delete('/posts/:postId', async (req, res) => {
    console.log(`Deleting post with ID: ${req.params.postId}`);
    try {
        const post = await Post.findByIdAndDelete(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).send(err);
    }
});

