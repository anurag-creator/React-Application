import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const ENDPOINT = 'http://localhost:5000/';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    setName(name);
    setRoom(room);

    let socket = io(ENDPOINT, { transports: ['websocket'] });
      console.log(socket);
  });
  return <h1>Chat</h1>;
};

export default Chat;
