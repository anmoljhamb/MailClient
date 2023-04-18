import http from "http";
import { Server } from "socket.io";
import app from "./app";
import nodemailer from "nodemailer";
import Imap from "imap";
import { ParsedMail, simpleParser } from "mailparser";
import {
    AuthDetailsInterface,
    ImapsInterface,
    MailOptionsInterface,
    SMTPMapsInterface,
} from "./types";

const NUMBER = 5;
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
const smtpTransports: SMTPMapsInterface = {};
const imaps: ImapsInterface = {};
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
        if (smtpTransports[socket.id]) {
            console.log(
                `closing smtpTransports for the socket id ${socket.id}`
            );
            smtpTransports[socket.id].close();
        }
        if (imaps[socket.id]) {
            imaps[socket.id].end();
        }
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
                    const imapConfig = {
                        user: authDetails[socket.id].email,
                        password: authDetails[socket.id].password,
                        host: "imap.gmail.com",
                        port: 993,
                        tls: true,
                        tlsOptions: {
                            rejectUnauthorized: false,
                        },
                        authTimeout: 3000,
                    };

                    imaps[socket.id] = new Imap(imapConfig);

                    imaps[socket.id].on("ready", () => {
                        imaps[socket.id].openBox("INBOX", true, (err, box) => {
                            if (err) throw err;
                            console.log("imap server ready. ");
                        });
                    });

                    imaps[socket.id].on("mail", (number: number) => {
                        imaps[socket.id].openBox("INBOX", true, (err, box) => {
                            if (err) throw err;
                        });
                        console.log(`Got ${number} new mails. Fetching ...`);
                        _getEmails(imaps[socket.id], 0, 19);
                    });

                    imaps[socket.id].once("error", (err: any) => {
                        console.log(err);
                    });

                    imaps[socket.id].once("end", () => {
                        console.log(
                            `IMAPConnection ended for the id ${socket.id}`
                        );
                    });

                    imaps[socket.id].connect();
                }
                socket.emit("verified", { verified });
            } catch (error) {
                console.log(error);
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

    type ScheduleOptions = MailOptionsInterface & { time: string };
    socket.on("scheduleMail", (mailOptions: ScheduleOptions) => {
        const currentTime = new Date();
        const scheduledTime = new Date(mailOptions.time);

        setTimeout(() => {
            console.log("scheduled for the given time.");
            if (smtpTransports[socket.id]) {
                smtpTransports[socket.id].sendMail(
                    { ...mailOptions },
                    (error, info) => {
                        if (error) console.log(error);
                        console.log(info);
                        socket.emit("sentMail", info);
                    }
                );
            }
        }, scheduledTime.getTime() - currentTime.getTime());

        socket.emit(
            "sentMail",
            `mail will be sent in ${
                scheduledTime.getTime() - currentTime.getTime()
            }`
        );
    });

    socket.on(
        "fetchMails",
        ({
            lowerRange,
            upperRange,
        }: {
            lowerRange: number;
            upperRange: number;
        }) => {
            console.log(`fetchMails, (${lowerRange}, ${upperRange})`);
            // console.log(imaps[socket.id].state);
            if (imaps[socket.id].state === "authenticated")
                _getEmails(imaps[socket.id], lowerRange, upperRange - 1);
        }
    );

    function _getEmails(imap: Imap, lowerRange: number, upperRange: number) {
        imap.openBox("INBOX", true, (err, box) => {
            if (err) throw err;

            const f = imap.seq.fetch(
                `${box.messages.total - upperRange}:${
                    box.messages.total - lowerRange
                }`,
                {
                    bodies: "",
                }
            );

            const parsedMails: ParsedMail[] = [];

            f.on("message", (msg, seq) => {
                msg.on("body", (stream) => {
                    simpleParser(stream, (err, parsed) => {
                        if (err) console.log(err);
                        parsedMails.push(parsed);

                        socket.emit("fetchMail", {
                            mail: parsed,
                            mailNumber: seq,
                        });
                    });
                });
            });

            f.once("error", (ex) => {
                return Promise.reject(ex);
            });

            f.on("end", () => {
                console.log("Done fetching all messages!");
                socket.emit("mailsNumber", box.messages.total);
            });
        });
    }
});

server.listen(PORT, () => {
    console.log(`Listening on the url *:${PORT}`);
});
