import Peer from 'peerjs';

let peerInstance: Peer | null = null;

export const initializePeer = (id?: string): Peer => {
    if (peerInstance) {
        peerInstance.destroy();
    }

    peerInstance = new Peer(id || '', {
        host: 'localhost',
        port: 3000,
        path: '/myapp',
    });

    return peerInstance;
};

export const getPeer = (): Peer | null => peerInstance;

export const destroyPeer = () => {
    if (peerInstance) {
        peerInstance.destroy();
        peerInstance = null;
    }
};
