import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Adjust depending on frontend URL later
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Wait for the handshake to associate an identity or join a room
    socket.on('join_room', (data) => {
        const { roomCode, name, isHost } = data;
        socket.join(roomCode);
        console.log(`${name} ${isHost ? 'created' : 'joined'} room: ${roomCode}`);

        // Notify the room that a player joined (specifically useful for host to know guest joined)
        socket.to(roomCode).emit('player_joined', { id: socket.id, name, isHost });

        // Let the joiner know they joined successfully
        socket.emit('room_joined');
    });

    socket.on('player_info', (data) => {
        // Exchange player info (Host sends info to Guest, Guest to Host)
        socket.to(data.roomCode).emit('player_info', data);
    });

    socket.on('move', (data) => {
        // Broadcast move to the room
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

app.get('/', (req, res) => res.send('Tic-Tac-Toe Socket.io Signaling Server is Running!'));

httpServer.listen(port, () => {
    console.log(`Socket.io Server running on port ${port}`);
});
