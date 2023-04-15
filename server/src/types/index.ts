import { createTransport } from "nodemailer";
import Imap from "imap";

export interface SMTPMapsInterface {
    [key: string]: ReturnType<typeof createTransport>;
}

export interface ImapsInterface {
    [key: string]: Imap;
}

export interface MailOptionsInterface {
    to: string;
    subject: string;
    text: string;
    cc: string;
    bcc: string;
}

export interface AuthDetailsInterface {
    [key: string]: {
        email: string;
        password: string;
    };
}
