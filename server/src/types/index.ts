import { createTransport } from "nodemailer";

export interface SMTPMapsInterface {
    [key: string]: ReturnType<typeof createTransport>;
}

export interface MailOptionsInterface {
    to: string;
    subject: string;
    text: string;
    cc: string;
    bcc: string;
}
