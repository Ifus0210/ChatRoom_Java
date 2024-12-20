const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { Eta } = require('eta');
const initializeSocket = require('./server/socket');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Eta template engine configuration
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

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route configuration
app.get('/', (req, res) => {
    res.render('layouts/main');
});

// Initialize Socket.IO
initializeSocket(io);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
