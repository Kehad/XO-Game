import { Server as ServerIO } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as NetServer } from 'http';
import type { Socket as NetSocket } from 'net';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface SocketServer extends NetServer {
  io?: ServerIO;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io server...');
    const io = new ServerIO(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
    });
    
    io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('join_room', (data) => {
        const { roomCode, name, isHost } = data;
        socket.join(roomCode);
        console.log(`${name} ${isHost ? 'created' : 'joined'} room: ${roomCode}`);

        socket.to(roomCode).emit('player_joined', { id: socket.id, name, isHost });
        socket.emit('room_joined');
      });

      socket.on('player_info', (data) => {
        socket.to(data.roomCode).emit('player_info', data);
      });

      socket.on('move', (data) => {
        socket.to(data.roomCode).emit('move', data);
      });

      socket.on('reset', (data) => {
        socket.to(data.roomCode).emit('reset', data);
      });

      socket.on('newGame', (data) => {
        socket.to(data.roomCode).emit('newGame', data);
      });

      socket.on('disconnecting', () => {
        for (const room of socket.rooms) {
          if (room !== socket.id) {
            socket.to(room).emit('opponent_disconnected');
          }
        }
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
