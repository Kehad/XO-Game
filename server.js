import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
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

    httpServer
        .once('error', (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
