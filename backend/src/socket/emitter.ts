import { getIO } from "./socket";
import { SOCKET_EVENTS } from "./events";

export function emitMetricsUpdated(payload: unknown, userId:string){
    getIO().to(`user:${userId}`).emit(SOCKET_EVENTS.METRICS_UPDATED, payload);
}

export function emitServicesUpdated(payload: unknown, userId:string){
    getIO().to(`user:${userId}`).emit(SOCKET_EVENTS.SERVICES_UPDATED, payload);
}

export function emitServerOffline(payload: unknown, userId:string){
    getIO().to(`user:${userId}`).emit(SOCKET_EVENTS.SERVER_OFFLINE, payload);
}

export function emitAlertCreated(alert: unknown, userId:string){
    getIO().to(`user:${userId}`).emit(SOCKET_EVENTS.ALERT_CREATED, alert);
}

export function emitAlertResolved(alert: unknown, userId:string){
    getIO().to(`user:${userId}`).emit(SOCKET_EVENTS.ALERT_RESOLVED, alert);
}
