const http = require('http');
const express = require('express');
const path = require("path")
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io =new Server(server);

//socket.io

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('Usermessage', (message) => {
    console.log('New Usermessage:', message);
    io.emit('message', message);
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(9000, () => {
    console.log('Server Started at port 9000');
});


