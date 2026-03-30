"use client";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
export const initializeSocket = (): Socket => {
    // We send a tiny request to wake up the next.js api handler
    fetch('/api/socket').finally(() => {
        console.log("Socket handler pinged");
    });
    
    socket = io(undefined, {
        path: '/api/socket',
        addTrailingSlash: false,
    }); 
    return socket;
};
export const destroySocket = () => {
    if (socket) socket.disconnect();
};
