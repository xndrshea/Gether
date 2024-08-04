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
     // Add this section here
    window.addEventListener('resize', function() {
        document.body.style.height = window.innerHeight + 'px';
    });

    // Call this once on load
    document.body.style.height = window.innerHeight + 'px';
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

function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
}

// Function to extract the image URL from the processed data
function extractImageUrl(processedData) {
    const urlRegex = /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif))/i;
    const match = processedData.match(urlRegex);
    return match ? match[0] : null;
}

// Function to process decoded data
function processDecodedData(decodedString) {
    let result = '';
    
    for (let i = 0; i < decodedString.length; i++) {
        const charCode = decodedString.charCodeAt(i);
        if (charCode >= 32 && charCode <= 126) {
            // Printable ASCII character
            result += decodedString[i];
        }
        // Non-printable characters are simply skipped
    }
    
    return result;
}

// Function to display token information
function displayTokenInfo(info) {
    const tokenInfoElement = document.getElementById('tokenInfo');
    
    // Format balance
    const balanceInTON = (BigInt(info.balance) / BigInt(1e9)).toString();
    
    // Decode data and process it
    const decodedData = decodeBase64(info.data);
    const processedData = processDecodedData(decodedData);
    const imageUrl = extractImageUrl(processedData);
    
    // Create a formatted object with the data we want to display
    const formattedInfo = {
        Balance: `${balanceInTON} TON`,
        State: info.state,
        'Last Transaction': {
            Lt: info.last_transaction_id.lt,
            Hash: truncateString(info.last_transaction_id.hash, 20)
        },
        'Block ID': {
            Workchain: info.block_id.workchain,
            Shard: info.block_id.shard,
            Seqno: info.block_id.seqno,
            'Root Hash': truncateString(info.block_id.root_hash, 20),
            'File Hash': truncateString(info.block_id.file_hash, 20)
        },
        'Sync Time': new Date(info.sync_utime * 1000).toLocaleString()
    };

    // Create HTML content
    let htmlContent = '<h3>Token Information:</h3>';
    
    // Add image if found
    if (imageUrl) {
        htmlContent += `<img src="${imageUrl}" alt="Token Image" style="max-width: 200px; max-height: 200px;"><br>`;
    }
    
    for (const [key, value] of Object.entries(formattedInfo)) {
        if (typeof value === 'object') {
            htmlContent += `<details>
                                <summary>${key}</summary>
                                <ul>
                                    ${Object.entries(value).map(([subKey, subValue]) => 
                                        `<li><strong>${subKey}:</strong> ${subValue}</li>`
                                    ).join('')}
                                </ul>
                            </details>`;
        } else {
            htmlContent += `<p><strong>${key}:</strong> ${value}</p>`;
        }
    }

    htmlContent += `
        <details>
            <summary>Data (Processed)</summary>
            <pre>${processedData}</pre>
        </details>
    `;

    // Add raw data in a collapsible section
    htmlContent += `
        <details>
            <summary>Raw Data</summary>
            <pre>${JSON.stringify(info, null, 2)}</pre>
        </details>
    `;

    tokenInfoElement.innerHTML = htmlContent;
}

// Helper function to truncate long strings
function truncateString(str, maxLength) {
    if (str.length <= maxLength) return str;
    return str.substr(0, maxLength) + '...';
}

// Function to decode Base64
function decodeBase64(str) {
    try {
        // For browsers
        return atob(str);
    } catch (e) {
        // For Node.js
        return Buffer.from(str, 'base64').toString('utf-8');
    }
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
        scrollToBottom();
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
            scrollToBottom();
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
