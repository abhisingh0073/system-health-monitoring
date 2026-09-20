import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { SOCKET_EVENTS } from "./events";
import * as cookie from "cookie";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

let io: SocketIOServer;


export function initializeSocket(server: HTTPServer): SocketIOServer{
    io = new SocketIOServer(server, {
        cors: {
            // origin: "*",
            origin: "http://localhost:3000",
            credentials: true,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        },
    });
    
  

    io.use((socket, next) => {
        try{
            const rawCookie = socket.handshake.headers.cookie;

            if(!rawCookie){
                return next(new Error("Authentication required"));
            }

            const match = rawCookie.match(/(?:^|;\s*)access_token=([^;]+)/);

            // const cookies = parse(rawCookie);
            // const accessToken = cookies.access_token;

            const accessToken = match?.[1];

            if(!accessToken) {
                return next(new Error("Authentication required"));
            }

            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as { userId: string; };

            socket.data.userId = decoded.userId;

            next();

        } catch(error){
            console.error("Error from socket backend file", error);
            next(new Error("Invalid authentication"))
        }
    })


    io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
        
        const userId = socket.data.userId;
        socket.join(`user:${userId}`);

        console.log(`Client Connect: ${socket.id} (User Id: ${userId})`);
        console.log("socket room", socket.rooms);


        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    })


    return io;
}





export function getIO(){
    if(!io){
        throw new Error("Socket.IO not initialized");
    }

    return io;
}









