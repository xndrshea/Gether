// Import necessary modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const AWS = require('aws-sdk');
const fs = require('fs');
const multer = require('multer');

const app = express();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
});

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase the limit to handle large base64 strings

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("MongoDB URI is not defined in the environment variables.");
    process.exit(1);
}

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
});

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

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

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Serve the manifest file
app.get('/tonconnect-manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'tonconnect-manifest.json'));
});

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Get posts for a token address
app.get('/posts/:tokenAddress', async (req, res) => {
    console.log(`Fetching posts for token address: ${req.params.tokenAddress}`);
    try {
        const posts = await Post.find({ token_address: req.params.tokenAddress }).populate('comments');
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).send(err);
    }
});

// Create a post
app.post('/posts', upload.single('image'), async (req, res) => {
    try {
        console.log('Incoming request body:', req.body);
        console.log('Incoming file:', req.file);

        const { user_id, token_address, content } = req.body;
        let imageUrl = null;

        if (req.file) {
            const fileContent = req.file.buffer;

            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `images/${Date.now()}-${req.file.originalname}`,
                Body: fileContent,
                ContentType: req.file.mimetype,
                ACL: 'public-read' // Ensure public-read access
            };

            const uploadResult = await s3.upload(params).promise();
            console.log('Image uploaded successfully:', uploadResult);
            imageUrl = uploadResult.Location;
        }

        const post = new Post({ user_id, token_address, content, image: imageUrl });
        await post.save();
        res.json(post);
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).send(err);
    }
});

// Create a comment
app.post('/comments', async (req, res) => {
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
        res.status(500).send(err);
    }
});

// Get comments for a post
app.get('/comments/:postId', async (req, res) => {
    console.log(`Fetching comments for post ID: ${req.params.postId}`);
    try {
        const comments = await Comment.find({ post_id: req.params.postId });
        res.json(comments);
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).send(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Get all posts
app.get('/posts', async (req, res) => {
    console.log('GET request received for /posts');
    try {
        const posts = await Post.find().populate('comments').sort({ created_at: -1 });
        console.log(`Found ${posts.length} posts`);
        res.json(posts);
    } catch (err) {
        console.error('Error in /posts endpoint:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get a specific post with its comments
app.get('/posts/detail/:postId', async (req, res) => {
    console.log(`Fetching details for post ID: ${req.params.postId}`);
    try {
        const post = await Post.findById(req.params.postId).populate('comments');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error('Error fetching post details:', err);
        res.status(500).send(err);
    }
});