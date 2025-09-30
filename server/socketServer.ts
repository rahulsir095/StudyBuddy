import { Server as SocketIOServer } from "socket.io";
import http from "http";
require("dotenv").config();

export const initSocketServer = (server: http.Server) => {
   const io = new SocketIOServer(server, {
      cors: {
         origin: process.env.ORIGIN,
         methods: ["GET", "POST"],
      },
   });

   io.on("connection", (socket) => {
      // Listen for 'notification' event from the frontend
      socket.on("notification", (data) => {
         // Broadcast the notification data to all connected clients
         io.emit("newNotification", data);
      });

      // Handle disconnection
      socket.on("disconnect", () => {});
   });
};
