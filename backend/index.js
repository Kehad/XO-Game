import { PeerServer } from 'peer';

const port = process.env.PORT || 3000;

// app.get('/', (req, res) => res.send('Tic-Tac-Toe Signaling Server is Running!'));

const peerServer = PeerServer({
    port: port,
    path: '/myapp',
    // proxied: true, // Enable if behind a proxy
    // secure: false, // Use true with HTTPS
});

peerServer.on('connection', (client) => {
    console.log(`Client connected: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
    console.log(`Client disconnected: ${client.getId()}`);
});

console.log(`PeerJS Server running on port ${port} at path /myapp`);
