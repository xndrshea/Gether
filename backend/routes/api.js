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
    user_id: mongoose.Schema.Types.ObjectId,
    token_address: String,
    content: String,
    image: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
    post_id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    content: String,
    created_at: { type: Date, default: Date.now }
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
        const { user_id, token_address, content } = req.body;
        const post = new Post({ user_id, token_address, content });
        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

/// Create a comment
router.post('/comments', async (req, res) => {
    console.log('Creating a new comment:', req.body);
    try {
        const { post_id, user_id, content } = req.body;
        const comment = new Comment({ post_id, user_id, content });
        await comment.save();

        // Add the comment to the corresponding post
        await Post.findByIdAndUpdate(post_id, { $push: { comments: comment._id } });

        res.json(comment);
    } catch (err) {
        console.error('Error creating comment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get comments for a post
router.get('/comments/:postId', async (req, res) => {
    console.log(`Fetching comments for post ID: ${req.params.postId}`);
    try {
        const comments = await Comment.find({ post_id: req.params.postId });
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
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
