import { ComposeNew, Inbox } from "./";
import React, {
    ChangeEvent,
    FormEvent,
    useContext,
    useEffect,
    useRef,
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
import {
    FileRefInterface,
    SocketContextInterface,
    SocketInterface,
} from "../types";
import { ParsedMail } from "mailparser";

const Dashboard = () => {
    const [toEmail, setToEmail] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [cc, setCc] = useState<string>("");
    const [bcc, setBcc] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [scheduledDate, setScheduledDate] = useState<string>("");
    const [addNew, setAddNew] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    const [mails, setMails] = useState<ParsedMail[]>([]);
    const [lowerRange, setLowerRange] = useState<number>(0);
    const [stepCount, setStepCount] = useState<number>(20);
    const [upperRange, setUpperRange] = useState<number>(0 + stepCount);
    const [mailsNumber, setMailsNumber] = useState<number>(20);
    const [mailsMap, setMailsMap] = useState<{ [key: number]: ParsedMail }>({});
    const fileRef = useRef<HTMLInputElement>(null);

    const { socketRef } = useContext(SocketContext) as SocketContextInterface;
    const socket = socketRef.current as SocketInterface;

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);

        const attachments: any[] = [];
        if (fileRef.current?.files) {
            console.log(fileRef.current.files);
            if (fileRef.current?.files?.length > 0) {
                attachments.push({
                    filename: fileRef.current.files[0].name,
                    content: fileRef.current.files[0],
                });
            }
        }

        if (scheduledDate.length > 0) {
            socket.emit("scheduleMail", {
                to: toEmail,
                subject,
                text,
                from: sessionStorage.getItem("email"),
                cc,
                bcc,
                attachments,
                time: scheduledDate,
            });
        } else
            socket.emit("sendMail", {
                to: toEmail,
                subject,
                text,
                from: sessionStorage.getItem("email"),
                cc,
                bcc,
                attachments,
            });
    };

    useEffect(() => {
        socket.on("sentMail", (args) => {
            console.log(args);
            setAddNew(false);
            setSending(false);
            if (args instanceof Object) {
                if ("accepted" in args) setMessage("Email Sent!");
                if ("scheduled" in args) setMessage("Scheduled Email Sent!");
            } else {
                setMessage("Mail Scheduled!");
                setScheduledDate("");
            }
            // todo clear every other values.
        });

        socket.on(
            "fetchMail",
            ({
                mail,
                mailNumber,
            }: {
                mail: ParsedMail;
                mailNumber: number;
            }) => {
                setMailsMap((old) => {
                    return { ...old, [mailNumber]: mail };
                });
            }
        );

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
        if (Object.keys(mailsMap).length === stepCount) {
            for (
                let i = mailsNumber - upperRange + 1;
                i <= mailsNumber - lowerRange;
                i++
            ) {
                setMails((old) => [mailsMap[i], ...old]);
            }
            console.log("setMails");
            setMailsMap({});
            setProcessing(false);
        }
        console.log(`mailsMap.length: ${Object.keys(mailsMap).length}`);
    }, [mailsMap]);

    useEffect(() => {
        console.log(mails);
        if (mails.length > 20) {
            setMails((old) => old.slice(0, 20));
        }
    }, [mails]);

    useEffect(() => {
        console.log("fetching mails");
        socket.emit("fetchMails", { lowerRange, upperRange });
        setProcessing(true);
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
                    processing,
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
                    fileRef={fileRef as FileRefInterface}
                    scheduledDate={scheduledDate}
                    setScheduledDate={setScheduledDate}
                />
            )}
        </>
    );
};

export default Dashboard;
