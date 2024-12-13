const users = new Set();

function initializeSocket(io) {
    io.on('connection', (socket) => {
        let username = null;

        // 사용자 입장
        socket.on('user join', (name) => {
            username = name;
            users.add(username);
            
            // 시스템 메시지 전송
            io.emit('system message', `${username}님이 입장하셨습니다.`);
            
            // 사용자 목록 업데이트
            io.emit('users update', Array.from(users));
        });

        // 채팅 메시지 처리
        socket.on('chat message', (data) => {
            io.emit('chat message', data);
        });

        // 연결 종료 처리
        socket.on('disconnect', () => {
            if (username) {
                users.delete(username);
                io.emit('system message', `${username}님이 퇴장하셨습니다.`);
                io.emit('users update', Array.from(users));
            }
        });
    });
}

module.exports = initializeSocket;
