const users = new Set();

function initializeSocket(io) {
    io.on('connection', (socket) => {
        let username = null;

        // User join
        socket.on('user join', (name) => {
            username = name;
            users.add(username);
            
            // Send system message
            io.emit('system message', `${username} has joined the chat.`);
            
            // Update user list
            io.emit('users update', Array.from(users));
        });

        // Handle chat message
        socket.on('chat message', (data) => {
            io.emit('chat message', data);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            if (username) {
                users.delete(username);
                io.emit('system message', `${username} has left the chat.`);
                io.emit('users update', Array.from(users));
            }
        });
    });
}

module.exports = initializeSocket;
