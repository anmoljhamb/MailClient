const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "config.env") });

const sendEmail = (account, params) => {
    // create reusable transporter object using the default SMTP transport

    console.log(account);

    var smtpTransport = nodemailer.createTransport({
        service: "gmail", // sets automatically host, port and connection security settings
        auth: {
            user: account.user,
            pass: account.password,
        },
    });

    var toEmail = params.to[0];
    for (var i = 1; i < params.to.length; i++) {
        toEmail += ", " + params.to[i];
    }

    // setup email data with unicode symbols
    var mailOptions = {
        from: account.user, // sender address
        to: toEmail, // list of receivers
        subject: params.subject, // Subject line
        text: params.text, // plain text body
        // html: params.html, // html body
        attachments: params.attachments,
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log("Error while sending mail: " + error);
        } else {
            console.log("Message sent: %s", info.messageId);
        }
        smtpTransport.close(); // shut down the connection pool, no more messages.
    });
};

const EMAIL = process.env.EMAIL_ID;
const PASSWORD = process.env.PASSWORD;

const account = {
    user: EMAIL,
    password: PASSWORD,
};

const params = {
    subject: "SAMPLE SUBJECT BRO!",
    text: "this is just my super simple subject yo?",
    to: ["talktoanmol@outlook.com", "talktoanmolj@gmail.com"],
};

console.log(account);

sendEmail(account, params);
