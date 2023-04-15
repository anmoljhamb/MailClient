import { ComposeNew } from "./";
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
} from "react-bootstrap";
import { GrAdd } from "react-icons/gr";
import { SocketContext } from "../contexts/Socket";
import { SocketContextInterface, SocketInterface } from "../types";

const Dashboard = () => {
    const [toEmail, setToEmail] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [cc, setCc] = useState<string>("");
    const [bcc, setBcc] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [addNew, setAddNew] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false);

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
            // todo clear every other values.
        });

        return () => {
            socket.off("sentMail");
        };
    }, []);

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
