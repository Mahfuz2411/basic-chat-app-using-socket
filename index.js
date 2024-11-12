import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);
const users = {};

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  // console.log('a user connected');
  socket.on('user-joined', name => {
    users[socket.id] = name;
    socket.emit('join-message', `${name} joined`);
  });

  socket.on('disconnect', () => {
    // console.log('user disconnected');
    const name = users[socket.id];
    delete users[socket.id];
    socket.emit('join-message', `${name} disconnected`);
  });

  socket.on('chat-message', msg => {
    // console.log('message: ' + msg);
    io.emit('chat message', `<<${users[socket.id]}>>: ${msg}`);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});