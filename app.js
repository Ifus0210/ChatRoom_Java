const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { Eta } = require('eta');
const initializeSocket = require('./server/socket');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Eta 템플릿 엔진 설정
const viewsPath = path.join(__dirname, 'views');
const eta = new Eta({
    views: viewsPath,
    cache: true,
    useWith: true,
    root: viewsPath
});

app.engine('eta', (filePath, options, callback) => {
    try {
        const templatePath = path.relative(viewsPath, filePath);
        const html = eta.render(templatePath, options);
        callback(null, html);
    } catch (err) {
        callback(err);
    }
});

app.set('view engine', 'eta');
app.set('views', viewsPath);

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 라우트 설정
app.get('/', (req, res) => {
    res.render('layouts/main');
});

// Socket.IO 초기화
initializeSocket(io);

// 서버 시작
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
