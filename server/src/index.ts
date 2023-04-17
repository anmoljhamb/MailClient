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
                console.log(email, password);
                const verified = await smtpTransports[socket.id].verify();
                if (verified) {
                    authDetails[socket.id] = {
                        email,
                        password,
                    };
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

            const imap = new Imap(imapConfig);

            imap.on("ready", () => {
                imap.openBox("INBOX", true, (err, box) => {
                    if (err) throw err;
                    console.log("imap server ready. ");
                });
                // _getEmails(imap, lowerRange, upperRange);
            });

            // let prevNumber = 0;

            imap.on("mail", (number: number) => {
                imap.openBox("INBOX", true, (err, box) => {
                    if (err) throw err;
                });
                // if (prevNumber !== number) {
                console.log(`Got ${number} new mails. Fetching ...`);
                _getEmails(imap, lowerRange, upperRange);
                // }
            });

            imap.once("error", (err: any) => {
                console.log(err);
            });

            imap.once("end", () => {
                console.log("Connection ended");
            });

            imap.connect();
        }
    );

    function _getEmails(imap: Imap, lowerRange: number, upperRange: number) {
        imap.openBox("INBOX", true, (err, box) => {
            if (err) throw err;

            const f = imap.seq.fetch(`${box.messages.total - upperRange}:*`, {
                bodies: "",
            });

            const parsedMails: ParsedMail[] = [];
            let count = 0;

            f.on("message", (msg) => {
                msg.on("body", (stream) => {
                    simpleParser(stream, (err, parsed) => {
                        if (err) console.log(err);
                        parsedMails.push(parsed);
                        count++;
                    });
                });
            });

            f.once("error", (ex) => {
                return Promise.reject(ex);
            });

            f.on("end", () => {
                console.log("Done fetching all messages!");
                socket.emit("fetchedMails", parsedMails);
                console.log(`fetched ${count} mails.`);
                socket.emit("mailsNumber", box.messages.total);
            });
        });
    }
});

server.listen(PORT, () => {
    console.log(`Listening on the url *:${PORT}`);
});
