const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const { addUser, getUser, removeUser, getUserInRoom } = require('./users');

const PORT = process.env.PORT || 5000;
const router = require('./router');

const app = express();
const server = http.createServer(app);

const io = socketio(server);

io.on('connection', (socket) => {
  // console.log('We have a new Connection', socket.id);
  socket.on('join', ({ name, room }, callback) => {
    // console.log(name, room);
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
  });

  socket.on('disconnect', () => {
    console.log('User had left');
  });
});
app.use(cors());
app.use(router);
server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
