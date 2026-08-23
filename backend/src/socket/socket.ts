import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { SOCKET_EVENTS } from "./events";

let io: SocketIOServer;

export function initializeSocket(server: HTTPServer): SocketIOServer{
    io = new SocketIOServer(server, {
        cors: {
            origin: "*",
            credentials: true,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        },
    });
    
    io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
        console.log(`Client Connected: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });


    return io;
}





export function getIO(){
    if(!io){
        throw new Error("Socket.IO not initialized");
    }

    return io;
}