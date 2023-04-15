const Imap = require("imap");
const { simpleParser } = require("mailparser");
const dotenv = require("dotenv");
dotenv.config();

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const NUMBER = 0;

const imapConfig = {
    user: EMAIL,
    password: PASSWORD,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false,
    },
    authTimeout: 3000,
};

const _getEmails = (imap) => {
    imap.openBox("INBOX", true, (err, box) => {
        if (err) throw err;

        const f = imap.seq.fetch(
            `${box.messages.total - NUMBER}:${box.messages.total}`,
            {
                bodies: "",
            }
        );

        f.on("message", (msg) => {
            msg.on("body", (stream) => {
                simpleParser(stream, (err, parsed) => {
                    const { from, subject, textAsHtml, text } = parsed;
                    // console.log(parsed);
                    console.log(from, subject, textAsHtml, text);
                });
            });
        });

        f.once("error", (ex) => {
            return Promise.reject(ex);
        });

        f.once("end", () => {
            console.log("Done fetching all messages!");
            // imap.end();
        });
    });
};
const imap = new Imap(imapConfig);

imap.on("ready", () => {
    imap.openBox("INBOX", true, (err, box) => {
        if (err) throw err;
        console.log("imap server ready.");
    });
    _getEmails(imap);
});

imap.on("mail", (number) => {
    console.log(`Got ${number} new mails. Fetching ...`);
    _getEmails(imap);
});

imap.once("error", (err) => {
    console.log(err);
});

imap.once("end", () => {
    console.log("Connection ended");
});

imap.connect();
