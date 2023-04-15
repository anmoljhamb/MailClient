import { ComposeNew, Inbox } from "./";
import React, {
    ChangeEvent,
    FormEvent,
    useContext,
    useEffect,
    useState,
} from "react";
import {
    Container,
    Row,
    Col,
    CloseButton,
    Form,
    Button,
    FloatingLabel,
    Spinner,
    Toast,
} from "react-bootstrap";
import { GrAdd } from "react-icons/gr";
import { SocketContext } from "../contexts/Socket";
import { SocketContextInterface, SocketInterface } from "../types";
import { ParsedMail } from "mailparser";

const Dashboard = () => {
    const [toEmail, setToEmail] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [cc, setCc] = useState<string>("");
    const [bcc, setBcc] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [addNew, setAddNew] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false);
    const [mails, setMails] = useState<ParsedMail[]>([]);
    const [lowerRange, setLowerRange] = useState<number>(0);
    const [upperRange, setUpperRange] = useState<number>(5);
    const [mailsNumber, setMailsNumber] = useState<number>(5);
    const [stepCount, setStepCount] = useState<number>(5);

    const { socketRef } = useContext(SocketContext) as SocketContextInterface;
    const socket = socketRef.current as SocketInterface;

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);
        socket.emit("sendMail", {
            to: toEmail,
            subject,
            text,
            from: sessionStorage.getItem("email"),
            cc,
            bcc,
        });
    };

    useEffect(() => {
        socket.on("sentMail", (args) => {
            console.log(args);
            setAddNew(false);
            setSending(false);
            setMessage("Email Sent!");
            // todo clear every other values.
        });

        socket.on("fetchedMails", (mails: ParsedMail[]) => {
            setMails(mails);
        });

        socket.on("mailsNumber", (number: number) => {
            setMailsNumber(number);
        });

        return () => {
            socket.off("sentMail");
            socket.off("fethMails");
            socket.off("fethedMails");
        };
    }, []);

    useEffect(() => {
        console.log("fetching mails");
        socket.emit("fetchMails", { lowerRange, upperRange });
    }, [lowerRange, upperRange]);

    return (
        <>
            <button
                id="addNewMail"
                onClick={() => {
                    setAddNew(true);
                }}
                disabled={addNew}
            >
                <GrAdd />
            </button>
            <Inbox
                {...{
                    mails,
                    lowerRange,
                    setLowerRange,
                    upperRange,
                    setUpperRange,
                    mailsNumber,
                    stepCount,
                }}
            />
            {message.length > 0 && (
                <Toast
                    onClose={() => setMessage("")}
                    show={message.length > 0}
                    delay={3000}
                    autohide
                    id="toast"
                >
                    <Toast.Header>
                        <strong className="me-auto">Mail Client</strong>
                    </Toast.Header>
                    <Toast.Body id="toastBody">{message}</Toast.Body>
                </Toast>
            )}
            {addNew && sending && (
                <>
                    <Container id="sending">
                        <h2>Sending</h2> <Spinner animation="border" />
                    </Container>
                </>
            )}
            {addNew && !sending && (
                <ComposeNew
                    setAddNew={setAddNew}
                    handleOnSubmit={handleOnSubmit}
                    toEmail={toEmail}
                    setToEmail={setToEmail}
                    cc={cc}
                    setCc={setCc}
                    bcc={bcc}
                    setBcc={setBcc}
                    subject={subject}
                    setSubject={setSubject}
                    text={text}
                    setText={setText}
                    sending={sending}
                />
            )}
        </>
    );
};

export default Dashboard;
