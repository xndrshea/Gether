let currentTokenAddress;

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    currentTokenAddress = urlParams.get('address');

    if (currentTokenAddress) {
        document.getElementById('tokenTitle').textContent = `Token Community: ${currentTokenAddress}`;
        loadTokenInfo(currentTokenAddress);
        loadPosts();
    } else {
        document.getElementById('tokenInfo').textContent = 'Invalid token address';
        canCreatePost = false;
        updatePostingUI();
    }

    document.getElementById('submitPost').addEventListener('click', createPost);
});

let canCreatePost = true; // Global variable to track if posting is allowed

async function loadTokenInfo(tokenAddress) {
    try {
        const { apiUrl, apiKey } = await initApi();
        const fullUrl = `${apiUrl}getAddressInformation?address=${tokenAddress}`;

        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'X-API-Key': apiKey
            }
        });

        if (response.status === 416) {
            document.getElementById('tokenInfo').textContent = 'Error loading token info';
            canCreatePost = false; // Disable posting for 416 error
            updatePostingUI();
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(`API Error: ${data.error}`);
        }

        displayTokenInfo(data.result);
        canCreatePost = true; // Enable posting for successful responses
    } catch (error) {
        console.error('Error loading token info:', error);
        document.getElementById('tokenInfo').textContent = `Error: ${error.message}`;
        canCreatePost = true; // Keep posting enabled for other types of errors
    }
    
    updatePostingUI();
}

function updatePostingUI() {
    const postForm = document.querySelector('.post-form');
    const postButton = document.getElementById('submitPost');
    const noCommunityMessage = document.getElementById('noCommunityMessage');
    
    if (canCreatePost) {
        postForm.style.display = 'block';
        postButton.disabled = false;
        noCommunityMessage.style.display = 'none';
    } else {
        postForm.style.display = 'none';
        postButton.disabled = true;
        noCommunityMessage.style.display = 'block';
    }
}

function displayTokenInfo(info) {
    const tokenInfoElement = document.getElementById('tokenInfo');
    tokenInfoElement.innerHTML = `
        <h3>Token Information:</h3>
        <p>Balance: ${info.balance / 1e9} TON</p>
        <p>Status: ${info.state}</p>
        <pre>${JSON.stringify(info, null, 2)}</pre>
    `;
}

// Simulated data storage (replace with actual backend storage in a real application)
let posts = [];

function createPost() {
    const content = document.getElementById('postContent').value.trim();
    if (content) {
        const post = {
            id: Date.now(),
            content: content,
            comments: [] // Initialize with an empty array
        };
        posts.unshift(post);
        document.getElementById('postContent').value = '';
        displayPosts();
    }
}


function displayPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = ''; // Clear previous posts

    if (posts.length === 0) {
        postsContainer.innerHTML = '<p>No posts yet. Be the first to post!</p>';
        return;
    }

    posts.forEach(post => {
        // Create post element
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-content">
                <p>${post.content}</p>
            </div>
        `;
        postsContainer.appendChild(postElement);

        // Create comments section
        const commentsSection = document.createElement('div');
        commentsSection.className = 'comments-section';
        commentsSection.innerHTML = `
            <h4>Comments:</h4>
            ${post.comments && post.comments.length > 0 
                ? post.comments.map(comment => `<p class="comment">${comment}</p>`).join('')
                : '<p>No comments yet.</p>'}
        `;
        postsContainer.appendChild(commentsSection);

        // Create comment form
        const commentForm = document.createElement('div');
        commentForm.className = 'comment-form';
        commentForm.innerHTML = `
            <input type="text" id="commentInput-${post.id}" placeholder="Write a comment...">
            <button onclick="addComment(${post.id})">Comment</button>
        `;
        postsContainer.appendChild(commentForm);
    });
}


function addComment(postId) {
    const commentInput = document.getElementById(`commentInput-${postId}`);
    const commentContent = commentInput.value.trim();
    if (commentContent) {
        const post = posts.find(p => p.id === postId);
        if (post) {
            if (!Array.isArray(post.comments)) {
                post.comments = []; // Initialize if it doesn't exist
            }
            post.comments.push(commentContent);
            commentInput.value = '';
            displayPosts(); // Refresh the display to show the new comment
        }
    }
}

function updateScrollHeight() {
    document.body.style.height = window.innerHeight + 'px';
    setTimeout(() => {
        document.body.style.height = '';
    }, 0);
}

function loadPosts() {
    // In a real application, you would load posts from a backend here
    // For this example, we'll use the simulated data
    displayPosts();
}

async function initApi() {
    try {
        const response = await fetch('toncenter.config.json');
        const config = await response.json();
        const apiKey = config.tonCenter.apiKey;
        const apiUrl = 'https://toncenter.com/api/v2/';
        return { apiUrl, apiKey };
    } catch (error) {
        console.error('Error loading configuration:', error);
        throw error;
    }
}
