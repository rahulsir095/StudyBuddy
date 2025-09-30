// utils/socket.ts
import { io } from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "http://localhost:4000";

export const socket = io(ENDPOINT, {
  transports: ["websocket"], 
});
