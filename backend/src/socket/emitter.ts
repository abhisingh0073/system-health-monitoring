import { getIO } from "./socket";
import { SOCKET_EVENTS } from "./events";

export function emitMetricsUpdated(payload: unknown){
    getIO().emit(SOCKET_EVENTS.METRICS_UPDATED, payload);
}

export function emitServicesUpdated(payload: unknown){
    getIO().emit(SOCKET_EVENTS.SERVICES_UPDATED, payload);
}

export function emitServerOffline(payload: unknown){
    getIO().emit(SOCKET_EVENTS.SERVER_OFFLINE, payload);
}

export function emitAlertCreated(alert: unknown){
    getIO().emit(SOCKET_EVENTS.ALERT_CREATED, alert);
}

export function emitAlertResolved(alert: unknown){
    getIO().emit(SOCKET_EVENTS.ALERT_RESOLVED, alert);
}
