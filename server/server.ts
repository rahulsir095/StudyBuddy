import { app } from "./app";
import { initSocketServer } from "./socketServer";
import { connectDb } from "./utils/db";
require("dotenv").config();
import { v2 as cloudinary } from 'cloudinary';
import http from "http";

const server = http.createServer(app);


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process
        .env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET_KEY
});

initSocketServer(server);
const port = process.env.PORT;
server.listen(port, () => {
    console.log(`Server is live on ${port}`);
    connectDb();
})
