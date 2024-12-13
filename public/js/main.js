document.addEventListener('DOMContentLoaded', () => {
    // Socket.IO 연결
    const socket = io();

    // DOM 요소
    const messageArea = document.getElementById('messageArea');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const usersList = document.getElementById('usersList');
    const userCount = document.getElementById('userCount');

    // 사용자 이름 입력
    let username = null;
    while (!username) {
        username = prompt('닉네임을 입력하세요:');
    }

    // 서버에 접속 알림
    socket.emit('user join', username);

    // 메시지 전송 함수
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

    // 이벤트 리스너
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // 메시지 수신 처리
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

    // 사용자 목록 업데이트
    socket.on('users update', (users) => {
        usersList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user;
            usersList.appendChild(li);
        });
        userCount.textContent = users.length;
    });

    // 시스템 메시지 처리
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
