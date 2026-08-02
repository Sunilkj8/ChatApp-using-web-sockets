import { io, Socket } from 'socket.io-client';

const URL = 'https://sniz.onrender.com';

export const socket: Socket = io(URL, {
  autoConnect: false,
});
