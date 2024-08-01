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
            comments: []
        };
        posts.unshift(post);
        document.getElementById('postContent').value = '';
        displayPosts();
    }
}

function createComment(postId) {
    const commentInput = document.getElementById(`commentInput-${postId}`);
    const content = commentInput.value.trim();
    if (content) {
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.comments.push({
                id: Date.now(),
                content: content
            });
            commentInput.value = '';
            displayPosts();
        }
    }
}

function displayPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = ''; // Clear previous posts

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-content">
                <p>${post.content}</p>
            </div>
            <div class="comments">
                ${post.comments.map(comment => `
                    <div class="comment">${comment.content}</div>
                `).join('')}
            </div>
            <button onclick="toggleCommentInput(${post.id})" class="comment-toggle">Comment</button>
            <div id="commentInputContainer-${post.id}" class="comment-input-container" style="display: none;">
                <input type="text" id="commentInput-${post.id}" placeholder="Write a comment...">
                <button onclick="createComment(${post.id})">Submit</button>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

function toggleCommentInput(postId) {
    const commentInputContainer = document.getElementById(`commentInputContainer-${postId}`);
    const isHidden = commentInputContainer.style.display === 'none';
    commentInputContainer.style.display = isHidden ? 'block' : 'none';
}

function createComment(postId) {
    const commentInput = document.getElementById(`commentInput-${postId}`);
    const content = commentInput.value.trim();
    if (content) {
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.comments.push({
                id: Date.now(),
                content: content
            });
            commentInput.value = '';
            displayPosts(); // Refresh the display
        }
    }
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