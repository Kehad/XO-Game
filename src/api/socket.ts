"use client";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
export const initializeSocket = (): Socket => {
    // Note: connected to the nextjs server's custom socket instance
    socket = io(); 
    return socket;
};
export const destroySocket = () => {
    if (socket) socket.disconnect();
};
