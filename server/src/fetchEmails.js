const Imap = require("imap"),
    inspect = require("util").inspect;

const myMail = "@gmail.com";
const myPwd = "***";

let getEmailFromInbox = (mailServer) => {
    mailServer.openBox("INBOX", true, function (err, box) {
        if (err) throw err;

        let f = mailServer.seq.fetch("1:*", {
            bodies: "HEADER.FIELDS (FROM TO SUBJECT DATE)",
            struct: true,
        });

        f.on("message", function (msg, seqno) {
            console.log("Message #%d", seqno);
            let prefix = "(#" + seqno + ") ";

            msg.on("body", function (stream, info) {
                let buffer = "";

                stream.on("data", function (chunk) {
                    buffer += chunk.toString("utf8");
                });

                stream.once("end", function () {
                    console.log(
                        prefix + "Parsed header: %s",
                        inspect(Imap.parseHeader(buffer))
                    );
                });
            });
        });

        f.once("error", function (err) {
            console.log("Fetch error: " + err);
        });

        f.once("end", function () {
            console.log("Done fetching all messages!");
        });
    });
};

let createLabel = (mailServer, labelName) => {
    mailServer.addBox(labelName, (err) => {});
    console.log("message", "New Label or Box Created");
};

let getMailboxStatusByName = (mailServer, inboxName) => {
    mailServer.status(inboxName, (err, mailbox) => {
        console.log("message", mailbox);
    });
    console.log("message", "Label or Box Status");
};

let getMailBoxLabels = (mailServer) => {
    mailServer.getBoxes((error, mailbox) => {
        console.log("message", mailbox);
    });
};

let deleteLabel = (mailServer, labelName) => {
    mailServer.delBox(labelName, (error) => {});
    console.log("message", "Label or Box removed");
};

let mailServer1 = new Imap({
    user: myMail,
    password: myPwd,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false,
    },
    authTimeout: 3000,
}).once("error", function (err) {
    console.log("Source Server Error:- ", err);
});
mailServer1.once("ready", function () {
    mailServer1.openBox("INBOX", true, function (err, box) {
        if (err) throw err;
        console.log("message", "server1 ready");
    });

    // mail operation
    //getMailBoxLabels(mailServer1);
    getEmailFromInbox(mailServer1);
    //createLabel(mailServer1, "demo-label1");
    //deleteLabel(mailServer1, "demo-label1");
    //getMailboxStatusByName(mailServer1, "INBOX");
});

mailServer1.connect();
