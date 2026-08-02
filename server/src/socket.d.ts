import { Server } from 'socket.io';
export interface User {
    id: string;
    username: string;
    room?: string;
}
export declare const setupSockets: (io: Server) => void;
//# sourceMappingURL=socket.d.ts.map