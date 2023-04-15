import http from "http";
import { Server } from "socket.io";
import app from "./app";

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server);

io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) return next(new Error("Invalid Username"));
    (socket as any).username = username;
    next();
});

io.on("connection", (socket) => {
    console.log(`${socket.id} connected.`);
    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected.`);
    });
});

server.listen(PORT, () => {
    console.log(`Listening on the url *:${PORT}`);
});
