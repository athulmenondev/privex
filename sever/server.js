import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const SECRET_KEY = "supersecretkey"; // Change this later

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("send_message", (data) => {
        const encryptedMessage = CryptoJS.AES.encrypt(data.message, SECRET_KEY).toString();
        io.emit("receive_message", { user: data.user, message: encryptedMessage });
    });

    socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

server.listen(5000, () => console.log("Server running on port 5000"));
