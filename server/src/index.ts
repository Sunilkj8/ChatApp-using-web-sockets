import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupSockets } from './socket';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setupSockets(io);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
