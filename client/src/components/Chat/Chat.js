import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'http://localhost:5000/';
  let socket = io(ENDPOINT, { transports: ['websocket'] });


  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    //   console.log(socket);
    setName(name);
    setRoom(room);
    socket.emit('join', { name, room }, () => {});

    return () => {
      socket.emit('disconnect');

      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  return <h1>Chat</h1>;
};

export default Chat;
