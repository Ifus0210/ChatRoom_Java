document.addEventListener('DOMContentLoaded', () => {
    // Socket.IO connection
    const socket = io();

    // DOM elements
    const messageArea = document.getElementById('messageArea');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const usersList = document.getElementById('usersList');
    const userCount = document.getElementById('userCount');

    // Get username
    let username = null;
    while (!username) {
        username = prompt('Enter your nickname:');
    }

    // Notify server of user join
    socket.emit('user join', username);

    // Message send function
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            socket.emit('chat message', {
                username: username,
                message: message,
                time: new Date().toLocaleTimeString()
            });
            messageInput.value = '';
        }
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Message receive handler
    socket.on('chat message', (data) => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${data.username === username ? 'sent' : 'received'}`;
        
        messageElement.innerHTML = `
            <div class="sender">${data.username}</div>
            <div class="content">${data.message}</div>
            <div class="time">${data.time}</div>
        `;
        
        messageArea.appendChild(messageElement);
        messageArea.scrollTop = messageArea.scrollHeight;
    });

    // Update user list
    socket.on('users update', (users) => {
        usersList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user;
            usersList.appendChild(li);
        });
        userCount.textContent = users.length;
    });

    // System message handler
    socket.on('system message', (message) => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message system';
        messageElement.innerHTML = `
            <div class="content">${message}</div>
            <div class="time">${new Date().toLocaleTimeString()}</div>
        `;
        messageArea.appendChild(messageElement);
        messageArea.scrollTop = messageArea.scrollHeight;
    });
});
