import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export const initializeSocket = (): Socket => {
    if (!socketInstance) {
        socketInstance = io('http://localhost:3000'); // the port we defined in the backend
    }
    return socketInstance;
};

export const getSocket = (): Socket | null => socketInstance;

export const destroySocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
};
