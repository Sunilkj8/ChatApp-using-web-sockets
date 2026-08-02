import { Server, Socket } from 'socket.io';

export interface User {
  id: string;
  username: string;
  room?: string;
}

const users = new Map<string, User>(); // Socket ID -> User

export const setupSockets = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register user
    socket.on('register', (username: string) => {
      const user: User = { id: socket.id, username };
      users.set(socket.id, user);
      
      // Broadcast updated user list to everyone
      io.emit('users', Array.from(users.values()));
      console.log(`${username} registered (${socket.id})`);
    });

    // Join room
    socket.on('join_room', (room: string) => {
      const user = users.get(socket.id);
      if (user) {
        // Leave previous room if any
        if (user.room) {
          socket.leave(user.room);
          socket.to(user.room).emit('room_message', {
            id: Date.now().toString(),
            senderId: 'system',
            senderName: 'System',
            content: `${user.username} left the room.`,
            timestamp: new Date().toISOString()
          });
        }
        
        // Join new room
        socket.join(room);
        user.room = room;
        users.set(socket.id, user);
        
        // Notify room
        socket.to(room).emit('room_message', {
          id: Date.now().toString(),
          senderId: 'system',
          senderName: 'System',
          content: `${user.username} joined the room!`,
          timestamp: new Date().toISOString()
        });

        // Broadcast updated user list to everyone
        io.emit('users', Array.from(users.values()));
        console.log(`${user.username} joined room: ${room}`);
      }
    });

    // Handle room message
    socket.on('send_room_message', (data: { room: string, content: string }) => {
      const user = users.get(socket.id);
      if (user) {
        io.to(data.room).emit('room_message', {
          id: Date.now().toString(),
          senderId: user.id,
          senderName: user.username,
          content: data.content,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Handle private message
    socket.on('send_private_message', (data: { to: string, content: string }) => {
      const user = users.get(socket.id);
      if (user) {
        const message = {
          id: Date.now().toString(),
          senderId: user.id,
          senderName: user.username,
          content: data.content,
          timestamp: new Date().toISOString()
        };
        // Send to receiver
        socket.to(data.to).emit('private_message', message);
        // Send back to sender for their own UI
        socket.emit('private_message', message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      const user = users.get(socket.id);
      if (user) {
        if (user.room) {
          socket.to(user.room).emit('room_message', {
            id: Date.now().toString(),
            senderId: 'system',
            senderName: 'System',
            content: `${user.username} left the room.`,
            timestamp: new Date().toISOString()
          });
        }
        users.delete(socket.id);
        io.emit('users', Array.from(users.values()));
      }
    });
  });
};
