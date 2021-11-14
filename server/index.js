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

    socket.emit('message', { user: 'Admin', text: `${user.name}, Welcome to the room ${user.room}` });
    socket.broadcast.to(user.room).emit('message', { user: 'Admin', text: `${user.name}, has joined! ` });

    socket.join(user.room);
    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });
    callback();
  })


  socket.on('disconnect', () => {
    console.log('User had left');
  });
});
app.use(cors());
app.use(router);
server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
