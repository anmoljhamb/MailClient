import http from "http";
import { Server } from "socket.io";
import app from "./app";
import nodemailer from "nodemailer";
import {
    AuthDetailsInterface,
    MailOptionsInterface,
    SMTPMapsInterface,
} from "./types";

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
const smtpTransports: SMTPMapsInterface = {};
const authDetails: AuthDetailsInterface = {};

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
        if (smtpTransports[socket.id]) smtpTransports[socket.id].close();
        delete smtpTransports[socket.id];
    });

    socket.on(
        "verify",
        async ({ email, password }: { email: string; password: string }) => {
            console.log("verify email and password.");
            try {
                smtpTransports[socket.id] = nodemailer.createTransport({
                    service: "gmail", // sets automatically host, port and connection security settings
                    auth: {
                        user: email,
                        pass: password,
                    },
                });
                const verified = await smtpTransports[socket.id].verify();
                if (verified) {
                    authDetails[socket.id] = {
                        email,
                        password,
                    };
                }
                socket.emit("verified", { verified });
            } catch (error) {
                console.log("error");
                socket.emit("verified", { verified: false });
            }
        }
    );

    socket.on("sendMail", (mailOptions: MailOptionsInterface) => {
        console.log(mailOptions);
        if (smtpTransports[socket.id])
            smtpTransports[socket.id].sendMail(
                { ...mailOptions },
                (error, info) => {
                    if (error) {
                        socket.emit("sentMail", error);
                    } else socket.emit("sentMail", info);
                }
            );
    });

    // socket.onAny((event, ...args) => {
    //     console.log(event, args);
    // });
});

server.listen(PORT, () => {
    console.log(`Listening on the url *:${PORT}`);
});
