// const express = require('express');
// const socketio = require('socket.io');
// const http = require('http');
// const cors = require('cors');

// const { addUser, getUser, removeUser, getUserInRoom } = require('./users');

// const PORT = process.env.PORT || 5000;
// const router = require('./router');

// const app = express();
// const server = http.createServer(app);
// app.use(cors());
// app.use(router);

// const io = socketio(server);

// io.on('connect', (socket) => {
//   socket.on('join', ({ name, room }, callback) => {
//     const { error, user } = addUser({ id: socket.id, name, room });
//     if (error) {
//       return callback(error);
//     }
//     socket.join(user.room);

//     socket.emit('message', {
//       user: 'Admin',
//       text: `${user.name}, Welcome to the room ${user.room}`,
//     });
//     socket.broadcast
//       .to(user.room)
//       .emit('message', { user: 'Admin', text: `${user.name}, has joined! ` });
//     callback();
//   });

//   socket.on('sendMessage', (message, callback) => {
//     const user = getUser(socket.id);
//     console.log(user);
//   })
//   // socket.on('sendMessage', (message, callback) => {
//   //   const user = getUser(socket.id);
//   //   io.to(user.room).emit('message', { user: user.name, text: message });
//   //   callback();
//   // });
//   socket.on('disconnect', () => {
//     console.log('User had left');
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server is up and running on port ${PORT}`);
// });

const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

let abc;

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to room ${user.room}.`,
    });
    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    console.log(user);
    abc = user;
    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    // const user = getUser(socket.id);
    console.log(abc);

    io.to(abc.room).emit('message', { user: abc.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'Admin',
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);
