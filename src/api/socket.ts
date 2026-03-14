// import { io, Socket } from 'socket.io-client';

// let socketInstance: Socket | null = null;

// export const initializeSocket = (): Socket => {
//     if (!socketInstance) {
//         socketInstance = io('http://localhost:3000'); // the port we defined in the backend
//     }
//     return socketInstance;
// };

// export const getSocket = (): Socket | null => socketInstance;

// export const destroySocket = () => {
//     if (socketInstance) {
//         socketInstance.disconnect();
//         socketInstance = null;
//     }
// };

import { io } from "socket.io-client";
let socket: any;
export const initializeSocket = () => {
    // Use your actual backend URL here!
    socket = io("http://localhost:3000"); 
    return socket;
};
export const destroySocket = () => {
    if (socket) socket.disconnect();
};